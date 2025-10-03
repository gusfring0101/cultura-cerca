import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { CulturalPlace } from "@/entities/CulturalPlace";
import { User } from "@/entities/User";
import "leaflet/dist/leaflet.css";

export default function Map() {
  const [places, setPlaces] = useState([]);
  const [userLocation, setUserLocation] = useState([40.4168, -3.7038]); // Madrid por defecto
  
  useEffect(() => {
    loadUserAndPlaces();
  }, []);

  const loadUserAndPlaces = async () => {
    try {
      const user = await User.me();
      if (user.location) {
        setUserLocation([user.location.lat, user.location.lng]);
      }
    } catch (error) {
      console.log("Usuario no autenticado");
    }

    try {
      const culturalPlaces = await CulturalPlace.list();
      setPlaces(culturalPlaces);
    } catch (error) {
      console.error("Error cargando lugares:", error);
    }
  };

  return (
    <div className="h-screen w-full relative">
      <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
        <h1 className="text-xl font-bold text-slate-800 mb-2">Mapa Cultural</h1>
        <p className="text-sm text-slate-600">
          Lugares culturales guardados en favoritos
        </p>
      </div>
      
      <MapContainer
        center={userLocation}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        className="z-0"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {places.map((place, index) => (
          <Marker 
            key={index}
            position={[place.location?.lat || userLocation[0], place.location?.lng || userLocation[1]]}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-slate-800">{place.name}</h3>
                <p className="text-sm text-slate-600 mb-2">{place.category}</p>
                <p className="text-xs text-slate-500">{place.location?.address}</p>
                {place.avg_price && (
                  <p className="text-xs text-amber-600 font-medium mt-1">
                    Desde {place.avg_price}€
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
