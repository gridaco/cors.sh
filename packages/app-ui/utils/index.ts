export const validateUrls = (urls: string) => {
  const lines = urls.split(",").map((line) => line.trim());
  for (const line of lines) {
    try {
      new URL(line);
    } catch (e) {
      return false;
    }
  }
  return true;
};
