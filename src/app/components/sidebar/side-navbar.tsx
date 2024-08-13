"use client";
import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useEffect, useState } from "react";
import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";
import SidebarButton from "./sidebar-button";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import SettingsIcon from "@mui/icons-material/Settings";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { signOut, useSession } from "next-auth/react";
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { usePathname } from "next/navigation";
import useSidebarStore, { useUserStore } from "@/store/store";
const drawerWidth = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),

  background: "white",
  border: "2px solid",
  borderRadius: "15px",

  ...(open && {
    width: `calc(100% - ${280}px)`,
    marginTop: `${20}px`,
    marginRight: `${10}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export default function NavSidebar() {
  const theme = useTheme();

  const pathname = usePathname();
  const session = useSession();

  const { sidebar, openCloseSidebar } = useSidebarStore();

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (session.data?.user.role == "Admin") {
      setIsAdmin(true);
    }
  }, [session.data?.user?.role]);

  const handleDrawerOpen = () => {
    openCloseSidebar();
  };

  const handleDrawerClose = () => {
    openCloseSidebar();
  };

  const handleResize = () => {
    if (window.innerWidth <= 600) {
      openCloseSidebar();
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={sidebar}>
        <Toolbar>
          <IconButton
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(sidebar && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" color={"black"}>
            {` ${pathname.slice(1)}`}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        PaperProps={{
          sx: {
            height: "95vh",
            margin: 2,
            bgcolor: "#171B36",
            border: "2px solid white",
            borderRadius: "15px",
            color: "white",
          },
        }}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={sidebar}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon sx={{ color: "white" }} />
            ) : (
              <ChevronRightIcon sx={{ color: "white" }} />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {isAdmin ? (
            <Box>
              <SidebarButton
                link="/admin/dashboard"
                title="Dashboard"
                icon={<SpaceDashboardIcon sx={{ color: "white" }} />}
              />

              <SidebarButton
                link="/admin/listed-books"
                title="Listed Books"
                icon={<LibraryBooksIcon sx={{ color: "white" }} />}
              />
              <SidebarButton
                link="/admin/books"
                title="Books"
                icon={<LibraryBooksIcon sx={{ color: "white" }} />}
              />

              <SidebarButton
                link="/admin/owners"
                title="Owners"
                icon={<PersonOutlineIcon sx={{ color: "white" }} />}
              />
            </Box>
          ) : (
            <Box>
              <SidebarButton
                link="/owner/dashboard"
                title="Dashboard"
                icon={<SpaceDashboardIcon sx={{ color: "white" }} />}
              />
              <SidebarButton
                link="/owner/upload-book"
                title="Upload Book"
                icon={<LibraryBooksIcon sx={{ color: "white" }} />}
              />
            </Box>
          )}
        </List>
        <Divider />
        <List>
          <SidebarButton
            link="/notification"
            title="Notification"
            icon={<NotificationsNoneIcon sx={{ color: "white" }} />}
          />{" "}
          <SidebarButton
            link="/setting"
            title="Setting"
            icon={<SettingsIcon sx={{ color: "white" }} />}
          />{" "}
        </List>
        <Box
          sx={{
            position: "absolute",
            bottom: 20,
          }}
        >
          <ListItem
            sx={{
              cursor: "pointer",
            }}
          >
            <ListItemButton
              onClick={() => signOut()}
              sx={{
                borderRadius: 2,
                ":hover": {
                  background: "#D1E9F6",
                },
              }}
            >
              <ListItemIcon>
                <AccountCircleIcon sx={{ color: "white" }} />
              </ListItemIcon>
              {isAdmin ? (
                <ListItemText primary="Login As Owner" />
              ) : (
                <ListItemText primary="Login As Admin" />
              )}
            </ListItemButton>
          </ListItem>
        </Box>
      </Drawer>
    </Box>
  );
}
