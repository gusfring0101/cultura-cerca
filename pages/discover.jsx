import React, { useState, useEffect } from "react";
import { CulturalPlace } from "@/entities/CulturalPlace";
import { User } from "@/entities/User";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";

import LocationSelector from "./components/discover/LocationSelector";
import FilterPanel from "./components/discover/FilterPanel";
import PlaceCard from "./components/discover/PlaceCard";

const WEBHOOK_URL =
  import.meta?.env?.VITE_N8N_WEBHOOK_URL ||
  "https://cultura-cerca.duckdns.org/webhook/cc-search";

export default function Discover() {
  const [location, setLocation] = useState(null);
  const [filters, setFilters] = useState({
    maxDistance: 10,
    maxBudget: 50,
    interests: [],
  });
  const [places, setPlaces] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [user, setUser] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    loadUser();
    loadFavorites();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      if (currentUser?.location) {
        setLocation(currentUser.location);
      }
      if (currentUser?.preferences) {
        setFilters({
          maxDistance: currentUser.preferences.max_distance ?? 10,
          maxBudget: currentUser.preferences.max_budget ?? 50,
          interests: currentUser.preferences.interests ?? [],
        });
      }
    } catch (_e) {
      // Usuario no autenticado o sin datos
      console.log("Usuario no autenticado");
    }
  };

  const loadFavorites = async () => {
    try {
      const userPlaces = await CulturalPlace.list();
      setFavorites(userPlaces);
    } catch (error) {
      console.error("Error cargando favoritos:", error);
    }
  };

  const handleLocationChange = async (newLocation) => {
    setLocation(newLocation);
    if (user) {
      try {
        // Actualizamos sólo el campo que nos interesa
        await User.updateMyUserData({ location: newLocation });
      } catch (error) {
        console.error("Error guardando ubicación:", error);
      }
    }
  };

  const handleFiltersChange = async (newFilters) => {
    setFilters(newFilters);
    if (user) {
      try {
        await User.updateMyUserData({
          preferences: {
            max_distance: newFilters.maxDistance,
            max_budget: newFilters.maxBudget,
            interests: newFilters.interests,
          },
        });
      } catch (error) {
        console.error("Error guardando preferencias:", error);
      }
    }
  };

  const searchCulturalPlaces = async () => {
    if (!location) {
      alert("Por favor, selecciona una ubicación primero");
      return;
    }

    setIsSearching(true);
    setHasSearched(true);

    try {
      // Payload que espera tu workflow de n8n
      const payload = {
        location: { lat: location.lat, lng: location.lng },
        maxKm: Number(filters.maxDistance) || 10,
        maxBudget: Number(filters.maxBudget) || 50,
        prefs: Array.isArray(filters.interests) ? filters.interests : [],
      };

      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Webhook error (${res.status}): ${errText}`);
      }

      const data = await res.json();
      // Esperamos un objeto con { places: [...] }
      const incoming = Array.isArray(data?.places) ? data.places : [];

      // Normalizamos al modelo de tarjeta que usas en la UI
      const processedPlaces = incoming.map((p) => {
        // campos esperados por PlaceCard y por tus entidades
        return {
          name: p.name || "Lugar cultural",
          description: p.description || "",
          category: p.category || "museo",
          location: {
            // si el webhook devuelve address separado, lo ponemos aquí
            address: p.address || p.location?.address || "Dirección no disponible",
            // si no viene lat/lng reales, "jitter" alrededor de la búsqueda para el mapa
            lat:
              p.location?.lat ??
              location.lat + (Math.random() - 0.5) * 0.02,
            lng:
              p.location?.lng ??
              location.lng + (Math.random() - 0.5) * 0.02,
          },
          opening_hours: p.opening_hours || "",
          avg_price: typeof p.avg_price === "number" ? p.avg_price : undefined,
          website: p.website || "",
          phone: p.phone || "",
          rating: typeof p.rating === "number" ? p.rating : undefined,
          price_range: p.price_range || "",
          current_events: Array.isArray(p.current_events) ? p.current_events : [],
          image_url:
            p.image_url ||
            `https://source.unsplash.com/800x600/?${encodeURIComponent(
              p.category || "culture"
            )},culture,art`,
        };
      });

      setPlaces(processedPlaces);
    } catch (error) {
      console.error("Error buscando lugares:", error);
      alert("Error buscando lugares culturales. Por favor, inténtalo de nuevo.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleFavorite = async (place) => {
    try {
      const isFavorite = favorites.some((fav) => fav.name === place.name);
      if (!isFavorite) {
        const newFavorite = await CulturalPlace.create(place);
        setFavorites((prev) => [...prev, newFavorite]);
      }
    } catch (error) {
      console.error("Error añadiendo a favoritos:", error);
    }
  };

  const isFavorite = (place) => {
    return favorites.some((fav) => fav.name === place.name);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-amber-500 bg-clip-text text-transparent mb-3">
            Descubre Cultura Cerca
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Encuentra experiencias culturales únicas en tu ciudad adaptadas a tus gustos, presupuesto y ubicación
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-1 space-y-6">
            <LocationSelector
              location={location}
              onLocationChange={handleLocationChange}
            />
            <FilterPanel
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onSearch={searchCulturalPlaces}
            />
          </div>

          <div className="lg:col-span-2 flex">
            {isSearching ? (
              <div className="flex flex-col items-center justify-center w-full min-h-[600px] bg-white/50 backdrop-blur-sm rounded-2xl border border-indigo-100">
                <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mb-4" />
                <p className="text-lg font-medium text-slate-700">Buscando lugares culturales...</p>
                <p className="text-sm text-slate-500 mt-2">Esto puede tardar unos segundos</p>
              </div>
            ) : hasSearched ? (
              places.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6 w-full"
                >
                  <h2 className="text-2xl font-bold text-slate-800 mb-6">
                    Encontramos {places.length} lugares culturales para ti
                  </h2>
                  <div className="grid gap-6">
                    <AnimatePresence>
                      {places.map((place, index) => (
                        <motion.div
                          key={`${place.name}-${index}`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <PlaceCard
                            place={place}
                            onFavorite={handleFavorite}
                            isFavorite={isFavorite(place)}
                          />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ) : (
                <div className="flex items-center justify-center w-full min-h-[600px] bg-white/50 backdrop-blur-sm rounded-2xl border border-indigo-100">
                  <div className="text-center">
                    <p className="text-lg text-slate-600">
                      No se encontraron lugares culturales con tus criterios.
                    </p>
                    <p className="text-sm text-slate-500 mt-2">
                      Prueba ampliando tu radio de búsqueda o presupuesto.
                    </p>
                  </div>
                </div>
              )
            ) : (
              <div className="flex items-center justify-center w-full min-h-[600px] bg-white/50 backdrop-blur-sm rounded-2xl border border-indigo-100">
                <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }}>
                  <p className="text-slate-600">
                    Ajusta tu ubicación y filtros, y pulsa <strong>Buscar</strong>.
                  </p>
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
