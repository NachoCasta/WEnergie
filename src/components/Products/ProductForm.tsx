import { InputAdornment, TextField } from "@mui/material";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import AddIcon from "@mui/icons-material/Add";
import LoadingButton from "@mui/lab/LoadingButton";
import { SubTitle } from "components/Common/Title";
import { ProductData, ProductType } from "database/products/productCollection";
import { useState } from "react";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import { getProductDescription, getProductName } from "utils/productUtils";
import deleteProduct from "database/products/deleteProduct";
import { useNavigate, useParams } from "react-router-dom";

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
  const { productId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const handleDelete = () => {
    if (productId == null) return;
    deleteProduct(productId);
    navigate("/productos");
  };
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const productData = {
      name: data.get("name") as string,
      nameGerman: "",
      description: data.get("description") as string,
      descriptionGerman: "",
      price: Number.parseFloat(data.get("price") as string),
      weight: Number.parseFloat(data.get("weight") as string),
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
          <SubTitle>{getTitle(variant)}</SubTitle>
        </Grid>
        <Grid item lg={6}>
          <TextField
            name="name"
            label="Nombre"
            required
            fullWidth
            defaultValue={product != null ? getProductName(product) : null}
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
            inputProps={{ min: 0, step: 0.01 }}
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
            defaultValue={(product?.weight ?? 0).toString()}
          />
        </Grid>
        <Grid item lg={12}>
          <TextField
            name="description"
            label="Descripción"
            fullWidth
            multiline
            minRows={4}
            defaultValue={
              product != null ? getProductDescription(product) : null
            }
          />
        </Grid>
        <Grid
          item
          container
          spacing={1}
          lg={12}
          sx={{ justifyContent: "flex-end" }}
        >
          {variant === ProductFormVariant.Edit && (
            <Grid item>
              <LoadingButton
                variant="outlined"
                color="error"
                loading={loading}
                loadingPosition="start"
                startIcon={<DeleteIcon />}
                onClick={handleDelete}
              >
                Eliminar
              </LoadingButton>
            </Grid>
          )}
          <Grid item>
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
      </Grid>
    </Paper>
  );
}

function getTitle(variant: ProductFormVariant): string {
  switch (variant) {
    case ProductFormVariant.New:
      return "Nuevo producto";
    case ProductFormVariant.Edit:
      return "Editar producto";
  }
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
