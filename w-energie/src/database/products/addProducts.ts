import { db } from "database";
import { writeBatch, doc } from "firebase/firestore";
import productCollection, { Product } from "./productCollection";
import _ from "lodash";

export default async function addProducts(
  products: Array<Product>
): Promise<void> {
  const chunks = _.chunk(products, 500);
  await Promise.all(
    chunks.map(async (chunk) => {
      const batch = writeBatch(db);
      chunk.forEach((product) => {
        const { id, ...data } = product;
        const ref = doc(productCollection, id);
        batch.set(ref, data);
      });
      await batch.commit();
    })
  );
}
