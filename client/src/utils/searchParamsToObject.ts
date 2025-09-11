export function searchParamsToObject(searchParams: URLSearchParams) {
  const result: Record<string, any> = {};

  for (const [key, value] of searchParams.entries()) {
    if (result[key]) {
      result[key] = Array.isArray(result[key])
        ? [...result[key], value]
        : [result[key], value];
    } else {
      result[key] = value;
    }
  }

  return result;
}
