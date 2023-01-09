import Layout from "./Layout/Layout";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  RouterProvider,
  Route,
} from "react-router-dom";
import Products from "./Products/Products";
import NewQuote from "components/Quotes/NewQuote";
import Quotes from "./Quotes/Quotes";
import Quote from "./Quotes/Quote";
import { QuoteDocumentViewer } from "./Quotes/QuoteDocument";
import NewProduct from "./Products/NewProduct";
import Product from "./Products/Product";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route
        path="/cotizaciones/:quoteId/pdf"
        element={<QuoteDocumentViewer />}
      />
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="cotizaciones" />} />
        <Route path="cotizaciones">
          <Route index element={<Quotes />} />
          <Route path="nueva" element={<NewQuote />} />
          <Route path=":quoteId">
            <Route index element={<Quote />} />
          </Route>
        </Route>
        <Route path="productos">
          <Route index element={<Products />} />
          <Route path="nuevo" element={<NewProduct />} />
          <Route path=":productId" element={<Product />} />
        </Route>
      </Route>
    </>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
