'use client';

import { useState, useMemo } from 'react';
import Map from './Map';
import FilterBar from './FilterBar';
import PropertyDrawer from './PropertyDrawer';
import EnquiryModal from './EnquiryModal';

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

export default function Dashboard({ initialProperties }: { initialProperties: Property[] }) {
    const [filters, setFilters] = useState({
        type: 'All',
        saleMode: 'All',
        usage: 'All',
        minPrice: '',
        maxPrice: '',
        search: ''
    });

    const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);

    const filteredProperties = useMemo(() => {
        return initialProperties.filter(property => {
            if (filters.type !== 'All' && property.type !== filters.type) return false;
            if (filters.saleMode !== 'All' && property.saleMode !== filters.saleMode) return false;
            if (filters.usage !== 'All' && property.usage !== filters.usage) return false;

            if (filters.minPrice && property.price < parseInt(filters.minPrice)) return false;
            if (filters.maxPrice && property.price > parseInt(filters.maxPrice)) return false;

            if (filters.search) {
                const query = filters.search.toLowerCase();
                const match =
                    property.title.toLowerCase().includes(query) ||
                    property.city.toLowerCase().includes(query) ||
                    property.locality.toLowerCase().includes(query);
                if (!match) return false;
            }

            return true;
        });
    }, [initialProperties, filters]);

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleMarkerClick = (property: Property) => {
        setSelectedProperty(property);
        setIsDrawerOpen(true);
    };

    return (
        <div className="app-container">
            <div className="ui-overlay">
                <div className="top-bar">
                    <div className="logo">EstateMap</div>
                    <FilterBar filters={filters} onChange={handleFilterChange} />
                </div>
            </div>

            <Map
                properties={filteredProperties}
                onMarkerClick={handleMarkerClick}
            />

            <PropertyDrawer
                property={selectedProperty}
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                onEnquire={() => setIsEnquiryOpen(true)}
            />

            {selectedProperty && (
                <EnquiryModal
                    isOpen={isEnquiryOpen}
                    onClose={() => setIsEnquiryOpen(false)}
                    propertyTitle={selectedProperty.title}
                    propertyId={selectedProperty.id}
                />
            )}
        </div>
    );
}
