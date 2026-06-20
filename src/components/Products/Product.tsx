import { Alert } from "@mui/material";
import Grid from "@mui/material/Grid";
import updateProduct from "database/products/updateProduct";
import { ProductData } from "database/products/productCollection";
import ProductForm, { ProductFormVariant } from "./ProductForm";
import { useProductFromParams } from "hooks/useProduct";
import nullthrows from "nullthrows";

export default function Product() {
  const [product, , error] = useProductFromParams();
  if (error) {
    return <Alert severity="error">Error al cargar el producto: {error.message}</Alert>;
  }
  const handleSubmit = async (productData: ProductData) => {
    const id = nullthrows(product).id;
    await updateProduct({ id, ...productData });
  };
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        {product != null && (
          <ProductForm
            onSubmit={handleSubmit}
            variant={ProductFormVariant.Edit}
            product={product}
          />
        )}
      </Grid>
    </Grid>
  );
}
