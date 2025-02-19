import { Button, TextField } from "@mui/material";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Title from "components/Common/Title";
import getProducts from "database/products/getProducts";
import AddIcon from "@mui/icons-material/Add";
import UploadIcon from "@mui/icons-material/Upload";
import parseProducts from "utils/parseProducts";
import addProducts from "database/products/addProducts";
import LoadingButton from "@mui/lab/LoadingButton";
import { useMemo, useState } from "react";
import ProductTable from "./ProductTable";
import { useNavigate } from "react-router-dom";
import usePagination from "hooks/usePagination";
import getProductsCount from "database/products/getProductsCount";
import { getFilteredProducts } from "utils/productUtils";

export default function Products() {
  const [id, setId] = useState<string | null>(null);
  const [search, setSearch] = useState<string | null>(null);
  const [products, loadingProducts, paginationProps] = usePagination(
    getProducts,
    getProductsCount,
    { filter: id?.toUpperCase() }
  );
  const filteredProducts = useMemo(
    () => getFilteredProducts(products, search),
    [products, search]
  );
  const navigate = useNavigate();
  const handleAdd = () => navigate("nuevo");
  const [loading, setLoading] = useState(false);
  const handleImport = async (e: any) => {
    const file = e.target.files[0];
    setLoading(true);
    const products = await parseProducts(file);
    await addProducts(products);
    setLoading(false);
  };
  const handleView = (productId: string) => {
    navigate(productId);
  };
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
          <Title>Productos</Title>
          <Grid
            container
            spacing={1}
            flexWrap="nowrap"
            sx={{
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <Grid item>
              <TextField
                size="small"
                label="ID"
                onChange={(e) => {
                  setId(e.target.value);
                }}
              />
            </Grid>
            <Grid item flexGrow={1}>
              <TextField
                size="small"
                fullWidth
                label="Buscar"
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
              />
            </Grid>
            <Grid item sx={{ justifySelf: "right" }}>
              <Button
                color="primary"
                variant="contained"
                onClick={handleAdd}
                startIcon={<AddIcon />}
              >
                Agregar
              </Button>
            </Grid>
            <Grid item sx={{ justifySelf: "right" }}>
              <LoadingButton
                color="secondary"
                variant="contained"
                component="label"
                loading={loading}
                loadingPosition="start"
                startIcon={<UploadIcon />}
              >
                Importar
                <input
                  type="file"
                  hidden
                  onChange={(e) => {
                    handleImport(e);
                  }}
                />
              </LoadingButton>
            </Grid>
          </Grid>
          <ProductTable
            products={filteredProducts}
            paginationProps={paginationProps}
            loading={loadingProducts}
            onView={handleView}
          />
        </Paper>
      </Grid>
    </Grid>
  );
}
