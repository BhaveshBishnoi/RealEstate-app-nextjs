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

interface DrawerProps {
    property: Property | null;
    isOpen: boolean;
    onClose: () => void;
    onEnquire: () => void;
}

export default function PropertyDrawer({ property, isOpen, onClose, onEnquire }: DrawerProps) {
    if (!property) return null;

    return (
        <div className={`drawer ${isOpen ? 'open' : ''}`}>
            <button className="drawer-close" onClick={onClose}>&times;</button>

            <div className="drawer-content">
                <img src={property.images[0]} alt={property.title} className="property-image" />

                <div style={{ marginBottom: '1rem' }}>
                    <span className="tag type">{property.type}</span>
                    <span className="tag mode">{property.saleMode}</span>
                    <span className="tag">{property.usage}</span>
                </div>

                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.2, marginBottom: '0.5rem' }}>
                    {property.title}
                </h2>

                <p style={{ color: 'var(--secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                    {property.locality}, {property.city}
                </p>

                <div className="price-tag">
                    ₹ {property.price.toLocaleString('en-IN')}
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '1rem',
                    margin: '1.5rem 0',
                    padding: '1rem',
                    background: 'var(--background)',
                    borderRadius: 'var(--radius)'
                }}>
                    <div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--secondary)' }}>Area</div>
                        <div style={{ fontWeight: 600 }}>{property.area} sq ft</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--secondary)' }}>Type</div>
                        <div style={{ fontWeight: 600 }}>{property.type}</div>
                    </div>
                </div>

                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>Description</h3>
                <p style={{ lineHeight: 1.6, color: 'var(--secondary)', marginBottom: '2rem' }}>
                    {property.description}
                </p>

                <div style={{ fontSize: '0.8rem', color: 'var(--secondary)', marginBottom: '1rem' }}>
                    Location: {property.lat.toFixed(4)}, {property.lng.toFixed(4)}
                </div>

                <button className="btn-primary" onClick={onEnquire}>
                    Send Enquiry
                </button>
            </div>
        </div>
    );
}
