export function createProductQueryUrl(
  basePath: string,
  params: Record<string, any>
): string {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v) => query.append(key, v));
    } else if (value !== undefined && value !== null && value !== "") {
      query.set(key, String(value));
    }
  });

  return `${basePath}?${query.toString()}`;
}
