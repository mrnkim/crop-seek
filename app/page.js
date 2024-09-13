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

  const queryClient = useQueryClient();

  const fetchSearchResults = async (imagePath) => {
    const formData = new FormData();

    if (imagePath instanceof File) {
      formData.append("file", imagePath);
    } else {
      formData.append("query", imagePath);
    }

    const response = await fetch("/api/search", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Network response was not ok");
    }

    return response.json();
  };

  const {
    data: searchResultData,
    error: searchError,
    isLoading: searchResultsLoading,
  } = useQuery({
    queryKey: ["search", imgName],
    queryFn: () => fetchSearchResults(querySrc),
    enabled: !!querySrc,
    keepPreviousData: true,
  });

  async function handleSubmit(textInputValue) {
    setTextSearchQuery(textInputValue);
    setTextSearchSubmitted(true);
  }

  const fetchTextSearchResults = async (textSearchQuery) => {
    const response = await fetch(`/api/textSearch`, {
      method: "POST",
      body: JSON.stringify({ textSearchQuery }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Network response was not ok");
    }

    return response.json();
  };

  const {
    data: textSearchResultData,
    error: textSearchError,
    isLoading: textSearchResultsLoading,
  } = useQuery({
    queryKey: ["textSearch", textSearchQuery],
    queryFn: () => fetchTextSearchResults(textSearchQuery),
    enabled: textSearchSubmitted,
    keepPreviousData: true,
    onSuccess: () => {
      setTextSearchSubmitted(false); // Reset state to prevent unintended searches
    },
    onError: () => {
      setTextSearchSubmitted(false); // Reset state even on error to prevent looping
    },
  });

  useEffect(() => {
    queryClient.invalidateQueries(["search", querySrc]);
  }, [querySrc, queryClient]);

  useEffect(() => {
    if (textSearchSubmitted) {
      queryClient.invalidateQueries(["textSearch"]);
    }
  }, [textSearchSubmitted, queryClient]);

  const onImageSelected = async (src) => {
    setQuerySrc(null);
    setUpdatedSearchData([]);

    if (typeof src === "string") {
      setQuerySrc(src);
      setImgName(src.split("/").pop());
    } else if (src instanceof File) {
      setQuerySrc(src);
      setImgName(src.name);
    }
  };

  const clearImageQuery = () => {
    setQuerySrc("");
    setUpdatedSearchData([]);
    setImgName("");
  };

  if (videoError || searchError || textSearchError) {
    return (
      <ErrorFallback error={videoError || searchError || textSearchError} />
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="w-full max-w-4xl">
        <SearchBar
          querySrc={querySrc}
          setQuerySrc={setQuerySrc}
          searchResultData={searchResultData}
          updatedSearchData={updatedSearchData}
          setUpdatedSearchData={setUpdatedSearchData}
          imgName={imgName}
          setImgName={setImgName}
          clearImageQuery={clearImageQuery}
          searchResultsLoading={searchResultsLoading}
          onImageSelected={onImageSelected}
          textSearchQuery={textSearchQuery}
          setTextSearchQuery={setTextSearchQuery}
          setTextSearchSubmitted={setTextSearchSubmitted}
          handleSubmit={handleSubmit}
        />
        {!searchResultData &&
          !searchResultsLoading &&
          !textSearchResultData &&
          !textSearchResultsLoading && (
            <Videos videoError={videoError} setVideoError={setVideoError} />
          )}
        {(searchResultsLoading || textSearchResultsLoading) && (
          <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
            <LoadingSpinner size="lg" color="primary" />
          </div>
        )}
        {!searchResultsLoading &&
          !textSearchResultsLoading &&
          (searchResultData || textSearchResultData) && (
            <SearchResults
              searchResultData={searchResultData || textSearchResultData}
              updatedSearchData={updatedSearchData}
              setUpdatedSearchData={setUpdatedSearchData}
              querySrc={querySrc || textSearchSubmitted}
              searchResultsLoading={
                searchResultsLoading || textSearchResultsLoading
              }
            />
          )}
      </div>
    </main>
  );
}
