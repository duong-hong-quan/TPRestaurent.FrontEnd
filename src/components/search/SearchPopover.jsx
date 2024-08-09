import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Popover,
  PopoverHandler,
  PopoverContent,
  Input,
  Button,
  IconButton,
} from "@material-tailwind/react";

function SearchPopover() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <Popover placement="bottom" className="">
      <PopoverHandler>
        <IconButton
          variant="text"
          className="rounded-full text-white hover:bg-white/20 transition-all"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </IconButton>
      </PopoverHandler>
      <PopoverContent className="fixed left-1/2 mt-4 transform -translate-x-1/2 w-full max-w-5xl bg-white backdrop-blur-md border-none shadow-4xl ">
        <form onSubmit={handleSearch} className="flex items-center gap-2 p-3">
          <Input
            type="text"
            placeholder="Tìm kiếm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="!border-none  placeholder:text-gray-600 text-xl placeholder:font-bold "
            labelProps={{
              className: "hidden",
            }}
            containerProps={{ className: "flex-grow" }}
          />
          <Button
            type="submit"
            className="bg-red-800 text-white hover:bg-red-900 transition-all px-6 py-4 w-32  shadow-lg hover:shadow-red-500/30"
          >
            Tìm kiếm
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  );
}

export default SearchPopover;
