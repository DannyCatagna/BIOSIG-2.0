import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import type { FeatureCollection } from "geojson";
import { areaId, areaName, type Area } from "../../data/gis/snap";
import "leaflet/dist/leaflet.css";

export function MapCanvas({
  areas,
  visible,
  selected,
  onSelect,
}: {
  areas: Area[];
  visible: boolean;
  selected?: Area;
  onSelect: (area: Area) => void;
}) {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const overlay = useRef<L.GeoJSON | null>(null);
  const select = useRef(onSelect);
  useEffect(() => {
    select.current = onSelect;
  }, [onSelect]);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!container.current) return;
    const instance = L.map(container.current, {
      scrollWheelZoom: false,
      minZoom: 3,
      maxZoom: 13,
    }).fitBounds([
      [-5.2, -92.3],
      [1.8, -75.1],
    ]);
    map.current = instance;
    instance.zoomControl.setPosition("topright");
    instance.zoomControl
      .getContainer()
      ?.querySelector(".leaflet-control-zoom-in")
      ?.setAttribute("aria-label", "Acercar mapa");
    instance.zoomControl
      .getContainer()
      ?.querySelector(".leaflet-control-zoom-out")
      ?.setAttribute("aria-label", "Alejar mapa");
    L.control.scale({ imperial: false }).addTo(instance);
    instance.attributionControl.addAttribution(
      "Natural Earth · dominio público · 1:10 millones",
    );
    const controller = new AbortController();
    fetch("/data/contexto-natural-earth.geojson", { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((data: FeatureCollection) => {
        L.geoJSON(data, {
          interactive: false,
          style: (f) => ({
            color: "#63735f",
            weight: 1,
            fillColor: f?.properties?.ADM0_A3 === "ECU" ? "#e6e4cb" : "#e1e6dc",
            fillOpacity: 1,
          }),
        })
          .addTo(instance)
          .bringToBack();
        setReady(true);
      })
      .catch((e) => {
        if (e.name !== "AbortError")
          setError("No se cargó el mapa de referencia. Recarga la página.");
      });
    const observer = new ResizeObserver(() => instance.invalidateSize());
    observer.observe(container.current);
    return () => {
      controller.abort();
      observer.disconnect();
      instance.remove();
      map.current = null;
    };
  }, []);
  useEffect(() => {
    if (!map.current) return;
    overlay.current?.remove();
    overlay.current = L.geoJSON(visible ? areas : [], {
      style: (f) => ({
        color:
          f && areaId(f as Area) === (selected && areaId(selected))
            ? "#9b3e13"
            : "#165b40",
        fillColor: "#4c9b68",
        fillOpacity: 0.4,
        weight: 2,
      }),
      onEachFeature: (f, layer) => {
        const label = document.createElement("span");
        label.textContent = areaName(f as Area);
        layer.bindTooltip(label);
        layer.on("click", () => select.current(f as Area));
      },
    }).addTo(map.current);
    return () => {
      overlay.current?.remove();
    };
  }, [areas, visible, selected]);
  useEffect(() => {
    if (selected && map.current)
      map.current.fitBounds(L.geoJSON(selected).getBounds(), {
        padding: [24, 24],
        maxZoom: 10,
      });
  }, [selected]);
  return (
    <section
      className="gis-map-section"
      aria-label="Mapa geográfico del Ecuador"
    >
      <div className="gis-toolbar" aria-label="Extensiones del mapa">
        <button
          onClick={() =>
            map.current?.fitBounds([
              [-5.2, -92.3],
              [1.8, -75.1],
            ])
          }
        >
          Vista inicial
        </button>
        <button
          onClick={() =>
            map.current?.fitBounds([
              [-5.2, -81.4],
              [1.7, -75.1],
            ])
          }
        >
          Ecuador continental
        </button>
        <button
          onClick={() =>
            map.current?.fitBounds([
              [-1.7, -92.2],
              [1.8, -89.1],
            ])
          }
        >
          Galápagos
        </button>
      </div>
      <div
        ref={container}
        className="gis-map"
        role="region"
        aria-label="Mapa interactivo: usa flechas para desplazarte y los controles para ampliar"
      />
      <p className="gis-map-status" role="status">
        {error ||
          (ready
            ? "Mapa de referencia cargado. Usa el buscador para seleccionar áreas también con teclado."
            : "Cargando mapa de referencia…")}
      </p>
      <p className="gis-legend">
        <span className="legend-land" /> Contexto territorial{" "}
        <span className="legend-snap" /> SNAP{" "}
        {areas.length ? (visible ? "(visible)" : "(oculto)") : "(sin cargar)"}{" "}
        <span className="legend-selected" /> Área seleccionada
      </p>
    </section>
  );
}
