"use client";
import React, { useRef } from "react";
import SearchByImageButtonAndModal from "./SearchByImageButtonAndModal";
import SelectedImageDisplay from "./SelectedImageDisplay";
import { IconButton, Popper, Skeleton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const SearchBar = ({
  querySrc,
  setQuerySrc,
  imgName,
  setImgName,
  clearImageQuery,
  onImageSelected,
  handleSubmit,
  setTextSearchQuery,
  setTextSearchSubmitted,
}) => {
  const inputRef = useRef(null);

  const handleFormSubmit = (evt) => {
    evt.preventDefault(); // Prevent the default form submission
    handleSubmit(inputRef.current.value); // Pass the input value directly
  };

  const onClear = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
      setTextSearchQuery("");
      setTextSearchSubmitted(false);
    }
  };

  return (
    <div className="w-full h-14 py-3 bg-white border-b-2 border-[#e5e6e4] flex items-center justify-between">
      <div className="flex items-center flex-grow">
        <div className="w-8 h-14 flex items-center gap-1 ml-4">
          <button className="w-6 h-6" onClick={handleFormSubmit}>
            <img src="/SearchVideoLeft.svg" alt="Search Icon" />
          </button>
        </div>
        {querySrc && (
          <SelectedImageDisplay
            querySrc={querySrc}
            setQuerySrc={setQuerySrc}
            imgName={imgName}
            setImgName={setImgName}
            unselectImage={clearImageQuery}
          />
        )}
        {!querySrc && (
          <form
            className="flex-grow flex items-center"
            onSubmit={handleFormSubmit}
          >
            <input
              className="text-[#c5c7c3] text-xl leading-loose w-full"
              ref={inputRef} // Use ref to access the input
              placeholder=" What are you looking for?"
            ></input>
          </form>
        )}
      </div>
      <div className="flex items-center">
        {inputRef.current?.value && (
          <IconButton className="text-grey-500 mr-1" size="medium" onClick={onClear}>
            <CloseIcon color="inherit" fontSize="inherit" />
          </IconButton>
        )}
        <div className="flex items-center gap-2">
          <div className="w-px h-6 bg-[#d9d9d9]" />
          <SearchByImageButtonAndModal onImageSelected={onImageSelected} />
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
