"use client";
import { Box, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useState } from "react";

const PageNotFound = () => {
  const session = useSession();
  const role = session.data?.user.role;
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Typography>Page Not Found</Typography>
    </Box>
  );
};

export default PageNotFound;
