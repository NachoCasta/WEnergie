import {
  setDoc,
  doc,
  query,
  getCountFromServer,
  where,
} from "firebase/firestore";
import productCollection, {
  ProductData,
  ProductType,
} from "./productCollection";

const CUSTOM_PRODUCT = "WE";

export default async function addProduct(
  product: ProductData
): Promise<string> {
  const snapshot = await getCountFromServer(
    query(productCollection, where("type", "==", ProductType.Custom))
  );
  const count = snapshot.data().count;
  const productNumber = count + 1;
  const productNumberString = productNumber.toString().padStart(7, "0");
  const id = `${CUSTOM_PRODUCT}-${productNumberString}`;
  await setDoc(doc(productCollection, id), product);
  return id;
}
