import { createContext, useContext, useEffect, useState } from 'react';
import {
  MOCK_APPROVAL_REQUESTS,
  MOCK_APPROVAL_CHAINS,
  buildRequestFromChain,
  ownsCurrentLevel,
  isActionable,
} from '../mock/mockApprovals';

const ApprovalsContext = createContext(null);

const LS = {
  requests: () => 'mock_approval_requests',
  chains: () => 'mock_approval_chains',
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

export const ApprovalsProvider = ({ children }) => {
  const [requests, setRequests] = useState([]);
  const [chains, setChains] = useState({});
  const [loading, setLoading] = useState(true);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const storedRequests = readJSON(LS.requests(), null);
    const storedChains = readJSON(LS.chains(), null);

    if (Array.isArray(storedRequests) && storedRequests.length > 0) {
      setRequests(storedRequests);
    } else {
      setRequests(MOCK_APPROVAL_REQUESTS);
      writeJSON(LS.requests(), MOCK_APPROVAL_REQUESTS);
    }

    if (storedChains && typeof storedChains === 'object') {
      setChains(storedChains);
    } else {
      setChains(MOCK_APPROVAL_CHAINS);
      writeJSON(LS.chains(), MOCK_APPROVAL_CHAINS);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    const onStorage = (e) => {
      if (!e.key) return;

      if (e.key === LS.requests()) {
        const next = readJSON(LS.requests(), []);
        setRequests(Array.isArray(next) ? next : []);
      } else if (e.key === LS.chains()) {
        const next = readJSON(LS.chains(), {});
        setChains(next && typeof next === 'object' ? next : {});
      }
    };

    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const persist = (nextRequests, nextChains = chains) => {
    setRequests(nextRequests);
    setChains(nextChains);
    writeJSON(LS.requests(), nextRequests);
    writeJSON(LS.chains(), nextChains);
    setVersion((v) => v + 1);
  };

  /* ============ READS ============ */

  const pendingForRoles = (userRoles = []) => {
    /* eslint-disable-next-line no-unused-vars */
    const _v = version;

    return requests
      .filter((r) => ownsCurrentLevel(r, userRoles))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  const allRequests = () => {
    /* eslint-disable-next-line no-unused-vars */
    const _v = version;

    return [...requests].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  };

  const getRequest = (id) => {
    /* eslint-disable-next-line no-unused-vars */
    const _v = version;

    return requests.find((r) => r.id === id) ?? null;
  };

  const getChain = (entityName) => chains[entityName] ?? [];

  /*
    Does any of the given roles appear in any approval chain?
    Used to gate entry to the approvals page — approval authority comes
    from chain membership, not from a permission string.
  */
  const isChainMember = (userRoles = []) => {
    /* eslint-disable-next-line no-unused-vars */
    const _v = version;

    if (!userRoles.length) return false;
    const allChainRoles = Object.values(chains).flat();
    return userRoles.some((r) => allChainRoles.includes(r));
  };

  /* ============ WRITES ============ */

  const createRequest = ({ entityName, entityId, title, requestedBy }) => {
    const chain = getChain(entityName);
    const req = buildRequestFromChain({
      entityName,
      entityId,
      title,
      requestedBy,
      chain,
    });

    persist([req, ...requests]);
    return req;
  };

  const actOnCurrentLevel = (requestId, decision, actedBy, remarks = '') => {
    const req = requests.find((r) => r.id === requestId);
    if (!req) throw new Error('Request not found');
    if (!isActionable(req)) throw new Error('Request is already finished');

    const nowIso = new Date().toISOString();
    const currentStepIndex = req.steps.findIndex(
      (s) => s.level === req.currentLevel
    );
    if (currentStepIndex === -1) throw new Error('Current step not found');

    let nextSteps;
    let nextStatus;
    let nextLevel = req.currentLevel;

    if (decision === 'approve') {
      nextSteps = req.steps.map((s, i) =>
        i === currentStepIndex
          ? { ...s, status: 'Approved', actedBy, actedAt: nowIso, remarks }
          : s
      );

      const isLastLevel = req.currentLevel >= req.totalLevels;
      if (isLastLevel) {
        nextStatus = 'Approved';
      } else {
        nextStatus = 'InReview';
        nextLevel = req.currentLevel + 1;
      }
    } else if (decision === 'reject') {
      nextSteps = req.steps.map((s, i) => {
        if (i === currentStepIndex) {
          return { ...s, status: 'Rejected', actedBy, actedAt: nowIso, remarks };
        }
        if (s.status === 'Pending' && s.level > req.currentLevel) {
          return { ...s, status: 'Cancelled' };
        }
        return s;
      });
      nextStatus = 'Rejected';
    } else {
      throw new Error('Invalid decision');
    }

    const updated = {
      ...req,
      steps: nextSteps,
      currentLevel: nextLevel,
      status: nextStatus,
    };

    persist(requests.map((r) => (r.id === requestId ? updated : r)));
    return updated;
  };

  const cancelRequest = (requestId, cancelledBy, userRoles = []) => {
    const req = requests.find((r) => r.id === requestId);
    if (!req) throw new Error('Request not found');
    if (!isActionable(req)) {
      throw new Error('Only pending requests can be cancelled');
    }

    const isRequester = req.requestedBy === cancelledBy;
    const isAdmin = userRoles.includes('SYS_ADMIN');

    if (!isRequester && !isAdmin) {
      throw new Error(
        'Only the original requester or a System Admin can cancel this request.'
      );
    }

    const updated = {
      ...req,
      status: 'Cancelled',
      steps: req.steps.map((s) =>
        s.status === 'Pending' ? { ...s, status: 'Cancelled' } : s
      ),
    };

    persist(requests.map((r) => (r.id === requestId ? updated : r)));
    return updated;
  };

  /* ============ CHAIN CONFIG ============ */

  const setChain = (entityName, roleCodes) => {
    if (!Array.isArray(roleCodes) || roleCodes.length === 0) {
      throw new Error('Chain must contain at least one role');
    }
    const nextChains = { ...chains, [entityName]: roleCodes };
    persist(requests, nextChains);
  };

  /* ============ HELPERS ============ */

  const currentLevelRole = (request) => {
    if (!request) return null;
    const step = request.steps.find((s) => s.level === request.currentLevel);
    return step?.approverRoleCode ?? null;
  };

  return (
    <ApprovalsContext.Provider
      value={{
        loading,

        /* reads */
        pendingForRoles,
        allRequests,
        getRequest,
        getChain,
        currentLevelRole,
        isChainMember,

        /* writes */
        createRequest,
        actOnCurrentLevel,
        cancelRequest,

        /* chain config */
        setChain,
      }}
    >
      {children}
    </ApprovalsContext.Provider>
  );
};

export const useApprovals = () => {
  const ctx = useContext(ApprovalsContext);
  if (!ctx) throw new Error('useApprovals must be used inside <ApprovalsProvider>');
  return ctx;
};