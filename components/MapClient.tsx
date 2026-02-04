'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Formatter for price
const formatPrice = (price: number) => {
    if (price >= 10000000) {
        return `₹${(price / 10000000).toFixed(1)}Cr`;
    } else if (price >= 100000) {
        return `₹${(price / 100000).toFixed(1)}L`;
    } else if (price >= 1000) {
        return `₹${(price / 1000).toFixed(1)}K`;
    }
    return `₹${price}`;
};

// Custom Marker Icon (Price Pill)
const createCustomIcon = (price: number, type: string) => {
    // Color coding based on type
    let color = '#2563eb'; // blue default
    if (type === 'Villa') color = '#7c3aed';
    if (type === 'Office') color = '#059669';
    if (type === 'Shop') color = '#db2777';
    if (type === 'Land') color = '#ca8a04';

    const priceText = formatPrice(price);

    return L.divIcon({
        className: 'custom-marker-pill',
        html: `<div style="
      background-color: ${color};
      color: white;
      padding: 4px 8px;
      border-radius: 12px;
      border: 2px solid white;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.3);
      font-weight: 700;
      font-size: 12px;
      white-space: nowrap;
      display: flex;
      align-items: center;
      justify-content: center;
      transform: translate(-50%, -50%);
    ">${priceText}</div>`,
        iconSize: [60, 24], // Approximate size, handled by CSS mostly
        iconAnchor: [30, 12],
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
    type: string;
    saleMode: string;
    usage: string;
    price: number;
    area: number;
    city: string;
    locality: string;
    lat: number;
    lng: number;
    images: string[];
    description: string;
}

interface MapClientProps {
    properties: Property[];
    onMarkerClick: (property: Property) => void;
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
                {/* Modern Tile Layer */}
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
                            icon={createCustomIcon(property.price, property.type)}
                            eventHandlers={{
                                click: () => onMarkerClick(property),
                            }}
                        >
                            <Popup closeButton={false} offset={[0, -10]} className="premium-popup">
                                <div style={{ width: '220px', padding: '0' }}>
                                    <div style={{
                                        width: '100%',
                                        height: '120px',
                                        backgroundImage: `url(${property.images && property.images.length > 0 ? property.images[0] : 'https://placehold.co/600x400?text=No+Image'})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        borderRadius: '8px 8px 0 0',
                                        marginBottom: '8px'
                                    }}></div>
                                    <div style={{ padding: '0 8px 8px 8px' }}>
                                        <div style={{
                                            fontSize: '0.95rem',
                                            fontWeight: 700,
                                            marginBottom: '4px',
                                            color: '#0f172a',
                                            lineHeight: '1.2'
                                        }}>
                                            {property.title}
                                        </div>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            marginBottom: '8px'
                                        }}>
                                            <span style={{
                                                color: '#2563eb',
                                                fontWeight: 700,
                                                fontSize: '1rem',
                                            }}>
                                                ₹{property.price.toLocaleString('en-IN', { maximumFractionDigits: 1, notation: 'compact' })}
                                            </span>
                                            <span style={{
                                                fontSize: '0.75rem',
                                                color: '#64748b',
                                                background: '#f1f5f9',
                                                padding: '2px 6px',
                                                borderRadius: '4px'
                                            }}>
                                                {property.type}
                                            </span>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onMarkerClick(property);
                                            }}
                                            style={{
                                                background: '#0f172a',
                                                color: 'white',
                                                border: 'none',
                                                padding: '8px 12px',
                                                borderRadius: '6px',
                                                fontSize: '13px',
                                                width: '100%',
                                                cursor: 'pointer',
                                                fontWeight: 500,
                                                transition: 'background 0.2s',
                                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                            }}
                                        >
                                            View Details
                                        </button>
                                    </div>
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
                gap: '0.75rem',
                flexDirection: 'column'
            }}>
                <button
                    onClick={handleLocateMe}
                    style={{
                        background: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        width: '48px',
                        height: '48px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        color: '#1e293b',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    title="Locate Me"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v5" />
                        <path d="M5.55 21a2 2 0 0 0 16.9 0" />
                        <circle cx="12" cy="12" r="3" />
                        <path d="M12 2v2" />
                        <path d="M12 20v2" />
                        <path d="M20 12h2" />
                        <path d="M2 12h2" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
