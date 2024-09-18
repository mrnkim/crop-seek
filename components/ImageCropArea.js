import { React, useState, useRef } from "react";
import CustomCloseIcon from "./CustomCloseIcon";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  dialogClasses,
} from "@mui/material";
import ReactCrop from "react-image-crop";
import clsx from "clsx";
import "react-image-crop/dist/ReactCrop.css";


const ImageCropArea = ({
  isModalOpen,
  closeDisplayModal,
  imgName,
  imageSrc,
  setImgQuery,
  setImgName,
}) => {
  const imgRef = useRef(null);

  const [crop, setCrop] = useState({});
  const [completedCrop, setCompletedCrop] = useState(null);

  /** Crops an image according to the specified dimensions and returns the cropped image as a Data URL */
  const getCroppedImage = (image, crop) => {
    return new Promise((resolve, reject) => {
      if (!crop || !image) {
        reject(new Error("Invalid crop or image"));
        return;
      }

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas context is not available"));
        return;
      }

      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      const pixelRatio = window.devicePixelRatio || 1;

      const cropWidth = Math.max(crop.width, 378);
      const cropHeight = Math.max(crop.height, 378);

      canvas.width = cropWidth * pixelRatio;
      canvas.height = cropHeight * pixelRatio;

      ctx.scale(pixelRatio, pixelRatio);
      ctx.imageSmoothingQuality = "high";

      const offsetX = (cropWidth - crop.width) / 2;
      const offsetY = (cropHeight - crop.height) / 2;

      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        offsetX,
        offsetY,
        crop.width,
        crop.height
      );

      try {
        // The canvas content is converted to a Data URL in JPEG format
        const dataUrl = canvas.toDataURL("image/jpeg");
        resolve(dataUrl);
      } catch (error) {
        reject(new Error("Failed to convert canvas to data URL"));
      }
    });
  };

  /** Converts a base64 string to a File object with the specified filename */
  const base64ToFile = async (base64String, fileName) => {
    const response = await fetch(base64String);
    const blob = await response.blob();
    return new File([blob], fileName, { type: blob.type });
  };

  /** Handles the cropping of an image, converts the crop to a File, and updates state with the cropped image */
  const onCropSearchClick = async () => {
    if (completedCrop && imgRef.current) {
      try {
        const base64Image = await getCroppedImage(
          imgRef.current,
          completedCrop
        );

        const croppedImageFile = await base64ToFile(
          base64Image,
          `${imgName}-cropped`
        );

        if (croppedImageFile) {
          setImgQuery(croppedImageFile);
          setImgName(croppedImageFile.name);
          closeDisplayModal();
        }
      } catch (error) {
        console.error("Error processing image:", error);
      }
    } else {
      console.warn("No completed crop or imgRef.current is null");
    }
  };

  return (
    <Dialog
      sx={{
        [`& .${dialogClasses.paper}`]: {
          width: "80vw",
          height: "80vh",
          maxWidth: "none",
          maxHeight: "none",
        },
      }}
      open={isModalOpen}
      onClose={closeDisplayModal}
    >
      <DialogTitle className="w-[calc(100%-30px)] truncate">
        {imgName}
      <CustomCloseIcon onClick={closeDisplayModal}/>
      </DialogTitle>
      <DialogContent>
        <div
          className={clsx(
            "border-grey-200 bg-grey-50",
            "flex justify-center",
            "overflow-hidden rounded"
          )}
        >
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => setCompletedCrop(c)}
            minHeight={100}
            crossOrigin="anonymous"
          >
            <img
              ref={imgRef}
              className="h-full w-full bg-grey-50 object-contain"
              src={imageSrc}
              alt="expanded-user-uploaded"
              crossOrigin="anonymous"
            />
          </ReactCrop>
        </div>
        <div className={clsx("flex justify-end mt-3")}>
          <button
            className="px-4 py-3 bg-green-500 text-body2"
            onClick={onCropSearchClick}
          >
            Search
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageCropArea;
