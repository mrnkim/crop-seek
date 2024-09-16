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

const SearchResults = ({
  // imgSearchResultData,
  updatedSearchData,
  setUpdatedSearchData,
  imgQuery,
  // imgSearchResultLoading,
  textSearchQuery,
  textSearchSubmitted,
  imgName,
}) => {
  const queryClient = useQueryClient();

  /** Make request to server to fetch image search results */
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

  /** useQuery to fetch image search results  */
  const { data: imgSearchResultData, isLoading: imgSearchResultLoading } =
  useQuery({
    queryKey: ["imgSearch", imgName],
    queryFn: () => fetchImgSearchResults(imgQuery),
    enabled: !!imgQuery,
    keepPreviousData: true,
  });

  /** Make request to server to fetch text search results */
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

  /** useQuery to fetch text search results  */
  const { data: textSearchResultData, isLoading: textSearchResultLoading } =
    useQuery({
      queryKey: ["textSearch", textSearchQuery],
      queryFn: () => fetchTextSearchResults(textSearchQuery),
      enabled: textSearchSubmitted,
      keepPreviousData: true,
    });

  /** Invalidate queries of image search */
  useEffect(() => {
    queryClient.invalidateQueries(["imgSearch", imgQuery]);
  }, [imgQuery, queryClient]);

  /** Invalidate queries of text search */
  useEffect(() => {
    if (textSearchSubmitted) {
      queryClient.invalidateQueries(["textSearch", textSearchQuery]);
    }
  }, [textSearchSubmitted, queryClient]);

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
                {updatedSearchData?.pageInfo?.total_results ||
                  updatedSearchData?.pageInfo?.totalResults}
                {"  "}
                {updatedSearchData?.pageInfo?.total_results ||
                updatedSearchData?.pageInfo?.totalResults > 1
                  ? " matches"
                  : " match"}{" "}
              </p>
              <LimitsOfSearchByImageButton />
            </div>
            <SearchResultList
              searchResultData={imgSearchResultData || textSearchResultData}
              updatedSearchData={updatedSearchData}
              setUpdatedSearchData={setUpdatedSearchData}
              imgQuery={imgQuery}
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
