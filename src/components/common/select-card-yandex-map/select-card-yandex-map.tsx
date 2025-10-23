"use client";
import { useEffect, useRef, useState, useCallback, memo } from "react";
import { Spinner } from "@heroui/react";

// Type declarations for Yandex Maps using interfaces
interface YMapEvents {
  add(event: string, callback: (e: any) => void): void;
  remove(event: string, callback: (e: any) => void): void;
}

interface YMapGeoObjects {
  add(object: any): void;
  removeAll(): void;
}

interface YMap {
  events: YMapEvents;
  geoObjects: YMapGeoObjects;
  destroy(): void;
}

interface YMaps {
  Map: new (element: HTMLElement, options: any) => YMap;
  Placemark: new (
    coords: [number, number],
    properties: any,
    options?: any,
  ) => any;
  ready: (callback: () => void) => void;
  geocode: (query: string, options?: any) => Promise<any>;
}

declare global {
  interface Window {
    ymaps: YMaps;
  }
}

interface SelectCardYandexMapProps {
  onCoordinateSelect?: (coords: [number, number]) => void;
}

const SelectCardYandexMap = memo(function ({
  onCoordinateSelect,
}: SelectCardYandexMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<YMap | null>(null);
  const isInitialized = useRef(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const addMarker = useCallback((coords: [number, number]) => {
    if (!mapInstance.current || !window.ymaps) {
      return;
    }

    // Clear previous markers
    mapInstance.current.geoObjects.removeAll();

    // Create new marker with custom icon - without balloon
    const marker = new window.ymaps.Placemark(
      coords,
      {}, // Empty properties to avoid balloon
      {
        iconLayout: "default#image",
        iconImageHref: "/img/icons/map-icon.svg",
        iconImageSize: [50, 50],
        iconImageOffset: [-10, -40],
      },
    );

    // Add marker to map
    mapInstance.current.geoObjects.add(marker);
  }, []);

  const initializeMap = useCallback(() => {
    if (!mapRef.current || !window.ymaps || isInitialized.current) {
      return;
    }

    try {
      isInitialized.current = true;

      mapInstance.current = new window.ymaps.Map(mapRef.current, {
        center: [55.751244, 37.618423], // Moscow coordinates
        zoom: 12,
        controls: ["zoomControl", "fullscreenControl"],
      });

      // Add click event listener
      mapInstance.current.events.add("click", (e: any) => {
        const coords: [number, number] = e.get("coords");

        if (onCoordinateSelect) {
          onCoordinateSelect(coords);
        }

        addMarker(coords);
      });

      setIsLoading(false);
    } catch (err) {
      setError("Failed to initialize map");
      console.error("Map initialization error:", err);
    }
  }, [onCoordinateSelect, addMarker]);

  useEffect(() => {
    const yandexMapapiKey = process.env.NEXT_PUBLIC_YANDEX_MAP_API_KEY;

    console.log(yandexMapapiKey);

    let pollId: number | null = null;

    const loadYandexMap = () => {
      if (isInitialized.current) {
        return;
      }

      const existing = document.querySelector(
        `script[src*="api-maps.yandex.ru"]`,
      );
      const attachReady = () => {
        if (window.ymaps) {
          window.ymaps.ready(initializeMap);
          return true;
        }
        return false;
      };

      if (existing) {
        if (!attachReady()) {
          // Poll briefly for ymaps to attach to window
          let attempts = 0;
          pollId = window.setInterval(() => {
            attempts += 1;
            if (attachReady() || attempts > 200) {
              if (pollId) {
                window.clearInterval(pollId);
                pollId = null;
              }
              if (attempts > 200) {
                setError("Failed to initialize Yandex Maps API");
                setIsLoading(false);
              }
            }
          }, 25);
        }
        return;
      }

      if (!yandexMapapiKey) {
        setError("Yandex Maps API key is missing");
        setIsLoading(false);
        return;
      }

      const script = document.createElement("script");
      script.src = `https://api-maps.yandex.ru/2.1/?apikey=${yandexMapapiKey}&lang=ru_RU`;
      script.async = true;
      script.onload = () => {
        if (!attachReady()) {
          setError("Yandex Maps API loaded, but ymaps is unavailable");
          setIsLoading(false);
        }
      };
      script.onerror = () => {
        setError("Failed to load Yandex Maps API");
        setIsLoading(false);
      };
      document.head.appendChild(script);
    };

    loadYandexMap();

    return () => {
      if (pollId) {
        window.clearInterval(pollId);
      }
      if (mapInstance.current) {
        try {
          mapInstance.current.destroy();
          isInitialized.current = false;
        } catch (err) {
          console.error("Error destroying map:", err);
        }
      }
    };
  }, [initializeMap]);

  // HTTP fallback geocoding via Yandex Geocoder REST API
  const geocodeViaHttp = useCallback(
    async (text: string): Promise<[number, number] | null> => {
      try {
        const key = process.env.NEXT_PUBLIC_YANDEX_MAP_API_KEY;
        if (!key) {
          console.warn(
            "Missing NEXT_PUBLIC_YANDEX_MAP_API_KEY for HTTP geocode",
          );
          return null;
        }

        console.log("Using API key:", key.substring(0, 8) + "...");

        console.log("Geocoding query:", text);
        const url = `https://geocode-maps.yandex.ru/1.x/?apikey=${key}&format=json&lang=ru_RU&geocode=${encodeURIComponent(
          text,
        )}`;
        console.log("Geocoding URL:", url);

        const res = await fetch(url);
        console.log("Geocoding response status:", res.status);

        if (!res.ok) {
          const errorText = await res.text();
          console.error(
            "Geocoding API error:",
            res.status,
            res.statusText,
            errorText,
          );

          // Handle specific error cases
          if (res.status === 403) {
            console.error("API key is invalid or expired");
            return null;
          }

          return null;
        }

        const data = await res.json();
        console.log("Geocoding response data:", data);

        // Check if response has the expected structure
        if (!data?.response?.GeoObjectCollection?.featureMember) {
          console.warn("Invalid geocoding response structure:", data);
          return null;
        }

        const members = data.response.GeoObjectCollection.featureMember;
        if (!members || members.length === 0) {
          console.warn("No geocoding results found");
          return null;
        }

        const member = members[0];
        console.log("First member:", member);

        const pos: string | undefined = member?.GeoObject?.Point?.pos; // "lon lat"
        console.log("Position string:", pos);

        if (!pos) {
          console.warn("No position found in geocoding response");
          return null;
        }

        const [lonStr, latStr] = pos.split(" ");
        const lat = parseFloat(latStr);
        const lon = parseFloat(lonStr);

        console.log("Parsed coordinates:", { lat, lon });

        if (Number.isNaN(lat) || Number.isNaN(lon)) {
          console.warn("Invalid coordinates:", { lat, lon });
          return null;
        }

        return [lat, lon];
      } catch (e) {
        console.error("HTTP geocode error", e);
        return null;
      }
    },
    [],
  );

  const geocodeAndSelect = useCallback(async () => {
    const q = query.trim();
    if (!q) {
      return;
    }

    console.log("Starting geocoding for query:", q);
    console.log(
      "API Key available:",
      !!process.env.NEXT_PUBLIC_YANDEX_MAP_API_KEY,
    );

    try {
      setIsSearching(true);
      setError(null); // Clear previous errors
      let coords: [number, number] | null = null;

      // 1) Try ymaps.geocode when available
      if (window.ymaps && typeof window.ymaps.geocode === "function") {
        try {
          console.log("Trying ymaps.geocode for:", q);
          const res = await window.ymaps.geocode(q, { results: 1 });
          console.log("ymaps.geocode response:", res);
          const obj = res?.geoObjects?.get?.(0);
          console.log("First geo object:", obj);
          if (obj?.geometry?.getCoordinates) {
            coords = obj.geometry.getCoordinates();
            console.log("ymaps.geocode coordinates:", coords);
          }
        } catch (err) {
          console.warn("ymaps.geocode failed, will try HTTP fallback", err);
        }
      } else {
        console.log("ymaps.geocode not available, using HTTP fallback");
      }

      console.log("coords after ymaps.geocode:", coords);

      // 2) HTTP fallback
      if (!coords) {
        console.log("Trying HTTP fallback geocoding...");
        coords = await geocodeViaHttp(q);
      }

      if (!coords) {
        console.error("No coordinates found for query:", q);
        setError(
          `Адрес "${q}" не найден. Возможно, проблема с API ключом или попробуйте другой запрос.`,
        );
        return;
      }

      // Center the map and add marker
      try {
        console.log("Centering map to coordinates:", coords);
        (mapInstance.current as any)?.setCenter(coords, 16, { duration: 300 });
      } catch (err) {
        console.warn("Failed to center map", err);
      }

      console.log("Adding marker to coordinates:", coords);
      addMarker(coords);
      onCoordinateSelect?.(coords);
      setError(null);
      console.log("Geocoding completed successfully");
    } catch (error) {
      console.error("Geocoding error:", error);
      setError(
        "Не удалось выполнить поиск адреса. Проверьте подключение к интернету.",
      );
    } finally {
      setIsSearching(false);
    }
  }, [query, addMarker, onCoordinateSelect, geocodeViaHttp]);

  return (
    <div style={{ position: "relative", width: "100%", height: "500px" }}>
      <div
        style={{
          position: "absolute",
          top: 12,
          left: 12,
          zIndex: 20,
          display: "flex",
          gap: 8,
          background: "rgba(255,255,255,0.95)",
          padding: 8,
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
          alignItems: "center",
        }}
      >
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Поиск адреса"
          style={{
            width: 320,
            height: 36,
            border: "1px solid #e5e7eb",
            borderRadius: 6,
            padding: "0 10px",
            outline: "none",
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              geocodeAndSelect();
            }
          }}
        />
        <button
          onClick={geocodeAndSelect}
          disabled={isSearching}
          style={{
            height: 36,
            padding: "0 12px",
            background: "#111827",
            color: "white",
            borderRadius: 6,
            border: "none",
            cursor: isSearching ? "not-allowed" : "pointer",
            opacity: isSearching ? 0.7 : 1,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          {isSearching ? "Поиск..." : "Найти"}
        </button>
      </div>
      {isLoading && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            zIndex: 10,
            borderRadius: "8px",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <Spinner />
          <div style={{ fontSize: "18px", color: "#333" }}>
            Загрузка карты...
          </div>
        </div>
      )}

      {error && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#ffebee",
            color: "#c62828",
            padding: "20px",
            zIndex: 10,
            borderRadius: "8px",
            textAlign: "center",
          }}
        >
          <div>
            <div style={{ fontSize: "24px", marginBottom: "10px" }}>⛔</div>
            <div>Error: {error}</div>
          </div>
        </div>
      )}

      <div
        ref={mapRef}
        style={{ width: "100%", height: "100%", borderRadius: "8px" }}
        className="overflow-hidden !cursor-pointer"
      />
    </div>
  );
});

export default SelectCardYandexMap;
