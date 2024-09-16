import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import clsx from "clsx";
import { useQuery } from "@tanstack/react-query";
import PageNav from "./PageNav";
import Video from "./Video";
import LoadingSpinner from "./LoadingSpinner";
import ErrorFallback from "./ErrorFallback";

const fetchIndex = async () => {
  const response = await fetch(`/api/getIndex`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

const fetchVideos = async (page) => {
  const response = await fetch(`/api/getVideos?page=${page}`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

const Videos = ({ videoError, setVideoError }) => {
  const [page, setPage] = React.useState(1);

  const {
    data: indexData,
    error: indexError,
    isLoading: isIndexLoading,
  } = useQuery({
    queryKey: ["index"],
    queryFn: fetchIndex,
    onError: (error) => {
      console.error("Error fetching index data:", error);
      setVideoError(error);
    },
  });

  const {
    data: videosData,
    error: videosError,
    isLoading: isVideosLoading,
    isFetching,
  } = useQuery({
    queryKey: ["videos", page],
    queryFn: () => fetchVideos(page),
    keepPreviousData: true, // Retain previous data while new data is loading
    onError: (error) => {
      console.error("Error fetching videos data:", error);
      setVideoError(error);
    },
  });

  const totalPage = videosData?.page_info?.total_page || 1;

  const durationString = indexData
    ? `Total ${Math.floor(indexData.total_duration / 60)}h ${
        indexData.total_duration % 60
      }min`
    : "";

  return (
    <div className={clsx("flex-1", "flex", "flex-col", "gap-y-3")}>
      {!isIndexLoading && indexData && (
        <>
          <div className={clsx("flex", "items-center", "mt-5")}>
            <p className="text-subtitle2 font-medium whitespace-nowrap overflow-hidden text-ellipsis">
              Videos in {indexData.index_name}
            </p>
          </div>
          {indexData.video_count && (
            <div className={clsx("flex items-center gap-x-2")}>
              <img src={"/VideoLibrary.svg"} alt="Video Library" />
              <p
                className={clsx(
                  "text-grey-700",
                  "my-0 text-body2",
                  "whitespace-nowrap"
                )}
              >
                {indexData.video_count} videos ({durationString})
              </p>
            </div>
          )}
        </>
      )}
      {(isVideosLoading && !videosData) || isFetching ? (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
          <LoadingSpinner size="lg" color="primary" />
        </div>
      ) : (
        <>
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Suspense fallback={<LoadingSpinner />}>
              <div className="flex flex-wrap -mx-2">
                {videosData?.data?.map((video) => (
                  <Video key={video._id} video={video} />
                ))}
              </div>
            </Suspense>
          </ErrorBoundary>
          {totalPage > 1 && (
            <div className={clsx("w-full", "flex", "justify-center", "mt-8")}>
              <PageNav page={page} setPage={setPage} totalPage={totalPage} />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Videos;
