import XLSX from "xlsx";

export default async function parseExcel<RawData, Data>(
  file: File,
  parseData: (rawData: RawData) => Data
): Promise<Array<Data>> {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer);
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const rawData = XLSX.utils.sheet_to_json<RawData>(worksheet);
  const data = rawData.map(parseData);
  return data;
}
