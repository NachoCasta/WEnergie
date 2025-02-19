import { Button, TextField } from "@mui/material";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Title from "components/Common/Title";
import getProducts from "database/products/getProducts";
import AddIcon from "@mui/icons-material/Add";
import { useMemo, useState } from "react";
import ProductTable from "./ProductTable";
import { useNavigate } from "react-router-dom";
import usePagination from "hooks/usePagination";
import getProductsCount from "database/products/getProductsCount";
import { getFilteredProducts } from "utils/productUtils";
import ProductImportButton from "./ProductImportButton";

export default function Products() {
  const [id, setId] = useState<string | null>(null);
  const filter = id?.toUpperCase();
  const [search, setSearch] = useState<string | null>(null);
  const [products, loadingProducts, paginationProps] = usePagination(
    (opts) => getProducts({ ...opts, filter }),
    () => getProductsCount(filter),
    [filter]
  );
  const filteredProducts = useMemo(
    () => getFilteredProducts(products, search),
    [products, search]
  );
  const navigate = useNavigate();
  const handleAdd = () => navigate("nuevo");
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
              <ProductImportButton />
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
