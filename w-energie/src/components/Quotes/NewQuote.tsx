import {
  IconButton,
  InputAdornment,
  TablePaginationProps,
  TextField,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Title, { SubTitle } from "components/Common/Title";
import ProductTable from "components/Products/ProductTable";
import { useEffect, useMemo, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import getProduct from "database/products/getProduct";
import CircularProgress from "@mui/material/CircularProgress";
import useInput from "hooks/useInput";
import addQuote from "database/quotes/addQuote";
import { useNavigate } from "react-router";
import { QuoteProduct } from "database/quotes/quoteCollection";
import LoadingButton from "@mui/lab/LoadingButton";
import { Timestamp } from "firebase/firestore";
import { useLocation } from "react-use";
import _ from "lodash";
import { Product } from "database/products/productCollection";

export default function NewQuote() {
  const [products, setProducts] = useState<Array<QuoteProduct>>([]);
  const initialValues = useInitialValues();
  const initialProducts = initialValues.products;
  useEffect(() => {
    if (initialProducts != null) {
      Promise.all(
        initialProducts.map(async (p) => ({
          ...(await getProduct(p.id)),
          quantity: p.quantity,
        }))
      ).then((products) => setProducts(products));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialProducts?.toString()]);
  const handleAdd = async (productId: string) => {
    if (products.some((p) => p.id === productId)) {
      // If the product is already on the table, just increase the quantity
      setProducts(
        products.map((p) =>
          p.id === productId ? { ...p, quantity: p.quantity + 1 } : p
        )
      );
    } else {
      // If it's not, get it from the DB and add it to the table
      const product = await getProduct(productId);
      setProducts([...products, { ...product, quantity: 1 }]);
    }
  };
  const handleRemove = (productId: string) => {
    setProducts(
      products
        .map((p) =>
          p.id === productId ? { ...p, quantity: p.quantity - 1 } : p
        )
        .filter((p) => p.quantity > 0)
    );
  };
  const handleQuantityChange = (productId: string, quantity: number) => {
    setProducts(
      products.map((p) => (p.id === productId ? { ...p, quantity } : p))
    );
  };
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const client = {
      name: data.get("name") as string,
      rut: data.get("rut") as string,
      address: data.get("address") as string,
      phone: data.get("phone") as string,
      mail: data.get("mail") as string,
    };
    const quote = {
      concept: data.get("concept") as string,
      client,
      products,
      date: Timestamp.now(),
      deliveryTerm: data.get("deliveryTerm") as string,
      paymentForm: data.get("paymentForm") as string,
      deliveryCost: Number.parseFloat(data.get("deliveryCost") as string),
      installationCost: Number.parseFloat(
        data.get("installationCost") as string
      ),
      weight: Number.parseFloat(data.get("weight") as string),
      euroToClp: Number.parseInt(data.get("euroToClp") as string),
      discount: Number.parseInt(data.get("discount") as string),
    };
    setLoading(true);
    const id = await addQuote(quote);
    setLoading(false);
    navigate(`/cotizaciones/${id}`);
  };
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper
          sx={{ p: 2, display: "flex", flexDirection: "column" }}
          component="form"
          onSubmit={handleSubmit}
        >
          <Grid container spacing={2}>
            <FormHeader />
            <General />
            <Client />
            <Products
              products={products}
              onAdd={handleAdd}
              onRemove={handleRemove}
              onQuantityChange={handleQuantityChange}
            />
            <Delivery products={products} />
            <Others />
            <Grid
              item
              lg={12}
              sx={{ display: "flex", justifyContent: "flex-end" }}
            >
              <LoadingButton
                type="submit"
                variant="contained"
                loading={loading}
                loadingPosition="start"
                startIcon={<AddIcon />}
              >
                Crear
              </LoadingButton>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
}

function FormHeader() {
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

function General() {
  const initialValues = useInitialValues();
  return (
    <Grid item lg={12}>
      <TextField
        name="concept"
        label="Concepto"
        required
        fullWidth
        defaultValue={initialValues.concept}
      />
    </Grid>
  );
}

function Client() {
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

type ProductsProps = {
  products: Array<QuoteProduct>;
  onAdd: (productId: string) => Promise<void>;
  onRemove: (productId: string) => void;
  onQuantityChange: (productId: string, quantity: number) => void;
};

function Products({
  products,
  onAdd,
  onRemove,
  onQuantityChange,
}: ProductsProps) {
  const [productId, handleProductIdChange] = useInput("", () => {
    setAddError("");
  });
  const [addError, setAddError] = useState<string>("");
  const [loadingAdd, setLoadingAdd] = useState<boolean>(false);
  const handleAdd = async () => {
    if (!productId) {
      return;
    }
    setLoadingAdd(true);
    try {
      await onAdd(productId);
    } catch (err) {
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
  const [currentPageProducts, paginationProps] = usePagination(products);
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
          showQuantity
          maxHeight={440}
        />
      </Grid>
    </>
  );
}

type DeliveryProps = {
  products: Array<QuoteProduct>;
};

function Delivery({ products }: DeliveryProps) {
  const initialValues = useInitialValues();
  const [weight, handleWeightChange, setWeight] = useInput(
    initialValues.weight ?? "0"
  );
  const [deliveryCostPerKg, handleDeliveryCostPerKgChange] = useInput("19");
  const [deliveryCost, handleDeliveryCostChange, setDeliveryCost] = useInput(
    initialValues.deliveryCost ?? "0"
  );
  useEffect(() => {
    const totalWeight = products.reduce(
      (total, p) => total + (p?.weight ?? 0) * p.quantity,
      0
    );
    setWeight(String(totalWeight));
    setDeliveryCost((value: string) =>
      String(totalWeight * Number.parseFloat(value || "19"))
    );
  }, [products, setWeight, setDeliveryCost]);
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
            inputProps={{ min: 0, step: 0.001 }}
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
            inputProps={{ min: 0 }}
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
            inputProps={{ min: 0, step: 0.001 }}
            value={deliveryCost}
            onChange={handleDeliveryCostChange}
          />
        </Grid>
      </Grid>
    </Grid>
  );
}

function Others() {
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
            defaultValue={initialValues.euroToClp ?? 1010}
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

type Values = {
  concept: string | null;
  name: string | null;
  rut: string | null;
  phone: string | null;
  mail: string | null;
  address: string | null;
  paymentForm: string | null;
  deliveryTerm: string | null;
  products: Array<{ id: string; quantity: number }> | null;
  weight: string | null;
  deliveryCost: string | null;
  installationCost: string | null;
  euroToClp: string | null;
  discount: string | null;
};

function useInitialValues(): Values {
  const { search } = useLocation();
  const params = useMemo(() => new URLSearchParams(search), [search]);
  const productIds = params.get("products");
  let products = null;
  if (productIds != null) {
    products = Object.entries(_.countBy(productIds.split(","))).map(
      ([id, quantity]) => ({ id, quantity })
    );
  }
  const values = {
    concept: params.get("concept"),
    name: params.get("name"),
    rut: params.get("rut"),
    phone: params.get("phone"),
    mail: params.get("mail"),
    address: params.get("address"),
    paymentForm: params.get("paymentForm"),
    deliveryTerm: params.get("deliveryTerm"),
    products,
    weight: params.get("weight"),
    deliveryCost: params.get("deliveryCost"),
    installationCost: params.get("installationCost"),
    euroToClp: params.get("euroToClp"),
    discount: params.get("discount"),
  };
  return values;
}

function usePagination(products: Product[]): [Product[], TablePaginationProps] {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const currentPageProducts = products.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  const paginationProps = {
    count: products.length,
    rowsPerPage: rowsPerPage,
    page: page,
    onPageChange: handleChangePage,
    onRowsPerPageChange: handleChangeRowsPerPage,
  };
  return [currentPageProducts, paginationProps];
}
