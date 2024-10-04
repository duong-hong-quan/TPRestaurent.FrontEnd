import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { uniqueId } from "lodash";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className=" flex items-center justify-center py-4 space-x-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-full text-red-900 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft size={20} />
      </button>
      {pages.map((page) => (
        <button
          key={uniqueId()}
          onClick={() => onPageChange(page)}
          className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
            currentPage === page
              ? "bg-red-900 text-white"
              : "text-red-900 hover:bg-red-100"
          }`}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-full text-red-900 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronRight size={20} />
      </button>
    </nav>
  );
};

export default Pagination;
