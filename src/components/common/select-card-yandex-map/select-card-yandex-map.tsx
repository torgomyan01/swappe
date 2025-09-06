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
        center: [40.1772, 44.5035],
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
    const yandexMapapiKey =
      process.env.NEXT_PUBLIC_YANDEX_MAP_API_KEY || "YOUR_API_KEY";

    const loadYandexMap = () => {
      if (
        isInitialized.current ||
        document.querySelector(`script[src*="api-maps.yandex.ru"]`)
      ) {
        if (window.ymaps) {
          initializeMap();
        }
        return;
      }

      const script = document.createElement("script");
      script.src = `https://api-maps.yandex.ru/2.1/?apikey=${yandexMapapiKey}&lang=ru_RU`;
      script.async = true;
      script.onload = () => {
        window.ymaps.ready(initializeMap);
      };
      script.onerror = () => {
        setError("Failed to load Yandex Maps API");
        setIsLoading(false);
      };
      document.head.appendChild(script);
    };

    loadYandexMap();

    return () => {
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

  return (
    <div style={{ position: "relative", width: "100%", height: "500px" }}>
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
            Բեռնվում է քարտեզը...
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
            <div>Սխալ: {error}</div>
          </div>
        </div>
      )}

      <div
        ref={mapRef}
        style={{ width: "100%", height: "100%", borderRadius: "8px" }}
      />
    </div>
  );
});

export default SelectCardYandexMap;
