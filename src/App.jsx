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
        Easy Receipt - TEST VERSION
      </h1>
      <p style={{ fontSize: '24px', marginBottom: '20px' }}>
        React laeuft!
      </p>
      <p style={{ fontSize: '18px', marginBottom: '10px' }}>
        Vite funktioniert!
      </p>
      <p style={{ fontSize: '18px', marginBottom: '10px' }}>
        Vercel Deployment erfolgreich!
      </p>
      <div style={{
        marginTop: '40px',
        padding: '20px',
        backgroundColor: 'white',
        color: 'black',
        borderRadius: '10px'
      }}>
        <h2>SUCCESS!</h2>
        <p>Wenn du das siehst, funktioniert ALLES!</p>
      </div>
    </div>
  );
}