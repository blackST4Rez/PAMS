import { useEffect, useState } from 'react';

/*
  Hook: returns true if the viewport is currently phone-sized (< 640px).
  Re-renders when the breakpoint is crossed so consumers update their
  page size accordingly.
*/
export const useIsMobile = (breakpoint = 640) => {
    const [isMobile, setIsMobile] = useState(() => {
        if (typeof window === 'undefined') return false;
        return window.innerWidth < breakpoint;
    });

    useEffect(() => {
        const onResize = () => {
            setIsMobile(window.innerWidth < breakpoint);
        };
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, [breakpoint]);

    return isMobile;
};

/*
  Reusable pagination control — professional pill style.
*/
const Pagination = ({ page, totalPages, onPage }) => {
    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-center pt-4">
            <div className="inline-flex items-center gap-1 bg-[#1a1a1a] border border-white/10 p-1">
                {/* Previous */}
                <button
                    onClick={() => onPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="flex items-center justify-center w-8 h-8 text-white/70 hover:bg-white/5 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-colors"
                    aria-label="Previous page"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6" />
                    </svg>
                </button>

                {/* Page numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                    <button
                        key={n}
                        onClick={() => onPage(n)}
                        className={`flex items-center justify-center min-w-8 h-8 px-2 text-xs font-medium transition-colors ${n === page
                                ? 'bg-[#173ef0] text-white'
                                : 'text-white/60 hover:bg-white/5 hover:text-white'
                            }`}
                    >
                        {n}
                    </button>
                ))}

                {/* Next */}
                <button
                    onClick={() => onPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="flex items-center justify-center w-8 h-8 rounded-md text-white/70 hover:bg-white/5 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-colors"
                    aria-label="Next page"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default Pagination;