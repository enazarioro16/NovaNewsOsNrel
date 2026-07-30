import { auth } from '../../auth';
import { redirect } from 'next/navigation';
import { savePreferences } from '../actions/user.actions';

const AVAILABLE_TAGS = ['Technology', 'AI', 'Business', 'Startups', 'Science', 'Programming'];

export default async function OnboardingPage() {
  const session = await auth();
  if (!session) redirect('/login');

  return (
    <div style={{ padding: '3rem', fontFamily: 'system-ui', maxWidth: '600px', margin: '0 auto' }}>
      <h1>¡Bienvenido a NovaNews!</h1>
      <p>Para personalizar tu feed inteligente, por favor selecciona los temas que más te interesan:</p>
      
      <form action={savePreferences} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {AVAILABLE_TAGS.map(tag => (
            <label key={tag} style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer', display: 'flex', gap: '0.5rem', background: '#f9f9f9' }}>
              <input type="checkbox" name="tags" value={tag.toLowerCase()} />
              <strong>{tag}</strong>
            </label>
          ))}
        </div>
        
        <button type="submit" style={{ padding: '1rem', background: '#000', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', marginTop: '1rem' }}>
          Configurar mi Feed B2C
        </button>
      </form>
    </div>
  );
}
