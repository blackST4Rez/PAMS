import { createContext, useContext, useEffect, useState } from 'react';
import {
    MOCK_DEPRECIATION_RUNS,
    MOCK_REVALUATIONS,
    applyOneYear,
    isDepreciable,
    fiscalYearOf,
    makeRunId,
    makeRevaluationId,
} from '../mock/mockValuation';
import { logAuditEvent } from './AuditContext';

const ValuationContext = createContext(null);

const LS = {
    runs: () => 'mock_depreciation_runs',
    revaluations: () => 'mock_revaluations',
};

const readJSON = (key, fallback) => {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    } catch {
        return fallback;
    }
};

const writeJSON = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch {
        /* quota exceeded or private mode — ignore */
    }
};

export const ValuationProvider = ({ children }) => {
    const [runs, setRuns] = useState([]);
    const [revaluations, setRevaluations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [version, setVersion] = useState(0);

    useEffect(() => {
        const storedRuns = readJSON(LS.runs(), null);
        const storedRevs = readJSON(LS.revaluations(), null);

        if (Array.isArray(storedRuns) && storedRuns.length > 0) {
            setRuns(storedRuns);
        } else {
            setRuns(MOCK_DEPRECIATION_RUNS);
            writeJSON(LS.runs(), MOCK_DEPRECIATION_RUNS);
        }

        if (Array.isArray(storedRevs) && storedRevs.length > 0) {
            setRevaluations(storedRevs);
        } else {
            setRevaluations(MOCK_REVALUATIONS);
            writeJSON(LS.revaluations(), MOCK_REVALUATIONS);
        }

        setLoading(false);
    }, []);

    useEffect(() => {
        const onStorage = (e) => {
            if (!e.key) return;

            if (e.key === LS.runs()) {
                const next = readJSON(LS.runs(), []);
                setRuns(Array.isArray(next) ? next : []);
            } else if (e.key === LS.revaluations()) {
                const next = readJSON(LS.revaluations(), []);
                setRevaluations(Array.isArray(next) ? next : []);
            }
        };

        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
    }, []);

    const persist = (nextRuns, nextRevaluations = revaluations) => {
        setRuns(nextRuns);
        setRevaluations(nextRevaluations);
        writeJSON(LS.runs(), nextRuns);
        writeJSON(LS.revaluations(), nextRevaluations);
        setVersion((v) => v + 1);
    };

    /* ============ READS ============ */

    const allRuns = () => {
        /* eslint-disable-next-line no-unused-vars */
        const _v = version;

        return [...runs].sort(
            (a, b) => new Date(b.runAt) - new Date(a.runAt)
        );
    };

    const latestRun = () => {
        /* eslint-disable-next-line no-unused-vars */
        const _v = version;

        return allRuns()[0] ?? null;
    };

    const revaluationsForAsset = (assetId) => {
        /* eslint-disable-next-line no-unused-vars */
        const _v = version;

        return revaluations
            .filter((r) => r.assetId === assetId)
            .sort((a, b) => new Date(b.at) - new Date(a.at));
    };

    const allRevaluations = () => {
        /* eslint-disable-next-line no-unused-vars */
        const _v = version;

        return [...revaluations].sort(
            (a, b) => new Date(b.at) - new Date(a.at)
        );
    };

    /* ============ WRITES ============ */

    const runDepreciation = async ({
        assets,
        runBy,
        notes = '',
        updateAssetValues,
    }) => {
        if (!Array.isArray(assets)) throw new Error('Asset list required');
        if (typeof updateAssetValues !== 'function') {
            throw new Error('Asset update function required');
        }

        const eligible = assets.filter(isDepreciable);
        if (eligible.length === 0) {
            throw new Error('No assets are eligible for depreciation');
        }

        const changes = [];
        let totalDepreciation = 0;

        for (const asset of eligible) {
            const { amount, nextBookValue } = applyOneYear(asset);
            if (amount > 0) {
                changes.push({
                    assetId: asset.id,
                    before: asset.currentBookValue,
                    after: nextBookValue,
                    amount,
                });
                totalDepreciation += amount;
            }
        }

        if (changes.length === 0) {
            throw new Error('No asset values changed — nothing to record');
        }

        updateAssetValues(
            changes.map((c) => ({ id: c.assetId, currentBookValue: c.after }))
        );

        const fy = fiscalYearOf();
        const run = {
            id: makeRunId(),
            fiscalYear: fy.label,
            runAt: new Date().toISOString(),
            runBy: runBy ?? 'unknown',
            assetsAffected: changes.length,
            totalDepreciation,
            notes,
            changes,
        };

        persist([run, ...runs]);

        logAuditEvent({
            entityType: 'valuation',
            entityId: run.id,
            action: 'RUN',
            actor: run.runBy,
            summary: `Ran depreciation for ${run.fiscalYear} — ${run.assetsAffected} assets affected, total ${run.totalDepreciation}`,
            before: null,
            after: {
                fiscalYear: run.fiscalYear,
                assetsAffected: run.assetsAffected,
                totalDepreciation: run.totalDepreciation,
            },
        });

        return run;
    };

    const revalueAsset = async ({
        asset,
        newValue,
        reason,
        by,
        updateAssetValues,
    }) => {
        if (!asset) throw new Error('Asset is required');
        if (typeof updateAssetValues !== 'function') {
            throw new Error('Asset update function required');
        }
        const numeric = Number(newValue);
        if (!Number.isFinite(numeric) || numeric < 0) {
            throw new Error('New value must be zero or a positive number');
        }
        if (!reason?.trim()) {
            throw new Error('Reason is required');
        }

        const previousValue = Number(asset.currentBookValue) || 0;

        updateAssetValues([
            { id: asset.id, currentBookValue: numeric },
        ]);

        const record = {
            id: makeRevaluationId(),
            assetId: asset.id,
            assetCode: asset.assetCode,
            assetTitle: asset.title,
            previousValue,
            newValue: numeric,
            reason: reason.trim(),
            at: new Date().toISOString(),
            by: by ?? 'unknown',
        };

        persist(runs, [record, ...revaluations]);

        logAuditEvent({
            entityType: 'valuation',
            entityId: record.id,
            action: 'UPDATE',
            actor: record.by,
            summary: `Revalued asset "${asset.title}" (${asset.assetCode}) from ${previousValue} to ${numeric}`,
            before: { currentBookValue: previousValue },
            after: { currentBookValue: numeric, reason: record.reason },
        });

        return record;
    };

    return (
        <ValuationContext.Provider
            value={{
                loading,

                allRuns,
                latestRun,
                allRevaluations,
                revaluationsForAsset,

                runDepreciation,
                revalueAsset,
            }}
        >
            {children}
        </ValuationContext.Provider>
    );
};

export const useValuation = () => {
    const ctx = useContext(ValuationContext);
    if (!ctx) {
        throw new Error('useValuation must be used inside <ValuationProvider>');
    }
    return ctx;
};