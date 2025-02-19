import { orderBy } from "firebase/firestore";
import quoteCollection, { Quote } from "./quoteCollection";

import getData, { GetDataOpts } from "database/getData";

export default async function getQuotes(
  opts: GetDataOpts
): Promise<Array<Quote>> {
  return getData(quoteCollection, [orderBy("date", "desc")], opts);
}
