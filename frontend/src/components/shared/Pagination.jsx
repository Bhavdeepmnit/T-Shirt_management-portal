import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';

const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between mt-6">
      <p className="text-sm text-surface-500">
        Page {page} of {totalPages}
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="btn-ghost disabled:opacity-30 flex items-center gap-1 text-sm"
        >
          <HiChevronLeft className="w-4 h-4" /> Previous
        </button>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="btn-ghost disabled:opacity-30 flex items-center gap-1 text-sm"
        >
          Next <HiChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
