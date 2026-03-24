import { useState, useEffect } from "react";

const useGeolocation = () => {
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation({
        latitude: null,
        longitude: null,
        loading: false,
        error: "Geolocation not supported",
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          loading: false,
          error: null,
        });
      },
      () => {
        setLocation({
          latitude: null,
          longitude: null,
          loading: false,
          error: "Permission denied",
        });
      }
    );
  }, []);

  return location;
};

export default useGeolocation;