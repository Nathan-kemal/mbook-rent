"use client";
import React, { useEffect } from "react";
import { styled } from "@mui/material/styles";
import { Box, CssBaseline } from "@mui/material";
import useSidebarStore, { useUserStore } from "@/store/store";
import { useSession } from "next-auth/react";
import { getSession } from "next-auth/react";
const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),

  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,

  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginRight: ``,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 280,
    // width: "85%",
    // position: "absolute",
    // left: "14%",
    // marginTop: 10,
  }),
}));

const PageWriapper = ({ children }: { children: React.ReactNode }) => {
  const sidebar = useSidebarStore((state) => state.sidebar);

  return (
    <Box sx={{ display: "flex", background: "#F0F2FF", height: "100vh" }}>
      <CssBaseline />

      <Main open={sidebar}>
        <DrawerHeader />
        {children}
      </Main>
    </Box>
  );
};

export default PageWriapper;
