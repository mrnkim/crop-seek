"use client";
import React, { useRef } from "react";
import SearchByImageButtonAndModal from "./SearchByImageButtonAndModal";
import SelectedImageDisplay from "./SelectedImageDisplay";
import { IconButton, Popper, Skeleton } from "@mui/material";
import TextSearchForm from "./TextSearchForm";
import CustomCloseIcon from "./CustomCloseIcon";

const SearchBar = ({
  imgQuery,
  setImgQuery,
  imgName,
  setImgName,
  clearQueryAndResults,
  onImageSelected,
  handleSubmit,
  setTextSearchQuery,
}) => {
  const inputRef = useRef(null);

  const handleFormSubmit = (evt) => {
    evt.preventDefault();
    if (inputRef.current.value.length > 0) {
      handleSubmit(inputRef.current.value);
    }
  };

  const onClear = () => {
    inputRef.current.value = "";
    clearQueryAndResults();
  };

  return (
    <div className="w-full h-14 py-3 bg-white border-b-2 border-[#e5e6e4] flex items-center justify-between">
      <div className="flex items-center flex-grow">
        <div className="w-8 h-14 flex items-center gap-1 ml-4">
          <button className="w-6 h-6" onClick={handleFormSubmit}>
            <img src="/SearchVideoLeft.svg" alt="Search Icon" />
          </button>
        </div>
        {imgQuery && (
          <SelectedImageDisplay
            imgQuery={imgQuery}
            setImgQuery={setImgQuery}
            imgName={imgName}
            setImgName={setImgName}
            unselectImage={clearQueryAndResults}
          />
        )}
        {!imgQuery && (
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
