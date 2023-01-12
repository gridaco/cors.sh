export function keyinfo(key: string): {
  signature: string;
  mode: "temp" | "live" | "test" | "v2022";
} {
  const mode = key.split("_")[0];
  const signature = key.split("_")[1];

  switch (mode) {
    case "temp":
    case "live":
    case "test": {
      return {
        mode,
        signature,
      };
    }
    default: {
      // legacy key
      return {
        mode: "v2022",
        signature: key,
      };
    }
  }
}
