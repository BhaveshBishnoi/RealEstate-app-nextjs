'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom Marker Icon
const createCustomIcon = (type: string) => {
    // We can use different colors based on type
    let color = '#2563eb'; // blue default
    if (type === 'Villa') color = '#7c3aed';
    if (type === 'Office') color = '#059669';
    if (type === 'Shop') color = '#db2777';
    if (type === 'Land') color = '#ca8a04';

    return L.divIcon({
        className: 'custom-marker',
        html: `<div style="
      background-color: ${color};
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
    "></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, -12],
    });
};

function MapUpdater({ center, zoom }: { center: [number, number] | null, zoom: number | null }) {
    const map = useMap();
    useEffect(() => {
        if (center && zoom) {
            map.setView(center, zoom, {
                animate: true,
                duration: 0.8
            });
        }
    }, [center, zoom, map]);
    return null;
}

interface Property {
    id: number;
    title: string;
    price: number;
    lat: number;
    lng: number;
    type: string;
}

interface MapClientProps {
    properties: Property[];
    onMarkerClick: (property: any) => void;
}

export default function MapClient({ properties, onMarkerClick }: MapClientProps) {
    const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

    const handleLocateMe = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                setUserLocation([latitude, longitude]);
            });
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    };

    // Determine center: user location or first property or default
    const center: [number, number] = userLocation
        ? userLocation
        : (properties.length > 0 ? [properties[0].lat, properties[0].lng] : [20.5937, 78.9629]);

    const zoom = userLocation ? 12 : (properties.length > 0 ? 10 : 5);

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <MapContainer
                center={center}
                zoom={zoom}
                style={{ height: '100%', width: '100%' }}
                zoomControl={false}
            >
                {/* Dark mode support logic could go here by checking matchMedia */}
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />

                <MarkerClusterGroup
                    chunkedLoading
                    polygonOptions={{
                        fillColor: '#2563eb',
                        color: '#2563eb',
                        weight: 2,
                        opacity: 1,
                        fillOpacity: 0.5
                    }}
                >
                    {properties.map((property) => (
                        <Marker
                            key={property.id}
                            position={[property.lat, property.lng]}
                            icon={createCustomIcon(property.type)}
                            eventHandlers={{
                                click: () => onMarkerClick(property),
                            }}
                        >
                            <Popup closeButton={false} offset={[0, -10]}>
                                <div style={{ minWidth: '180px', padding: '0.5rem' }}>
                                    <div style={{
                                        fontSize: '0.9rem',
                                        fontWeight: 700,
                                        marginBottom: '4px',
                                        color: '#0f172a'
                                    }}>
                                        {property.title}
                                    </div>
                                    <div style={{
                                        color: '#2563eb',
                                        fontWeight: 600,
                                        fontSize: '1rem',
                                        marginBottom: '8px'
                                    }}>
                                        ₹{property.price.toLocaleString('en-IN', { maximumFractionDigits: 1, notation: 'compact' })}
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onMarkerClick(property);
                                        }}
                                        style={{
                                            marginTop: '4px',
                                            background: '#0f172a',
                                            color: 'white',
                                            border: 'none',
                                            padding: '6px 12px',
                                            borderRadius: '6px',
                                            fontSize: '12px',
                                            width: '100%',
                                            cursor: 'pointer',
                                            fontWeight: 500
                                        }}
                                    >
                                        View Details
                                    </button>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MarkerClusterGroup>

                {userLocation && (
                    <Marker position={userLocation} icon={L.divIcon({
                        className: 'user-location',
                        html: '<div style="width: 16px; height: 16px; background: #2563eb; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 0 2px #2563eb;"></div>',
                        iconSize: [20, 20]
                    })} />
                )}

                <MapUpdater center={userLocation ? userLocation : null} zoom={userLocation ? 12 : null} />
            </MapContainer>

            {/* Floating Controls */}
            <div style={{
                position: 'absolute',
                bottom: '2rem',
                right: '2rem',
                zIndex: 1000,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
            }}>
                <button
                    onClick={handleLocateMe}
                    style={{
                        background: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '50%',
                        width: '48px',
                        height: '48px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                        fontSize: '1.2rem',
                        color: '#1e293b'
                    }}
                    title="Locate Me"
                >
                    📍
                </button>
            </div>
        </div>
    );
}
