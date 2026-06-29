import { useCallback, useEffect, useReducer } from "react";
import { round } from "lodash";
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

type State = {
  weight: string;
  deliveryCostPerKg: string;
  deliveryCost: string;
};

type Action =
  | { type: "SET_WEIGHT"; value: string }
  | { type: "SET_COST_PER_KG"; value: string }
  | { type: "SET_DELIVERY_COST"; value: string }
  | { type: "PRODUCTS_CHANGED"; totalWeight: number };

function computeCost(weight: string, costPerKg: string): string {
  return String(round(parseFloat(weight) * parseFloat(costPerKg), 2));
}

function computeCostPerKg(deliveryCost: string, weight: string): string {
  return String(round(parseFloat(deliveryCost) / parseFloat(weight), 2));
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_WEIGHT":
      return {
        weight: action.value,
        deliveryCostPerKg: state.deliveryCostPerKg,
        deliveryCost: computeCost(action.value, state.deliveryCostPerKg),
      };
    case "SET_COST_PER_KG":
      return {
        weight: state.weight,
        deliveryCostPerKg: action.value,
        deliveryCost: computeCost(state.weight, action.value),
      };
    case "SET_DELIVERY_COST":
      return {
        weight: state.weight,
        deliveryCostPerKg: computeCostPerKg(action.value, state.weight),
        deliveryCost: action.value,
      };
    case "PRODUCTS_CHANGED": {
      const newWeight = String(action.totalWeight);
      return {
        weight: newWeight,
        deliveryCostPerKg: state.deliveryCostPerKg,
        deliveryCost: computeCost(newWeight, state.deliveryCostPerKg),
      };
    }
  }
}

export default function useDeliveryCost(
  products: QuoteProduct[],
  initialValues: InitialQuoteValues,
  productsAutoChangedRef: React.MutableRefObject<boolean>,
): DeliveryCostResult {
  const [state, dispatch] = useReducer(reducer, undefined, () => {
    const weight = initialValues.weight ?? "0";
    const deliveryCost = initialValues.deliveryCost ?? "0";
    const deliveryCostPerKg =
      initialValues.weight != null && initialValues.deliveryCost != null
        ? String(parseFloat(deliveryCost) / parseFloat(weight))
        : "24";
    return { weight, deliveryCostPerKg, deliveryCost };
  });

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
    dispatch({ type: "PRODUCTS_CHANGED", totalWeight });
  }, [initialValues.products, products, productsAutoChangedRef]);

  const handleWeightChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      dispatch({ type: "SET_WEIGHT", value: e.target.value }),
    [],
  );
  const handleDeliveryCostPerKgChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      dispatch({ type: "SET_COST_PER_KG", value: e.target.value }),
    [],
  );
  const handleDeliveryCostChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      dispatch({ type: "SET_DELIVERY_COST", value: e.target.value }),
    [],
  );

  return {
    weight: state.weight,
    handleWeightChange,
    deliveryCostPerKg: state.deliveryCostPerKg,
    handleDeliveryCostPerKgChange,
    deliveryCost: state.deliveryCost,
    handleDeliveryCostChange,
  };
}
