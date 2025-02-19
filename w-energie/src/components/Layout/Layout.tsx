import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import InventoryIcon from "@mui/icons-material/Inventory";
import Copyright from "./Copyright";
import AppBar from "./AppBar";
import Drawer from "./Drawer";
import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";

const mdTheme = createTheme();

const items = [
  {
    text: "Cotizaciones",
    icon: <RequestQuoteIcon />,
    path: "/cotizaciones",
  },
  {
    text: "Productos",
    icon: <InventoryIcon />,
    path: "/productos",
  },
];

export default function Layout() {
  const [open, setOpen] = useState(true);
  const handleToggle = () => {
    setOpen(!open);
  };

  const navigate = useNavigate();
  const location = useLocation();
  const drawerItems = items.map(({ text, icon, path }) => ({
    text,
    icon,
    onClick: () => navigate(path),
    current: location.pathname.startsWith(path),
  }));

  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar open={open} onOpen={handleToggle} />
        <Drawer open={open} onClose={handleToggle} items={drawerItems} />
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Toolbar />
          <Container
            maxWidth="lg"
            sx={{ pt: 4, pb: 4, minHeight: "calc(100% - 64px)" }}
          >
            <Outlet />
            <Copyright />
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
