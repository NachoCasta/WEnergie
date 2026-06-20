import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { useEffect, useRef, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import getProduct from "database/products/getProduct";
import addQuote from "database/quotes/addQuote";
import { useNavigate } from "react-router";
import { QuoteProduct } from "database/quotes/quoteCollection";
import LoadingButton from "@mui/lab/LoadingButton";
import { Timestamp } from "firebase/firestore";
import useInitialValues from "hooks/useInitialValues";
import {
  FormHeader,
  General,
  Client,
  ProductsSection,
  Delivery,
  Others,
} from "./NewQuoteFields";

export default function NewQuote() {
  const [products, setProducts] = useState<Array<QuoteProduct>>([]);
  const initialValues = useInitialValues();
  const initialProducts = initialValues.products;
  const productsAutoChangedRef = useRef(false);
  useEffect(() => {
    if (initialProducts != null) {
      Promise.all(
        initialProducts.map(async (p) => ({
          ...(await getProduct(p.id)),
          quantity: p.quantity,
        })),
      ).then((products) => {
        setProducts(products);
        productsAutoChangedRef.current = true;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialProducts?.toString()]);
  const handleAdd = async (productId: string) => {
    if (products.some((p) => p.id === productId)) {
      setProducts(
        products.map((p) =>
          p.id === productId ? { ...p, quantity: p.quantity + 1 } : p,
        ),
      );
    } else {
      const product = await getProduct(productId);
      setProducts([...products, { ...product, quantity: 1 }]);
    }
  };
  const handleRemove = (productId: string) => {
    setProducts(
      products
        .map((p) =>
          p.id === productId ? { ...p, quantity: p.quantity - 1 } : p,
        )
        .filter((p) => p.quantity > 0),
    );
  };
  const handleQuantityChange = (productId: string, quantity: number) => {
    setProducts(
      products.map((p) => (p.id === productId ? { ...p, quantity } : p)),
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
        data.get("installationCost") as string,
      ),
      weight: Number.parseFloat(data.get("weight") as string),
      euroToClp: Number.parseInt(data.get("euroToClp") as string),
      discount: Number.parseInt(data.get("discount") as string),
    };
    setLoading(true);
    try {
      const id = await addQuote(quote);
      navigate(`/cotizaciones/${id}`);
    } catch (error) {
      console.error("Error creating quote:", error);
      alert("Error al crear la cotización");
    } finally {
      setLoading(false);
    }
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
            <ProductsSection
              products={products}
              onAdd={handleAdd}
              onRemove={handleRemove}
              onQuantityChange={handleQuantityChange}
            />
            <Delivery
              products={products}
              productsAutoChangedRef={productsAutoChangedRef}
            />
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
