import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Box,
  Grid,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Typography,
} from "@mui/material";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import { useRouter } from "next/router";

const routes = [
  {
    icon: <HomeRoundedIcon />,
    title: "Home",
    route: "/",
  },
  {
    icon: <ArticleOutlinedIcon />,
    title: "Agreements",
    route: "/agreements",
  },
  {
    icon: <BorderColorOutlinedIcon />,
    title: "Signatures",
    route: "/signatures",
  },
  {
    title: "Create Agreement",
    route: "/agreements/create-new",
  },
];

const TopBar = ({ path }: { path: string }) => {
  return (
    <Box sx={{ width: "100%", height: "120px", display: "flex" }}>
      <div style={{ width: "270px", padding: "32px 90px" }}>
        <Image alt="zksig logo" src="/logo_v3.png" width="60" height="60" />
      </div>
      <Grid container spacing={2} sx={{ p: "32px 90px" }}>
        <Grid item xs={12} md={6} sx={{ p: "0 20px" }}>
          <Typography
            sx={{ fontSize: "32px", fontWeight: "bold", color: "#F8FAFC" }}
          >
            {routes.find((r) => r.route === path)?.title}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

const SideBar = ({ path }: { path: string }) => {
  const classes = {
    selected: {
      color: "white",
      fontWeight: "bold",
      borderRadius: "8px",
      backgroundColor: "#2E3855",
      p: "16px",
    },
    unSelected: {
      p: "16px",
      color: "#DEE5F5",
    },
  };

  const isSelected = (route: { [key: string]: any }) => {
    return route.route === path;
  };

  return (
    <Box sx={{ width: "270px", height: "100%", p: "40px 28px" }}>
      <MenuList>
        {routes
          .filter((r) => r.icon)
          .map((route, index) => (
            <Link href={route.route} key={`route-${index}`}>
              <MenuItem
                sx={isSelected(route) ? classes.selected : classes.unSelected}
              >
                <ListItemIcon
                  sx={{ color: isSelected(route) ? "white" : "#DEE5F5" }}
                >
                  {route.icon}
                </ListItemIcon>
                <ListItemText>{route.title}</ListItemText>
              </MenuItem>
            </Link>
          ))}
      </MenuList>
    </Box>
  );
};

export default function SidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { asPath } = useRouter();

  return (
    <Box
      sx={{
        backgroundColor: "secondary.main",
        height: "100vh",
        width: "100vw",
      }}
    >
      <TopBar path={asPath} />
      <div style={{ display: "flex" }}>
        <SideBar path={asPath} />
        <Box
          sx={{
            background: "white",
            width: "calc(100vw - 270px)",
            height: "calc(100vh - 120px)",
            borderRadius: "50px 0 0 0",
            p: "60px 80px",
            overflowY: "scroll",
          }}
        >
          {children}
        </Box>
      </div>
    </Box>
  );
}
