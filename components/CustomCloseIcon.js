import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";

/**
 *
 * { SeachBar } -> CustomCloseIcon
 */
const CustomCloseIcon = ({
  onClick,
  className = "absolute right-3 top-3",
  size = "medium",
}) => {
  return (
    <IconButton className={className} onClick={onClick || null} size={size}>
      <CloseIcon className="text-grey-500" />
    </IconButton>
  );
};

export default CustomCloseIcon;
