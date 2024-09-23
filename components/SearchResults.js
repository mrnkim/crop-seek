"use client";
import { React, useEffect } from "react";
import clsx from "clsx";
import { useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import SearchResultList from "./SearchResultList";
import LoadingSpinner from "./LoadingSpinner";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./ErrorFallback";
import EmptyBasicIcon from "./EmptyBasicIcon";
import LimitsOfSearchByImageButton from "./LimitsOfSearchByImageButton";

/**
 *
 * Home -> SearchResults -> SearchResultList
 */
const SearchResults = ({
  updatedSearchData,
  setUpdatedSearchData,
  imgQuery,
  textSearchQuery,
  imgName,
  textSearchSubmitted,
}) => {
  const queryClient = useQueryClient();

  /** Sends a request to the server to fetch image search results */
  const fetchImgSearchResults = async (imagePath) => {
    const formData = new FormData();

    if (imagePath instanceof File) {
      formData.append("file", imagePath);
    } else {
      formData.append("query", imagePath);
    }

    const response = await fetch("/api/imgSearch", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Network response was not ok");
    }

    return response.json();
  };

  /** Queries image search results by using React Query */
  const {
    data: imgSearchResultData,
    isLoading: imgSearchResultLoading,
    error: imageSearchError,
  } = useQuery({
    queryKey: ["imgSearch", imgName],
    queryFn: () => fetchImgSearchResults(imgQuery),
    enabled: !!imgQuery,
    keepPreviousData: true,
  });

  /** Sends a request to the server to fetch text search results */
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

  /** Queries text search results by using React Query */
  const {
    data: textSearchResultData,
    isLoading: textSearchResultLoading,
    error: textSearchError,
  } = useQuery({
    queryKey: ["textSearch", textSearchQuery],
    queryFn: () => fetchTextSearchResults(textSearchQuery),
    enabled: textSearchSubmitted,
    keepPreviousData: true,
  });

  /** Invalidates cached image search queries when the image query changes */
  useEffect(() => {
    queryClient.invalidateQueries(["imgSearch", imgQuery]);
  }, [imgQuery, queryClient]);

  /** Invalidates cached text search queries when a text search is submitted */
  useEffect(() => {
    if (textSearchSubmitted) {
      queryClient.invalidateQueries(["textSearch", textSearchQuery]);
    }
  }, [textSearchSubmitted, queryClient]);

  if (imageSearchError || textSearchError) {
    return <ErrorFallback error={imageSearchError || textSearchError} />;
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div>
        {imgSearchResultLoading || textSearchResultLoading ? (
          <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
            <LoadingSpinner size="lg" color="primary" />
          </div>
        ) : imgSearchResultData?.pageInfo?.total_results > 0 ||
          textSearchResultData?.pageInfo?.total_results > 0 ? (
          <>
            <div className={clsx("flex", "items-center", "mt-5", "mb-5")}>
              <p className="text-subtitle2 font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                Search results {updatedSearchData?.pageInfo?.totalVideos}
              </p>
              <p
                className={clsx(
                  "text-grey-600",
                  "my-0 text-body2",
                  "whitespace-nowrap",
                  "ml-1.5"
                )}
              >
                <span> • </span>
                {"  "}
                {imgSearchResultData?.pageInfo?.total_results ||
                  textSearchResultData?.pageInfo?.total_results}{" "}
                matches{" "}
              </p>
              <LimitsOfSearchByImageButton />
            </div>
            <SearchResultList
              searchResultData={imgSearchResultData || textSearchResultData}
              updatedSearchData={updatedSearchData}
              setUpdatedSearchData={setUpdatedSearchData}
            />
          </>
        ) : (
          <div className="min-h-[50vh] flex justify-center items-center h-full">
            <div
              className={clsx(
                "h-full w-full",
                "flex flex-col items-center justify-center"
              )}
            >
              <EmptyBasicIcon />
              <div
                className={clsx(
                  "mt-2",
                  "text-center font-aeonik text-body2 font-normal text-grey-900"
                )}
              >
                <p>We couldn&apos;t find any results for your query 😿</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default SearchResults;
