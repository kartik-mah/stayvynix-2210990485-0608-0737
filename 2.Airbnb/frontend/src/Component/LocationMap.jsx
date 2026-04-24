import React, { useEffect, useRef } from "react";

function LocationMap({ latitude, longitude, title, landmark, city }) {
  const mapContainer = useRef(null);

  useEffect(() => {
    const lat = Number(latitude);
    const lng = Number(longitude);

    if (!mapContainer.current || Number.isNaN(lat) || Number.isNaN(lng)) return;
    if (!window.L) return;

    // Initialize map
    const map = window.L.map(mapContainer.current).setView(
      [lat, lng],
      15
    );

    // Add tile layer
    window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Match the Airbnb-style black marker look.
    const homeIcon = window.L.divIcon({
      html: `<div style="background:#1f1f1f;color:#fff;border-radius:9999px;width:42px;height:42px;display:flex;align-items:center;justify-content:center;font-size:18px;box-shadow:0 6px 16px rgba(0,0,0,.28);">⌂</div>`,
      className: "",
      iconSize: [42, 42],
      iconAnchor: [21, 21],
    });

    // Add marker
    window.L.marker([lat, lng], { icon: homeIcon })
      .addTo(map)
      .bindPopup(
        `<div class="text-sm font-semibold">${title}</div>
         <div class="text-xs">${landmark}, ${city}</div>`
      )
      .openPopup();

    map.scrollWheelZoom.disable();

    // Cleanup
    return () => {
      map.remove();
    };
  }, [latitude, longitude, title, landmark, city]);

  return (
    <div className="w-full">
      <div
        ref={mapContainer}
        className="w-full h-[420px] rounded-2xl overflow-hidden border border-[#dddddd] shadow-md"
      />
      <p className="text-[15px] text-[#6a6a6a] mt-[12px]">
        Exact location will be provided after booking.
      </p>
    </div>
  );
}

export default LocationMap;
