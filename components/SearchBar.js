"use client";
import React, { useRef } from "react";
import SearchByImageButtonAndModal from "./SearchByImageButtonAndModal";
import SelectedImageDisplay from "./SelectedImageDisplay";
import { IconButton, Popper, Skeleton } from "@mui/material";
import TextSearchForm from "./TextSearchForm";
import CustomCloseIcon from "./CustomCloseIcon";

const SearchBar = ({
  querySrc,
  setQuerySrc,
  imgName,
  setImgName,
  clearQueryAndResults,
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
            unselectImage={clearQueryAndResults}
          />
        )}
        {!querySrc && (
          <TextSearchForm
            handleFormSubmit={handleFormSubmit}
            inputRef={inputRef}
          />
        )}
      </div>
      <div className="flex items-center">
        {inputRef.current?.value && (
          <CustomCloseIcon className="text-grey-500 mr-1" onClick={onClear} />
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
