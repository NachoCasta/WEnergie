import { IconButton, InputAdornment, TextField } from "@mui/material";
import Grid from "@mui/material/Grid";
import Title, { SubTitle } from "components/Common/Title";
import ProductTable from "components/Products/ProductTable";
import { useEffect, useRef, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import CircularProgress from "@mui/material/CircularProgress";
import useInput from "hooks/useInput";
import { QuoteProduct } from "database/quotes/quoteCollection";
import useInitialValues from "hooks/useInitialValues";
import useClientPagination from "hooks/useClientPagination";
import useDeliveryCost from "hooks/useDeliveryCost";
import { EUR_TO_CLP_DEFAULT } from "appConstants";

export function FormHeader() {
  const date = new Date().toLocaleDateString("es-CL");
  return (
    <>
      <Grid item lg={9} sx={{ display: "flex", alignItems: "center" }}>
        <Title>Nueva cotización</Title>
      </Grid>
      <Grid item lg={3}>
        <TextField
          name="date"
          label="Fecha"
          fullWidth
          size="small"
          value={date}
          disabled
        />
      </Grid>
    </>
  );
}

export function General() {
  const initialValues = useInitialValues();
  return (
    <Grid item lg={12}>
      <TextField
        name="concept"
        label="Concepto"
        fullWidth
        defaultValue={initialValues.concept}
      />
    </Grid>
  );
}

export function Client() {
  const initialValues = useInitialValues();
  return (
    <>
      <Grid item lg={12}>
        <SubTitle>Cliente</SubTitle>
      </Grid>
      <Grid item lg={3}>
        <TextField
          name="name"
          label="Nombre"
          required
          fullWidth
          defaultValue={initialValues.name}
        />
      </Grid>
      <Grid item lg={3}>
        <TextField
          name="rut"
          label="Rut"
          fullWidth
          defaultValue={initialValues.rut}
        />
      </Grid>
      <Grid item lg={3}>
        <TextField
          name="phone"
          label="Teléfono"
          fullWidth
          defaultValue={initialValues.phone}
        />
      </Grid>
      <Grid item lg={3}>
        <TextField
          name="mail"
          label="Mail"
          fullWidth
          defaultValue={initialValues.mail}
        />
      </Grid>
      <Grid item lg={6}>
        <TextField
          name="address"
          label="Dirección"
          fullWidth
          defaultValue={initialValues.address}
        />
      </Grid>
      <Grid item lg={3}>
        <TextField
          name="paymentForm"
          label="Forma de pago"
          fullWidth
          defaultValue={initialValues.paymentForm}
        />
      </Grid>
      <Grid item lg={3}>
        <TextField
          name="deliveryTerm"
          label="Plazo de entrega"
          fullWidth
          defaultValue={initialValues.deliveryTerm}
        />
      </Grid>
    </>
  );
}

type ProductsSectionProps = {
  products: Array<QuoteProduct>;
  onAdd: (productId: string) => Promise<void>;
  onRemove: (productId: string) => void;
  onQuantityChange: (productId: string, quantity: number) => void;
  onMoveUp: (productId: string) => void;
  onMoveDown: (productId: string) => void;
};

export function ProductsSection({
  products,
  onAdd,
  onRemove,
  onQuantityChange,
  onMoveUp,
  onMoveDown,
}: ProductsSectionProps) {
  const [productId, handleProductIdChange] = useInput("", () => {
    setAddError("");
  });
  const [addError, setAddError] = useState<string>("");
  const [loadingAdd, setLoadingAdd] = useState<boolean>(false);
  const handleAdd = async () => {
    if (!productId) return;
    setLoadingAdd(true);
    try {
      await onAdd(productId);
    } catch {
      setAddError("Producto no encontrado");
    } finally {
      setLoadingAdd(false);
    }
  };
  const handleAddKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const justAddedRef = useRef(false);
  const prevLengthRef = useRef(products.length);
  const [currentPageProducts, paginationProps, setPage] = useClientPagination(products);

  useEffect(() => {
    if (products.length > prevLengthRef.current) {
      const lastPage = Math.floor((products.length - 1) / paginationProps.rowsPerPage);
      setPage(lastPage);
      justAddedRef.current = true;
    }
    prevLengthRef.current = products.length;
  }, [products.length]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (justAddedRef.current) {
      justAddedRef.current = false;
      tableContainerRef.current?.scrollTo({ top: tableContainerRef.current.scrollHeight });
    }
  }, [currentPageProducts]);

  return (
    <>
      <Grid item lg={9} sx={{ display: "flex", alignItems: "center" }}>
        <SubTitle>Productos</SubTitle>
      </Grid>
      <Grid item lg={3}>
        <TextField
          name="productId"
          label="Agregar producto"
          placeholder="ID del producto"
          color="secondary"
          focused
          size="small"
          InputProps={{
            endAdornment: (
              <IconButton onClick={handleAdd} disabled={loadingAdd}>
                {loadingAdd ? (
                  <CircularProgress color="secondary" size={24} />
                ) : (
                  <AddIcon />
                )}
              </IconButton>
            ),
          }}
          inputProps={{ onKeyDown: handleAddKey }}
          value={productId}
          onChange={handleProductIdChange}
          error={Boolean(addError)}
          helperText={addError}
        />
      </Grid>
      <Grid item lg={12}>
        <ProductTable
          products={currentPageProducts}
          paginationProps={paginationProps}
          onRemove={onRemove}
          onQuantityChange={onQuantityChange}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
          showQuantity
          maxHeight={440}
          containerRef={tableContainerRef}
        />
      </Grid>
    </>
  );
}

