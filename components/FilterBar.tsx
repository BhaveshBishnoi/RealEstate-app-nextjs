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

// Icons
const SearchIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}>
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
);

const HomeIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}>
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline points="9 22 9 12 15 12 15 22"></polyline>
    </svg>
);

const TagIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}>
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
        <line x1="7" y1="7" x2="7.01" y2="7"></line>
    </svg>
);

const BriefcaseIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}>
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
    </svg>
);

const RupeeIcon = () => (
    <span style={{ fontSize: '14px', opacity: 0.5, fontWeight: 600 }}>₹</span>
);

export default function FilterBar({ filters, onChange }: FilterBarProps) {
    const propertyTypes = ['All', 'Land', 'Plot', 'Flat', 'Villa', 'Office', 'Shop', 'Warehouse'];
    const saleModes = ['All', 'Fresh', 'Resale'];
    const usages = ['All', 'Residential', 'Commercial'];

    const handleChange = (e: ChangeEvent<HTMLSelectElement | HTMLInputElement>, key: keyof Filters) => {
        onChange(key, e.target.value);
    };

    return (
        <div className="filters-container">
            <div className="input-wrapper" style={{ minWidth: '240px' }}>
                <div className="input-icon"><SearchIcon /></div>
                <input
                    type="text"
                    placeholder="Search location..."
                    className="filter-input-with-icon"
                    value={filters.search}
                    onChange={(e) => handleChange(e, 'search')}
                />
            </div>

            <div className="divider" />

            <div className="input-wrapper">
                <div className="input-icon"><HomeIcon /></div>
                <select
                    className="filter-select-with-icon"
                    value={filters.type}
                    onChange={(e) => handleChange(e, 'type')}
                >
                    <option value="" disabled>Type</option>
                    {propertyTypes.map(t => <option key={t} value={t}>{t === 'All' ? 'All Types' : t}</option>)}
                </select>
            </div>

            <div className="input-wrapper">
                <div className="input-icon"><TagIcon /></div>
                <select
                    className="filter-select-with-icon"
                    value={filters.saleMode}
                    onChange={(e) => handleChange(e, 'saleMode')}
                >
                    <option value="" disabled>Mode</option>
                    {saleModes.map(m => <option key={m} value={m}>{m === 'All' ? 'All Modes' : m}</option>)}
                </select>
            </div>

            <div className="input-wrapper">
                <div className="input-icon"><BriefcaseIcon /></div>
                <select
                    className="filter-select-with-icon"
                    value={filters.usage}
                    onChange={(e) => handleChange(e, 'usage')}
                >
                    <option value="" disabled>Usage</option>
                    {usages.map(u => <option key={u} value={u}>{u === 'All' ? 'All Usages' : u}</option>)}
                </select>
            </div>

            <div className="divider" />

            <div className="input-wrapper">
                <div className="input-icon"><RupeeIcon /></div>
                <input
                    type="number"
                    placeholder="Min Price"
                    className="filter-input-with-icon"
                    value={filters.minPrice}
                    onChange={(e) => handleChange(e, 'minPrice')}
                    style={{ width: '110px' }}
                />
            </div>

            <div className="input-wrapper">
                <div className="input-icon"><RupeeIcon /></div>
                <input
                    type="number"
                    placeholder="Max Price"
                    className="filter-input-with-icon"
                    value={filters.maxPrice}
                    onChange={(e) => handleChange(e, 'maxPrice')}
                    style={{ width: '110px' }}
                />
            </div>
        </div>
    );
}
