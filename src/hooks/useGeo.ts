import { useEffect, useState } from "react";

export default function useGeo() {
  const [geo, setGeo] = useState({
    country: "unknown",
    city: "unknown",
    ip: "unknown",
  });

  useEffect(() => {
    const cached = sessionStorage.getItem("geo");
    if (cached) {
      setGeo(JSON.parse(cached));
      return;
    }

    fetch("https://ipapi.co/json/") // Free API, no key needed
      .then((res) => res.json())
      .then((data) => {
        const result = {
          country: data.country || "unknown",
          city: data.city || "unknown",
          ip: data.ip || "unknown",
        };

        sessionStorage.setItem("geo", JSON.stringify(result));
        setGeo(result);
      })
      .catch(() => {});
  }, []);

  return geo;
}
