import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ page, pages, total, limit, onPageChange }) => {
    if (!pages || pages <= 1) return null;

    const start = (page - 1) * limit + 1;
    const end = Math.min(page * limit, total);

    // Generate page numbers with ellipsis
    const getPageNumbers = () => {
        const nums = [];
        const delta = 2;
        const left = Math.max(2, page - delta);
        const right = Math.min(pages - 1, page + delta);

        nums.push(1);
        if (left > 2) nums.push('...');
        for (let i = left; i <= right; i++) nums.push(i);
        if (right < pages - 1) nums.push('...');
        if (pages > 1) nums.push(pages);

        return nums;
    };

    return (
        <div className="admin-pagination">
            <div className="admin-pagination-info">
                Showing {start}–{end} of {total}
            </div>
            <div className="admin-pagination-buttons">
                <button
                    className="admin-pagination-btn"
                    onClick={() => onPageChange(page - 1)}
                    disabled={page <= 1}
                >
                    <ChevronLeft size={14} />
                </button>
                {getPageNumbers().map((num, i) => (
                    num === '...' ? (
                        <span key={`e${i}`} style={{ padding: '0.375rem 0.5rem', color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>…</span>
                    ) : (
                        <button
                            key={num}
                            className={`admin-pagination-btn ${num === page ? 'active' : ''}`}
                            onClick={() => onPageChange(num)}
                        >
                            {num}
                        </button>
                    )
                ))}
                <button
                    className="admin-pagination-btn"
                    onClick={() => onPageChange(page + 1)}
                    disabled={page >= pages}
                >
                    <ChevronRight size={14} />
                </button>
            </div>
        </div>
    );
};

export default Pagination;
