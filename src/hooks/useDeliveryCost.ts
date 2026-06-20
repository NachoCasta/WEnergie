import { useEffect, useRef } from "react";
import { useLatest } from "react-use";
import _ from "lodash";
import useInput from "./useInput";
import { InitialQuoteValues } from "./useInitialValues";
import { QuoteProduct } from "database/quotes/quoteCollection";

type DeliveryCostResult = {
  weight: string;
  handleWeightChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  deliveryCostPerKg: string;
  handleDeliveryCostPerKgChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  deliveryCost: string;
  handleDeliveryCostChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function useDeliveryCost(
  products: QuoteProduct[],
  initialValues: InitialQuoteValues,
  productsAutoChangedRef: React.MutableRefObject<boolean>,
): DeliveryCostResult {
  const [weight, handleWeightChange, setWeight] = useInput(
    initialValues.weight ?? "0",
  );
  const [deliveryCostPerKg, handleDeliveryCostPerKgChange, setDeliveryCostPerKg] =
    useInput(() => {
      if (initialValues.weight != null && initialValues.deliveryCost != null) {
        return String(
          Number.parseFloat(initialValues.deliveryCost) /
            Number.parseFloat(initialValues.weight),
        );
      }
      return "24";
    });
  const [deliveryCost, handleDeliveryCostChange, setDeliveryCost] = useInput(
    initialValues.deliveryCost ?? "0",
  );

  const deliveryCostAutoChangedRef = useRef(false);
  const deliveryCostPerKgAutoChangedRef = useRef(false);

  useEffect(() => {
    const initialProducts = initialValues.products;
    if (
      initialProducts != null &&
      initialProducts.length > 0 &&
      products.length === 0
    ) {
      return;
    }
    if (productsAutoChangedRef.current) {
      productsAutoChangedRef.current = false;
      return;
    }
    const totalWeight = products.reduce(
      (total, p) => total + (p?.weight ?? 0) * p.quantity,
      0,
    );
    setWeight(String(totalWeight));
  }, [initialValues.products, products, productsAutoChangedRef, setWeight]);

  useEffect(() => {
    if (deliveryCostPerKgAutoChangedRef.current) {
      deliveryCostPerKgAutoChangedRef.current = false;
      return;
    }
    setDeliveryCost(
      String(
        _.round(
          Number.parseFloat(weight) * Number.parseFloat(deliveryCostPerKg),
          2,
        ),
      ),
    );
    deliveryCostAutoChangedRef.current = true;
  }, [setDeliveryCost, weight, deliveryCostPerKg]);

  const latestWeight = useLatest(weight);
  useEffect(() => {
    if (deliveryCostAutoChangedRef.current) {
      deliveryCostAutoChangedRef.current = false;
      return;
    }
    setDeliveryCostPerKg(
      String(
        _.round(
          Number.parseFloat(deliveryCost) /
            Number.parseFloat(latestWeight.current),
          2,
        ),
      ),
    );
    deliveryCostPerKgAutoChangedRef.current = true;
  }, [setDeliveryCostPerKg, deliveryCost, latestWeight]);

  return {
    weight,
    handleWeightChange,
    deliveryCostPerKg,
    handleDeliveryCostPerKgChange,
    deliveryCost,
    handleDeliveryCostChange,
  };
}
