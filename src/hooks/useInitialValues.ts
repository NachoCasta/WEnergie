import { useMemo } from "react";
import { useLocation } from "react-use";
import _ from "lodash";

export type InitialQuoteValues = {
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

export default function useInitialValues(): InitialQuoteValues {
  const { search } = useLocation();
  const params = useMemo(() => new URLSearchParams(search), [search]);
  const productIds = params.get("products");
  const products = useMemo(() => {
    if (productIds == null) {
      return null;
    }
    return Object.entries(_.countBy(productIds.split(","))).map(
      ([id, quantity]) => ({ id, quantity }),
    );
  }, [productIds]);
  return {
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
}
