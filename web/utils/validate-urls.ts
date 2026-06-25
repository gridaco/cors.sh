export const validateUrls = (urls: string) => {
  const lines = urls
    .split(/[\n,]/)
    .map((line) => line.trim())
    .filter(Boolean);
  for (const line of lines) {
    try {
      new URL(line);
    } catch {
      return false;
    }
  }
  return true;
};
