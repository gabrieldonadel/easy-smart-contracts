import { useEffect } from "react";
import {
  Box,
  Drawer,
  AppBar,
  CssBaseline,
  Toolbar,
  List,
  Typography,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Link as MuiLink,
} from "@mui/material";
import {
  MoveToInbox as InboxIcon,
  GitHub as GitHubIcon,
  FormatListNumbered as FormatListNumberedIcon,
  ExitToApp as ExitIcon,
} from "@mui/icons-material/";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
// import InfoIcon from "@mui/icons-material/Info";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";

import { ReactComponent as Icon } from "../../assets/images/smart-contact-icon.svg";

const drawerWidth = 240;

const DrawerComponent = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const unregisterAuthObserver = getAuth().onAuthStateChanged(
      async (user) => {
        if (!user) {
          navigate("/login", { replace: true });
        }
      }
    );
    return unregisterAuthObserver;
  }, [navigate]);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ zIndex: ({ zIndex }) => zIndex.drawer + 1 }}
      >
        <Toolbar>
          <Icon width={30} height={30} fill={"white"} />
          <Typography
            variant="h5"
            noWrap
            component="div"
            sx={{ marginLeft: 1, fontWeight: "500", cursor: "pointer" }}
            onClick={() => navigate("/contracts")}
          >
            Easy Smart Contracts
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { md: "flex" } }}>
            <IconButton
              size="large"
              color="inherit"
              href="https://github.com/gabrieldonadel/easy-smart-contracts"
              target="_blank"
              LinkComponent={MuiLink}
            >
              <GitHubIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <List>
            <ListItem disablePadding>
              <ListItemButton component={Link} to={"/contracts"}>
                <ListItemIcon>
                  <InboxIcon />
                </ListItemIcon>
                <ListItemText primary={"Projetos"} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to={"/examples"}>
                <ListItemIcon>
                  <FormatListNumberedIcon />
                </ListItemIcon>
                <ListItemText primary={"Exemplos"} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to={"/compiler"}>
                <ListItemIcon>
                  <PrecisionManufacturingIcon />
                </ListItemIcon>
                <ListItemText primary={"Compilador"} />
              </ListItemButton>
            </ListItem>
            {/* <ListItem disablePadding>
              <ListItemButton component={Link} to={"/about"}>
                <ListItemIcon>
                  <InfoIcon />
                </ListItemIcon>
                <ListItemText primary={"Sobre"} />
              </ListItemButton>
            </ListItem> */}
          </List>
          <Divider />
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={() => getAuth().signOut()}>
                <ListItemIcon>
                  <ExitIcon />
                </ListItemIcon>
                <ListItemText primary={"Sair"} />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
      <Box
        component="main"
        sx={{
          flex: 1,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default DrawerComponent;
