export default function Loading() {
    return (
        <div style={{
            height: '100vh',
            width: '100vw',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: '#f8fafc',
            flexDirection: 'column'
        }}>
            <div className="loader" style={{
                width: '48px',
                height: '48px',
                border: '4px solid #e2e8f0',
                borderTopColor: '#2563eb',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
            }}></div>
            <h2 style={{ marginTop: '1rem', color: '#64748b', fontFamily: 'sans-serif' }}>Loading EstateMap...</h2>
            <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
}
