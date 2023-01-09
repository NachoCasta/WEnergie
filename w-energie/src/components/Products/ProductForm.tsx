import { InputAdornment, TextField } from "@mui/material";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import AddIcon from "@mui/icons-material/Add";
import LoadingButton from "@mui/lab/LoadingButton";
import { SubTitle } from "components/Common/Title";
import { ProductData, ProductType } from "database/products/productCollection";
import { useState } from "react";
import SaveIcon from "@mui/icons-material/Save";

export enum ProductFormVariant {
  New,
  Edit,
}

type ProductFormProps = {
  variant: ProductFormVariant;
  onSubmit: (product: ProductData) => Promise<void>;
  product?: ProductData;
};

export default function ProductForm(props: ProductFormProps) {
  const { onSubmit, variant, product } = props;
  const [loading, setLoading] = useState<boolean>(false);
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const productData = {
      name: data.get("name") as string,
      description: data.get("description") as string,
      price: Number.parseInt(data.get("price") as string),
      weight: Number.parseInt(data.get("weight") as string),
      type: product?.type ?? ProductType.Custom,
    };
    setLoading(true);
    await onSubmit(productData);
    setLoading(false);
  };
  return (
    <Paper
      sx={{ p: 2, display: "flex", flexDirection: "column" }}
      component="form"
      onSubmit={handleSubmit}
    >
      <Grid container spacing={2}>
        <Grid item lg={12}>
          <SubTitle>Producto</SubTitle>
        </Grid>
        <Grid item lg={6}>
          <TextField
            name="name"
            label="Nombre"
            required
            fullWidth
            defaultValue={product?.name}
          />
        </Grid>
        <Grid item lg={3}>
          <TextField
            name="price"
            type="number"
            label="Precio"
            required
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">€</InputAdornment>
              ),
            }}
            inputProps={{ min: 0 }}
            defaultValue={product?.price.toString()}
          />
        </Grid>
        <Grid item lg={3}>
          <TextField
            name="weight"
            type="number"
            label="Peso"
            required
            fullWidth
            InputProps={{
              endAdornment: <InputAdornment position="end">Kg</InputAdornment>,
            }}
            inputProps={{ min: 0, step: 0.01 }}
            defaultValue={product?.weight.toString()}
          />
        </Grid>
        <Grid item lg={12}>
          <TextField
            name="description"
            label="Descripción"
            fullWidth
            multiline
            minRows={4}
            defaultValue={product?.description}
          />
        </Grid>
        <Grid item lg={12} sx={{ display: "flex", justifyContent: "flex-end" }}>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={loading}
            loadingPosition="start"
            startIcon={getSubmitIcon(variant)}
          >
            {getSubmitText(variant)}
          </LoadingButton>
        </Grid>
      </Grid>
    </Paper>
  );
}

function getSubmitText(variant: ProductFormVariant): string {
  switch (variant) {
    case ProductFormVariant.New:
      return "Crear";
    case ProductFormVariant.Edit:
      return "Guardar";
  }
}

function getSubmitIcon(variant: ProductFormVariant) {
  switch (variant) {
    case ProductFormVariant.New:
      return <AddIcon />;
    case ProductFormVariant.Edit:
      return <SaveIcon />;
  }
}
