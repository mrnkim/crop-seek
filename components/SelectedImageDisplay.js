/* eslint-disable react/prop-types */
import CloseIcon from "@mui/icons-material/Close";
import { IconButton,  Popper,  Skeleton } from "@mui/material";
import clsx from "clsx";
import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";
import ImageCropArea from "./ImageCropArea";

/** Fetch image as a blob using the proxy API route */
const fetchImageAsBlob = async (filePath) => {
  const response = await fetch(
    `/api/proxy-image?url=${encodeURIComponent(filePath)}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch image");
  }
  return await response.blob();
};

const blobToDataURL = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

const SelectedImageDisplay = ({
  imgQuerySrc,
  setImgQuerySrc,
  imgName,
  setImgName,
  unselectImage,
}) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openDisplayModal = () => setIsModalOpen(true);
  const closeDisplayModal = () => setIsModalOpen(false);

  const [anchorEl, setAnchorEl] = useState(null);
  const [arrowEl, setArrowEl] = useState(null);
  const openPopover = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const closePopover = () => setAnchorEl(null);

  useEffect(() => {
    if (imgQuerySrc instanceof File) {
      const objectUrl = URL.createObjectURL(imgQuerySrc);
      setImageSrc(objectUrl);

      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    } else if (typeof imgQuerySrc === "string") {
      fetchImageAsBlob(imgQuerySrc)
        .then(blobToDataURL)
        .then((dataURL) => setImageSrc(dataURL))
        .catch((error) => console.error("Error fetching image:", error));
    }
  }, [imgQuerySrc]);

  if (!imageSrc) {
    return <Skeleton variant="text" width={240} height={36} />;
  }

  const onCloseIconClick = (e) => {
    e.stopPropagation();
    unselectImage();
  };

  const isPopperOpen = Boolean(anchorEl);

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
        open={isPopperOpen}
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
        setImgQuerySrc={setImgQuerySrc}
        setImgName={setImgName}
      />
    </>
  );
};

export default SelectedImageDisplay;
