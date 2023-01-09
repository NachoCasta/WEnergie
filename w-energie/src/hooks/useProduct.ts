import nullthrows from "nullthrows";
import { useParams } from "react-router";
import { Product } from "database/products/productCollection";
import getProduct from "database/products/getProduct";
import { useAsync } from "react-use";

export default function useProduct(
  id: string
): [Product | undefined, boolean, Error | undefined] {
  const { value, loading, error } = useAsync(() => getProduct(id), [id]);
  return [value, loading, error];
}

export function useProductFromParams(): [
  Product | undefined,
  boolean,
  Error | undefined
] {
  const { productId } = useParams();
  return useProduct(nullthrows(productId));
}
