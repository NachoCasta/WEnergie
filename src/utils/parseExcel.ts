type StringKeyedObject = {
  [key: string]: any;
}

export default async function parseExcel<RawData extends StringKeyedObject, Data>(
  file: File,
  parseData: (rawData: RawData) => Data
): Promise<Array<Data>> {
  const XLSX = await import("xlsx");
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer);
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const rawData = XLSX.utils.sheet_to_json<RawData>(worksheet);
  const data = rawData.map(normalizeRow).map(parseData);
  return data;
}

function normalizeRow<RawData extends StringKeyedObject>(row: RawData): RawData {
  return Object.fromEntries(
    Object.entries(row).map(([k, v]) => [k.trim(), v])
  ) as RawData;
}
