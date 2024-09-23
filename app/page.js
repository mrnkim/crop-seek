"use client";
import React, { useState } from "react";
import SearchBar from "@/components/SearchBar";
import SearchResults from "@/components/SearchResults";
import Videos from "@/components/Videos";

/**
 *
 * Home -> { SearchBar, Videos, SearchResults }
 *
 */
export default function Home() {
  const [imgQuery, setImgQuery] = useState(null);
  const [imgName, setImgName] = useState("");
  const [textSearchQuery, setTextSearchQuery] = useState("");
  const [textSearchSubmitted, setTextSearchSubmitted] = useState(false);
  const [updatedSearchData, setUpdatedSearchData] = useState({
    searchData: [],
    pageInfo: {},
  });

  /** Set text search query as input value and update text search submit status */
  async function handleTextSubmit(textInputValue) {
    setTextSearchQuery(textInputValue);
    setTextSearchSubmitted(true);
  }

  /** Set image name and query src  */
  const handleImgSubmit = async (src) => {
    setImgQuery(null);
    setUpdatedSearchData({ searchData: [], pageInfo: {} });
    setTextSearchSubmitted(false);

    if (typeof src === "string") {
      setImgName(src.split("/").pop());
    } else if (src instanceof File) {
      setImgName(src.name);
    }
    setImgQuery(src);
  };

  /** Clear query and results  */
  const clearQueryAndResults = () => {
    setImgQuery("");
    setUpdatedSearchData({ searchData: [], pageInfo: {} });
    setImgName("");
    setTextSearchQuery("");
    setTextSearchSubmitted(false);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="w-full max-w-4xl">
        <SearchBar
          imgQuery={imgQuery}
          setImgQuery={setImgQuery}
          imgName={imgName}
          setImgName={setImgName}
          clearQueryAndResults={clearQueryAndResults}
          handleImgSubmit={handleImgSubmit}
          handleTextSubmit={handleTextSubmit}
        />
        {!imgQuery && !textSearchSubmitted && <Videos />}
        {(imgQuery || textSearchSubmitted) && (
          <SearchResults
            updatedSearchData={updatedSearchData}
            setUpdatedSearchData={setUpdatedSearchData}
            imgQuery={imgQuery}
            textSearchQuery={textSearchQuery}
            imgName={imgName}
            textSearchSubmitted={textSearchSubmitted}
          />
        )}
      </div>
    </main>
  );
}
