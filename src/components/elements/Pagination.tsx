
'use client';

import React from 'react';
import Image from 'next/image';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const getPageNumbers = (): (number | string)[] => {
    const pageNumbers: (number | string)[] = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
    } else {
      if (currentPage <= 3) {
        pageNumbers.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(
          1,
          '...',
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pageNumbers.push(
          1,
          '...',
          currentPage - 1,
          currentPage,
          currentPage + 1,
          '...',
          totalPages
        );
      }
    }

    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav className="pagination flex items-center gap-2" aria-label="Pagination">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="p-2 text-[20px] font-bold text-mono-100 disabled:opacity-50"
        aria-label="Previous page"
      >
        <Image
          src="/images/icons/left-arrow-svgrepo-com.svg"
          alt="Previous"
          width={20}
          height={20}
        />
      </button>

      <ul className="flex items-center gap-2">
        {pageNumbers.map((page, idx) => (
          <li key={idx}>
            <button
              className={`body-small py-1 px-2 rounded ${
                page === currentPage
                  ? 'bg-mono-100 text-mono-0'
                  : 'text-[#677788] hover:text-black'
              }`}
              onClick={() => typeof page === 'number' && onPageChange(page)}
              disabled={page === '...'}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </button>
          </li>
        ))}
      </ul>

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="p-2 text-[20px] font-bold text-mono-100 disabled:opacity-50"
        aria-label="Next page"
      >
        <Image
          src="/images/icons/right-arrow-svgrepo-com.svg"
          alt="Next"
          width={20}
          height={20}
        />
      </button>
    </nav>
  );
};

export default Pagination;
