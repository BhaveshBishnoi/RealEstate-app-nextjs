import { ChangeEvent } from 'react';

interface Filters {
    type: string;
    saleMode: string;
    usage: string;
    minPrice: string;
    maxPrice: string;
    search: string;
}

interface FilterBarProps {
    filters: Filters;
    onChange: (key: keyof Filters, value: string) => void;
}

export default function FilterBar({ filters, onChange }: FilterBarProps) {
    const propertyTypes = ['All', 'Land', 'Plot', 'Flat', 'Villa', 'Office', 'Shop', 'Warehouse'];
    const saleModes = ['All', 'Fresh', 'Resale'];
    const usages = ['All', 'Residential', 'Commercial'];

    const handleChange = (e: ChangeEvent<HTMLSelectElement | HTMLInputElement>, key: keyof Filters) => {
        onChange(key, e.target.value);
    };

    return (
        <div className="filters-container">
            <input
                type="text"
                placeholder="Search location..."
                className="search-input"
                value={filters.search}
                onChange={(e) => handleChange(e, 'search')}
                style={{ minWidth: '200px' }}
            />

            <select
                className="filter-select"
                value={filters.type}
                onChange={(e) => handleChange(e, 'type')}
            >
                <option value="" disabled>Type</option>
                {propertyTypes.map(t => <option key={t} value={t}>{t === 'All' ? 'All Types' : t}</option>)}
            </select>

            <select
                className="filter-select"
                value={filters.saleMode}
                onChange={(e) => handleChange(e, 'saleMode')}
            >
                <option value="" disabled>Mode</option>
                {saleModes.map(m => <option key={m} value={m}>{m === 'All' ? 'All Modes' : m}</option>)}
            </select>

            <select
                className="filter-select"
                value={filters.usage}
                onChange={(e) => handleChange(e, 'usage')}
            >
                <option value="" disabled>Usage</option>
                {usages.map(u => <option key={u} value={u}>{u === 'All' ? 'All Usages' : u}</option>)}
            </select>

            <input
                type="number"
                placeholder="Min Price"
                className="filter-select"
                value={filters.minPrice}
                onChange={(e) => handleChange(e, 'minPrice')}
                style={{ width: '120px' }}
            />

            <input
                type="number"
                placeholder="Max Price"
                className="filter-select"
                value={filters.maxPrice}
                onChange={(e) => handleChange(e, 'maxPrice')}
                style={{ width: '120px' }}
            />
        </div>
    );
}
