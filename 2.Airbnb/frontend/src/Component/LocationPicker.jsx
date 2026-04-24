import React, { useState, useRef } from "react";

function LocationPicker({ onLocationSelect }) {
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [mapPreview, setMapPreview] = useState(null);
  const [useGeolocation, setUseGeolocation] = useState(false);

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude: lat, longitude: lng } = position.coords;
        setLatitude(lat.toFixed(4));
        setLongitude(lng.toFixed(4));
        setMapPreview(`https://maps.openstreetmap.org/?mlat=${lat}&mlon=${lng}&zoom=13`);
        onLocationSelect(lat, lng);
      });
    } else {
      alert("Geolocation is not supported by your browser");
    }
  };

  const handleCoordinatesChange = () => {
    if (latitude && longitude) {
      setMapPreview(
        `https://maps.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}&zoom=13`
      );
      onLocationSelect(parseFloat(latitude), parseFloat(longitude));
    }
  };

  return (
    <div className="w-full bg-gray-50 p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Add Location</h3>

      {/* Geolocation Button */}
      <div className="mb-6">
        <button
          type="button"
          onClick={handleGetCurrentLocation}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
        >
          📍 Use My Current Location
        </button>
      </div>

      <div className="relative mb-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-gray-50 text-gray-500">OR</span>
        </div>
      </div>

      {/* Manual Coordinate Entry */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Latitude
          </label>
          <input
            type="number"
            step="0.0001"
            min="-90"
            max="90"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            placeholder="e.g., 28.7041"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Longitude
          </label>
          <input
            type="number"
            step="0.0001"
            min="-180"
            max="180"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            placeholder="e.g., 77.1025"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={handleCoordinatesChange}
        className="w-full bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-gray-900 transition mb-4"
      >
        Preview Location
      </button>

      {/* Map Preview Link */}
      {mapPreview && (
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600 mb-2">
            Location: {latitude}, {longitude}
          </p>
          <a
            href={mapPreview}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline text-sm"
          >
            View on Map →
          </a>
        </div>
      )}

      {/* Info Box */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-gray-700">
        <p className="font-semibold mb-1">How to find coordinates:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Google Maps: Right-click on location → Copy coordinates</li>
          <li>OpenStreetMap: Click on location → Coordinates appear</li>
          <li>Or use the "Use My Location" button above</li>
        </ul>
      </div>
    </div>
  );
}

export default LocationPicker;
