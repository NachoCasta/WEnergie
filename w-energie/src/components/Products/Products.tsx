import { Button } from "@mui/material";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Title from "components/Common/Title";
import getProducts from "database/products/getProducts";
import AddIcon from "@mui/icons-material/Add";
import UploadIcon from "@mui/icons-material/Upload";
import parseProducts from "utils/parseProducts";
import addProducts from "database/products/addProducts";
import LoadingButton from "@mui/lab/LoadingButton";
import { useState } from "react";
import ProductTable from "./ProductTable";
import { useNavigate } from "react-router-dom";
import usePagination from "hooks/usePagination";
import getProductsCount from "database/products/getProductsCount";

export default function Products() {
  const [products, loadingProducts, paginationProps] = usePagination(
    getProducts,
    getProductsCount
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
          <Grid item sx={{ alignSelf: "flex-end", pb: 1 }}>
            <Button
              color="primary"
              variant="contained"
              sx={{ mr: 1 }}
              onClick={handleAdd}
              startIcon={<AddIcon />}
            >
              Agregar
            </Button>
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
          <ProductTable
            products={products}
            paginationProps={paginationProps}
            loading={loadingProducts}
            onView={handleView}
          />
        </Paper>
      </Grid>
    </Grid>
  );
}
