export default function newsPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8" style={{ backgroundColor: 'var(--ct-bg)' }}>
      <div className="text-center">
        <div className="text-6xl mb-4">🎸</div>
        <h1 className="text-3xl font-black mb-2" style={{ color: 'var(--ct-text)' }}>Music Wire</h1>
        <p style={{ color: 'var(--ct-text-muted)' }}>Live music news from everywhere</p>
        <p className="mt-4 text-xs" style={{ color: 'var(--ct-text-muted)' }}>Full page coming online shortly</p>
      </div>
    </div>
  );
}
