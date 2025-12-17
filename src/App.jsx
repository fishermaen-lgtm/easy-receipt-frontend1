export default function App() {
  return (
    <div style={{
      padding: '40px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#1e40af',
      minHeight: '100vh',
      color: 'white'
    }}>
      <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>
        🎉 Easy Receipt - TEST
      </h1>
      <p style={{ fontSize: '24px', marginBottom: '20px' }}>
        ✅ React läuft!
      </p>
      <p style={{ fontSize: '18px', marginBottom: '10px' }}>
        ✅ Vite funktioniert!
      </p>
      <p style={{ fontSize: '18px', marginBottom: '10px' }}>
        ✅ Vercel Deployment erfolgreich!
      </p>
      <div style={{
        marginTop: '40px',
        padding: '20px',
        backgroundColor: 'white',
        color: 'black',
        borderRadius: '10px'
      }}>
        <h2>Nächste Schritte:</h2>
        <ol>
          <li>Wenn du das siehst, funktioniert alles! 🎊</li>
          <li>Wir können jetzt die echte App hinzufügen</li>
          <li>Backend-Verbindung testen</li>
        </ol>
      </div>
    </div>
  );
}