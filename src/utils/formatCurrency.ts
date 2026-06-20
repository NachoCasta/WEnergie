const clpFormatter = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
});
const euroFormatter = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "EUR",
  currencyDisplay: "narrowSymbol",
});

export function formatClp(amount: number): string {
  return clpFormatter.format(amount);
}

export function formatEuro(amount: number): string {
  return euroFormatter.format(amount);
}
