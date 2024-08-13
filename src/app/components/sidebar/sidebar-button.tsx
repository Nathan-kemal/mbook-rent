import React from "react";

import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";

type SidebuttonType = {
  title: string;
  link: string;
  icon: React.ReactNode;
};
const SidebarButton = ({ title, link, icon }: SidebuttonType) => {
  const pathname = usePathname();

  console.log(pathname);
  return (
    <ListItem
      sx={{
        cursor: "pointer",
      }}
    >
      <Link
        href={link}
        style={{
          width: "100%",
        }}
      >
        <ListItemButton
          sx={{
            background: pathname.includes(link) ? "#00ABFF" : "",
            borderRadius: 2,
            ":hover": {
              background: "#D1E9F6",
            },
          }}
        >
          <ListItemIcon>{icon}</ListItemIcon>
          <ListItemText primary={title} />
        </ListItemButton>
      </Link>
    </ListItem>
  );
};

export default SidebarButton;
