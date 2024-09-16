"use client";
import React, { useEffect, useState } from "react";
import SearchBar from "@/components/SearchBar";
import SearchResults from "@/components/SearchResults";
import Videos from "@/components/Videos";
import ErrorFallback from "../components/ErrorFallback";
import LoadingSpinner from "../components/LoadingSpinner";
import { useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";

export default function Home() {
  const [querySrc, setQuerySrc] = useState("");
  const [updatedSearchData, setUpdatedSearchData] = useState([]);
  const [imgName, setImgName] = useState("");
  const [videoError, setVideoError] = useState(null);
  const [textSearchQuery, setTextSearchQuery] = useState("");
  const [textSearchSubmitted, setTextSearchSubmitted] = useState(false);


  /** Set text search query as input value and status */
  async function handleSubmit(textInputValue) {
    setTextSearchQuery(textInputValue);
    setTextSearchSubmitted(true);
  }

  /** Set image name and query src  */
  const onImageSelected = async (src) => {
    setQuerySrc(null);
    setUpdatedSearchData([]);

    if (typeof src === "string") {
      setImgName(src.split("/").pop());
    } else if (src instanceof File) {
      setImgName(src.name);
    }
    setQuerySrc(src);
  };

  /** Clear query and results  */
  const clearQueryAndResults = () => {
    setQuerySrc("");
    setUpdatedSearchData([]);
    setImgName("");
  };

  // if (videoError || searchError || textSearchError) {
  //   return (
  //     <ErrorFallback error={videoError || searchError || textSearchError} />
  //   );
  // }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="w-full max-w-4xl">
        <SearchBar
          querySrc={querySrc}
          setQuerySrc={setQuerySrc}
          imgName={imgName}
          setImgName={setImgName}
          clearQueryAndResults={clearQueryAndResults}
          onImageSelected={onImageSelected}
          handleSubmit={handleSubmit}
          setTextSearchQuery={setTextSearchQuery}
        />
        {updatedSearchData.length < 1 && (
          <Videos videoError={videoError} setVideoError={setVideoError} />
        )}
        {/* {(searchResultsLoading || textSearchResultsLoading) && (
          <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
            <LoadingSpinner size="lg" color="primary" />
          </div>
        )} */}
        {(imgName || textSearchSubmitted) && (
          <SearchResults
            // searchResultData={searchResultData || textSearchResultData}
            updatedSearchData={updatedSearchData}
            setUpdatedSearchData={setUpdatedSearchData}
            querySrc={querySrc}
            textSearchQuery={textSearchQuery}
            imgName={imgName}
            textSearchSubmitted={textSearchSubmitted}
            // searchResultsLoading={
            //   searchResultsLoading || textSearchResultsLoading
            // }
          />
        )}
      </div>
    </main>
  );
}
