export function handleError(error: unknown, userMessage: string): void {
  console.error(error);
  alert(userMessage);
}
