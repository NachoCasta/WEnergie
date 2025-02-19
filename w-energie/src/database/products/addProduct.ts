import { setDoc, doc, query, getDocs } from "firebase/firestore";
import productCollection, { ProductData } from "./productCollection";
import { queryByIdConstraints } from "database/queryByIdConstraints";

const CUSTOM_PRODUCT = "WE";

export default async function addProduct(
  product: ProductData
): Promise<string> {
  const snapshot = await getDocs(
    query(productCollection, ...queryByIdConstraints(CUSTOM_PRODUCT))
  );
  const prevProduct = snapshot.docs[snapshot.docs.length - 1];
  let prevProductNumber = 0;
  if (prevProduct != null) {
    prevProductNumber = parseInt(prevProduct.id.split("-")[1], 10);
  }
  const productNumber = prevProductNumber + 1;
  const productNumberString = productNumber.toString().padStart(7, "0");
  const id = `${CUSTOM_PRODUCT}-${productNumberString}`;
  await setDoc(doc(productCollection, id), product);
  return id;
}