type DeliveryProps = {
  products: Array<QuoteProduct>;
  productsAutoChangedRef: React.MutableRefObject<boolean>;
};

export function Delivery({ products, productsAutoChangedRef }: DeliveryProps) {
  const initialValues = useInitialValues();
  const {
    weight,
    handleWeightChange,
    deliveryCostPerKg,
    handleDeliveryCostPerKgChange,
    deliveryCost,
    handleDeliveryCostChange,
  } = useDeliveryCost(products, initialValues, productsAutoChangedRef);
  return (
    <Grid item lg={6}>
      <Grid container spacing={2}>
        <Grid item lg={12}>
          <SubTitle>Transporte</SubTitle>
        </Grid>
        <Grid item lg={4}>
          <TextField
            name="weight"
            type="number"
            label="Peso"
            required
            fullWidth
            value={weight}
            onChange={handleWeightChange}
            InputProps={{
              endAdornment: <InputAdornment position="end">Kg</InputAdornment>,
            }}
            inputProps={{ min: 0, step: 0.01 }}
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            name="deliveryCostPerKg"
            type="number"
            label="Costo por Kg"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">€</InputAdornment>
              ),
            }}
            inputProps={{ min: 0, step: 0.01 }}
            value={deliveryCostPerKg}
            onChange={handleDeliveryCostPerKgChange}
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            name="deliveryCost"
            type="number"
            label="Total"
            required
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">€</InputAdornment>
              ),
            }}
            inputProps={{ min: 0, step: 0.01 }}
            value={deliveryCost}
            onChange={handleDeliveryCostChange}
          />
        </Grid>
      </Grid>
    </Grid>
  );
}

export function Others() {
  const initialValues = useInitialValues();
  return (
    <Grid item lg={6}>
      <Grid container spacing={2}>
        <Grid item lg={12}>
          <SubTitle>Otros</SubTitle>
        </Grid>
        <Grid item lg={4}>
          <TextField
            name="installationCost"
            type="number"
            label="Instalación"
            required
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">€</InputAdornment>
              ),
            }}
            inputProps={{ min: 0 }}
            defaultValue={initialValues.installationCost}
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            name="euroToClp"
            type="number"
            label="Precio Euro"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
            inputProps={{ min: 1 }}
            defaultValue={initialValues.euroToClp ?? EUR_TO_CLP_DEFAULT}
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            name="discount"
            type="number"
            label="Descuento"
            required
            fullWidth
            InputProps={{
              endAdornment: <InputAdornment position="start">%</InputAdornment>,
            }}
            inputProps={{ min: 0, max: 100 }}
            defaultValue={initialValues.discount ?? 0}
          />
        </Grid>
      </Grid>
    </Grid>
  );
}
