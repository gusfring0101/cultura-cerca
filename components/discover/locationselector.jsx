import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Navigation } from "lucide-react";

export default function LocationSelector({ location, onLocationChange }) {
  const [address, setAddress] = useState(location?.address || "");
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            address: "Tu ubicación actual"
          };
          onLocationChange(newLocation);
          setAddress("Tu ubicación actual");
          setIsGettingLocation(false);
        },
        (error) => {
          console.error("Error obteniendo ubicación:", error);
          setIsGettingLocation(false);
        }
      );
    }
  };

  const handleAddressSubmit = () => {
    // En una implementación real, aquí usarías geocoding
    // Por ahora simulamos con Madrid como ubicación por defecto
    const newLocation = {
      lat: 40.4168,
      lng: -3.7038,
      address: address || "Madrid, España"
    };
    onLocationChange(newLocation);
  };

  return (
    <Card className="w-full shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-indigo-600" />
          ¿Dónde estás?
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2">
          <Input
            placeholder="Tu dirección o ciudad..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddressSubmit()}
            className="border-slate-200 focus:border-indigo-400 flex-1"
          />
          <Button
            onClick={handleAddressSubmit}
            variant="outline"
            size="sm"
            className="px-4"
          >
            Buscar
          </Button>
        </div>

        <Button
          onClick={getCurrentLocation}
          disabled={isGettingLocation}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
        >
          <Navigation className="w-4 h-4 mr-2" />
          {isGettingLocation ? "Obteniendo ubicación..." : "Usar mi ubicación"}
        </Button>

        {location && (
          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-green-600" />
              <span className="text-green-800 font-medium truncate">{location.address}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
