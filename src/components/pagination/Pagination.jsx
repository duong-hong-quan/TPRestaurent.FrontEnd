import React from "react";
import { Button, IconButton } from "@material-tailwind/react";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

export function Pagination({ page, currentPage, onPageChange }) {
  const getItemProps = (index) => ({
    variant: currentPage === index ? "filled" : "text",
    color: "red",
    onClick: () => onPageChange(index),
  });

  const next = () => {
    if (currentPage === page) return;
    onPageChange(currentPage + 1);
  };

  const prev = () => {
    if (currentPage === 1) return;
    onPageChange(currentPage - 1);
  };

  return (
    <div className="flex justify-center">
      <div className="flex items-center gap-4">
        <Button
          variant="text"
          className="flex items-center gap-2"
          onClick={prev}
          disabled={currentPage === 1}
        >
          <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" /> Prev
        </Button>
        <div className="flex items-center gap-2">
          {Array.from({ length: page }, (_, index) => (
            <IconButton key={index + 1} {...getItemProps(index + 1)}>
              {index + 1}
            </IconButton>
          ))}
        </div>
        <Button
          variant="text"
          className="flex items-center gap-2"
          onClick={next}
          disabled={currentPage === page}
        >
          Next
          <ArrowRightIcon strokeWidth={2} className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
