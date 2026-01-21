"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { useDebounce } from "@/hooks"

const createCustomIcon = () => L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

interface LocationPickerProps {
  latitude: number | null
  longitude: number | null
  onLocationChange: (lat: number, lng: number, address?: string) => void
}

export default function LocationPicker({
  latitude,
  longitude,
  onLocationChange,
}: LocationPickerProps) {
  const mapRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)
  const searchContainerRef = useRef<HTMLDivElement>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const onLocationChangeRef = useRef(onLocationChange)
  const [isClient, setIsClient] = useState(false)
  const [mapInitialized, setMapInitialized] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  useEffect(() => {
    onLocationChangeRef.current = onLocationChange
  }, [onLocationChange])

  useEffect(() => {
    setIsClient(true)
  }, [])

  const updateMarker = useCallback((lat: number, lng: number, shouldPan: boolean = true) => {
    if (!mapRef.current) return

    const customIcon = createCustomIcon()

    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng])
    } else {
      markerRef.current = L.marker([lat, lng], { icon: customIcon }).addTo(mapRef.current)
    }

    if (shouldPan) {
      mapRef.current.setView([lat, lng], 17)
    }
  }, [])

  useEffect(() => {
    if (!isClient || !mapContainerRef.current || mapRef.current) return

    const initialLat = latitude ?? 40.7650
    const initialLng = longitude ?? 29.9400
    const initialZoom = (latitude && longitude) ? 17 : 10

    mapRef.current = L.map(mapContainerRef.current).setView([initialLat, initialLng], initialZoom)

    if (latitude && longitude) {
      const customIcon = createCustomIcon()
      markerRef.current = L.marker([latitude, longitude], { icon: customIcon }).addTo(mapRef.current)
    }

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(mapRef.current)

    setTimeout(() => {
      mapRef.current?.invalidateSize()
    }, 100)

    mapRef.current.on("click", async (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng
      const customIcon = createCustomIcon()

      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng])
      } else {
        markerRef.current = L.marker([lat, lng], { icon: customIcon }).addTo(mapRef.current!)
      }

      mapRef.current!.setView([lat, lng], 17)

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
        )
        const data = await response.json()
        const address = data.address
        const locationText = [address?.city || address?.town || address?.village, address?.state || address?.province]
          .filter(Boolean)
          .join(", ")
        onLocationChangeRef.current(lat, lng, locationText || data.display_name)
      } catch {
        onLocationChangeRef.current(lat, lng)
      }
    })

    setMapInitialized(true)

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
        markerRef.current = null
        setMapInitialized(false)
      }
    }
  }, [isClient])

  useEffect(() => {
    if (!mapInitialized || !mapRef.current) return

    if (latitude !== null && longitude !== null) {
      updateMarker(latitude, longitude, true)
    }
  }, [latitude, longitude, mapInitialized, updateMarker])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  useEffect(() => {
    if (debouncedSearchQuery.trim().length < 2) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    const fetchSuggestions = async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(debouncedSearchQuery)}&limit=5&countrycodes=tr&addressdetails=1`
        )
        const data = await response.json()
        setSuggestions(data)
        setShowSuggestions(data.length > 0)
      } catch {
        setSuggestions([])
      }
    }

    fetchSuggestions()
  }, [debouncedSearchQuery])

  const selectLocation = (lat: number, lon: number, displayName: string, address?: any) => {
    if (!mapRef.current) return

    const locationText = address
      ? [address?.city || address?.town || address?.village, address?.state || address?.province]
          .filter(Boolean)
          .join(", ")
      : displayName.split(",").slice(0, 2).join(",").trim()

    onLocationChangeRef.current(lat, lon, locationText || displayName)
    updateMarker(lat, lon, true)

    setSearchQuery(displayName)
    setShowSuggestions(false)
  }

  if (!isClient) {
    return (
      <div className="w-full h-96 bg-surface-hover rounded-lg flex items-center justify-center">
        <div className="text-text-tertiary">Harita yükleniyor...</div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="text-sm text-text-secondary">
        Adres aratın veya harita üzerinde bir noktaya tıklayarak konum seçin
      </div>

      <div className="relative" ref={searchContainerRef}>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg className="w-4 h-4 text-text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            placeholder="Konum ara..."
            className="w-full pl-10 pr-3 py-2 text-sm border border-input-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-input-focus"
            autoComplete="off"
          />
        </div>

        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-surface border border-input-border rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                onClick={() => selectLocation(parseFloat(suggestion.lat), parseFloat(suggestion.lon), suggestion.display_name, suggestion.address)}
                className="w-full px-3 py-2 text-left text-sm bg-surface hover:bg-primary-bg transition-colors border-b border-border last:border-b-0 cursor-pointer"
              >
                <div className="font-medium text-text-primary">{suggestion.display_name}</div>
                {suggestion.address && (
                  <div className="text-xs text-text-tertiary mt-0.5">
                    {[suggestion.address.city, suggestion.address.state, suggestion.address.country]
                      .filter(Boolean)
                      .join(", ")}
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      <div ref={mapContainerRef} className="w-full h-96 rounded-lg border border-input-border z-0" style={{ minHeight: '384px' }} />

      {latitude && longitude && (
        <div className="text-sm text-success font-medium">
          ✓ Konum seçildi
        </div>
      )}
    </div>
  )
}
