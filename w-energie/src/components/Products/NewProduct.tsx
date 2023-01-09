import Grid from "@mui/material/Grid";
import addProduct from "database/products/addProduct";
import { useNavigate } from "react-router";
import { ProductData } from "database/products/productCollection";
import ProductForm, { ProductFormVariant } from "./ProductForm";

export default function NewProduct() {
  const navigate = useNavigate();
  const handleSubmit = async (product: ProductData) => {
    const id = await addProduct(product);
    navigate(`/productos/${id}`);
  };
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <ProductForm onSubmit={handleSubmit} variant={ProductFormVariant.New} />
      </Grid>
    </Grid>
  );
}
