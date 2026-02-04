import { useState } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    propertyTitle: string;
    propertyId: number;
}

export default function EnquiryModal({ isOpen, onClose, propertyTitle, propertyId }: ModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        mobile: '',
        email: '',
        message: 'I am interested in this property.'
    });

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/enquiry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, propertyId })
            });

            if (res.ok) {
                alert('Enquiry sent successfully!');
                onClose();
                setFormData({ name: '', mobile: '', email: '', message: 'I am interested in this property.' });
            } else {
                alert('Failed to send enquiry.');
            }
        } catch (error) {
            alert('Error sending enquiry.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal" onClick={e => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Enquire Now</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
                </div>

                <p style={{ marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--secondary)' }}>
                    Enquiring for: <strong>{propertyTitle}</strong>
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Name</label>
                        <input
                            required
                            className="form-input"
                            type="text"
                            placeholder="Your Name"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Mobile</label>
                        <input
                            required
                            className="form-input"
                            type="tel"
                            placeholder="Your Mobile Number"
                            value={formData.mobile}
                            onChange={e => setFormData({ ...formData, mobile: e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input
                            required
                            className="form-input"
                            type="email"
                            placeholder="Your Email"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Message</label>
                        <textarea
                            required
                            className="form-textarea"
                            placeholder="Write your message..."
                            value={formData.message}
                            onChange={e => setFormData({ ...formData, message: e.target.value })}
                        />
                    </div>

                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Sending...' : 'Send Enquiry'}
                    </button>
                </form>
            </div>
        </div>
    );
}
