export function trimText(
  text: string,
  maxLength = 25,
  mode: "middle" | "end" = "middle"
): string {
  if (text.length <= maxLength) return text;

  if (mode === "end") {
    return text.slice(0, maxLength - 3) + "...";
  }

  // middle mode
  const charsToKeep = maxLength - 3; // space for "..."
  const startLength = Math.ceil(charsToKeep / 2);
  const endLength = Math.floor(charsToKeep / 2);

  const start = text.slice(0, startLength);
  const end = text.slice(-endLength);
  return `${start}...${end}`;
}
