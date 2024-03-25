import { useState, useEffect } from "react";

const useHost = () => {
  const [host, setHost] = useState<string>();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHost(window.location.origin);
    }
  }, []);

  return host;
};

export default useHost;
