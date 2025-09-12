export const getFileNameFromUrl = (urlString: string) => {
  const parts = urlString.split("/");
  const fileNameWithQuery = parts[parts.length - 1];
  const fileName = fileNameWithQuery.split("?")[0];
  return fileName;
};
