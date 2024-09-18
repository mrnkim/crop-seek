/* eslint-disable react/prop-types */
import CloseIcon from "@mui/icons-material/Close";
import { IconButton, Popper, Skeleton } from "@mui/material";
import clsx from "clsx";
import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";
import ImageCropArea from "./ImageCropArea";

/**
 * SeachBar -> SelectedImageDisplay -> ImageCropArea
 */
const SelectedImageDisplay = ({
  imgQuery,
  setImgQuery,
  imgName,
  setImgName,
  unselectImage,
}) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [arrowEl, setArrowEl] = useState(null);

  const openDisplayModal = () => setIsModalOpen(true);

  const closeDisplayModal = () => setIsModalOpen(false);

  const openPopover = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const closePopover = () => setAnchorEl(null);

  const onCloseIconClick = (e) => {
    e.stopPropagation();
    unselectImage();
  };

  /** Fetches an image as a blob using the proxy API route */
  const fetchImageAsBlob = async (filePath) => {
    const response = await fetch(
      `/api/proxy-image?url=${encodeURIComponent(filePath)}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch image");
    }
    return await response.blob();
  };

  /** Converts a Blob object to a Data URL */
  const blobToDataURL = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  if (!imageSrc) {
    return <Skeleton variant="text" width={240} height={36} />;
  }

  useEffect(() => {
    if (imgQuery instanceof File) {
      const objectUrl = URL.createObjectURL(imgQuery);
      setImageSrc(objectUrl);
      return () => {
        URL.revokeObjectURL(objectUrl); //cleanup function to remove the temp URL
      };
    } else if (typeof imgQuery === "string") {
      fetchImageAsBlob(imgQuery)
        .then(blobToDataURL)
        .then((dataURL) => setImageSrc(dataURL))
        .catch((error) => console.error("Error fetching image:", error));
    }
  }, [imgQuery]);

  return (
    <>
      <div
        aria-describedby="image-display-popper"
        className={clsx(
          "flex items-center",
          "min-w-0 bg-grey-50",
          "rounded border border-grey-200 hover:border-green-500",
          "mr-2"
        )}
        role="button"
        tabIndex={0}
        onMouseEnter={openPopover}
        onMouseLeave={closePopover}
        onClick={openDisplayModal}
      >
        <img
          className={clsx(
            "h-9",
            "object-contain",
            "border-r-[1px] border-grey-200",
            "flex-shrink-0"
          )}
          src={imageSrc}
          alt="user-uploaded"
          crossOrigin="anonymous"
        />
        <p
          className={clsx(
            "mx-[9px]",
            "text-subtitle2 text-grey-700",
            "whitespace-nowrap"
          )}
        >
          {imgName}
        </p>
        <IconButton size="small" onClick={onCloseIconClick}>
          <CloseIcon className="text-grey-500" fontSize="small" />
        </IconButton>
      </div>
      <Popper
        id="image-display-popper"
        className="z-navbar border border-grey-200"
        placement="right"
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        modifiers={[
          {
            name: "offset",
            options: {
              offset: [0, 16],
            },
          },
          {
            name: "arrow",
            enabled: true,
            options: {
              element: arrowEl,
            },
          },
        ]}
      >
        <span className={styles["popper-arrow"]} ref={setArrowEl} />
        <div className={clsx("h-[300px] p-2", "bg-white", "border-grey-200")}>
          <img
            className="h-full rounded bg-grey-50 object-contain"
            src={imageSrc}
            alt="expanded-user-uploaded"
            crossOrigin="anonymous"
          />
        </div>
      </Popper>
      <ImageCropArea
        isModalOpen={isModalOpen}
        closeDisplayModal={closeDisplayModal}
        imgName={imgName}
        imageSrc={imageSrc}
        setImgQuery={setImgQuery}
        setImgName={setImgName}
      />
    </>
  );
};

export default SelectedImageDisplay;
