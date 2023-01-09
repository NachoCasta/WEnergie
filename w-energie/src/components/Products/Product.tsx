import Grid from "@mui/material/Grid";
import updateProduct from "database/products/updateProduct";
import { ProductData } from "database/products/productCollection";
import ProductForm, { ProductFormVariant } from "./ProductForm";
import { useProductFromParams } from "hooks/useProduct";
import nullthrows from "nullthrows";

export default function Product() {
  const [product] = useProductFromParams();
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
