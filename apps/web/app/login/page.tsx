import { signIn } from "../../auth";
import { redirect } from "next/navigation";
import { auth } from "../../auth";

export default async function LoginPage() {
  const session = await auth();
  if (session) {
    redirect("/editor"); // Redirect to Dashboard if already logged in
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: 'system-ui' }}>
      <h1>Acceso a NovaNews OS</h1>
      <p>Identity Core Auth.js / B2C</p>
      
      <div style={{ border: '1px solid #ddd', padding: '2rem', borderRadius: '8px', background: '#f9f9f9', minWidth: '300px' }}>
        <form
          action={async (formData) => {
            "use server"
            await signIn("credentials", formData)
          }}
          style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
          <div>
            <label style={{ display: 'block', fontWeight: 'bold' }}>Email:</label>
            <input name="email" type="email" defaultValue="admin@novanews.ai" style={{ width: '100%', padding: '0.5rem' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 'bold' }}>Password:</label>
            <input name="password" type="password" defaultValue="admin" style={{ width: '100%', padding: '0.5rem' }} />
          </div>
          <button type="submit" style={{ padding: '0.75rem', background: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            Ingresar
          </button>
        </form>
        
        <hr style={{ margin: '2rem 0' }} />
        
        <form
          action={async () => {
            "use server"
            await signIn("github")
          }}
        >
          <button type="submit" style={{ width: '100%', padding: '0.75rem', background: '#24292e', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            Ingresar con GitHub
          </button>
        </form>
      </div>
    </div>
  );
}
