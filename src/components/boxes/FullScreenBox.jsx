import React from "react";
import { Box } from "@mui/system";

const FullScreenBox = ({ children, ...props }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        fontFamily: "dgm",
        ...props,
      }}
    >
      {children}
    </Box>
  );
};

export default FullScreenBox;
