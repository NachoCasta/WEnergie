import { LoadingButton } from "@mui/lab";
import {
  Alert,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Snackbar,
} from "@mui/material";
import addProducts from "database/products/addProducts";
import { useState } from "react";
import parseProducts from "utils/parseProducts";
import UploadIcon from "@mui/icons-material/Upload";
import { ProductType } from "database/products/productCollection";
import BuildIcon from "@mui/icons-material/Build";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

export default function ProductImportButton() {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>();
  const isError = Boolean(error);
  const [success, setSuccess] = useState<boolean>(false);
  const handleOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);
  };
  const handleImport = async (e: any, type: ProductType) => {
    setAnchorEl(null);
    const file = e.target.files[0];
    setLoading(true);
    try {
      const products = await parseProducts(file, type);
      await addProducts(products);
      setSuccess(true);
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Error al importar");
      }
    }
    setLoading(false);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  const handleCloseError = () => {
    setError(null);
  };
  const handleCloseSuccess = () => {
    setSuccess(false);
  };
  return (
    <>
      <LoadingButton
        color="secondary"
        variant="contained"
        onClick={handleOpen}
        loading={loading}
        loadingPosition="start"
        startIcon={<UploadIcon />}
      >
        Importar
      </LoadingButton>
      <ImportMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onImport={handleImport}
        onClose={handleCloseMenu}
      />
      <Snackbar open={isError || success}>
        <Alert
          onClose={handleCloseError}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>
      <Snackbar
        autoHideDuration={6000}
        open={success}
        onClose={handleCloseSuccess}
      >
        <Alert
          onClose={handleCloseSuccess}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Importación exitosa!
        </Alert>
      </Snackbar>
    </>
  );
}

type MenuProps = {
  anchorEl: HTMLElement | null;
  open: boolean;
  onImport: (e: React.ChangeEvent<HTMLInputElement>, type: ProductType) => void;
  onClose: () => void;
};

function ImportMenu(props: MenuProps) {
  const { anchorEl, open, onImport, onClose } = props;
  return (
    <Menu
      id="basic-menu"
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      MenuListProps={{
        "aria-labelledby": "basic-button",
      }}
    >
      <MenuItem component="label">
        <ListItemIcon>
          <ShoppingCartIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Productos</ListItemText>
        <input
          type="file"
          hidden
          onChange={(e) => {
            onImport(e, ProductType.Product);
          }}
        />
      </MenuItem>
      <MenuItem component="label">
        <ListItemIcon>
          <BuildIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Repuestos</ListItemText>
        <input
          type="file"
          hidden
          onChange={(e) => {
            onImport(e, ProductType.Part);
          }}
        />
      </MenuItem>
    </Menu>
  );
}
