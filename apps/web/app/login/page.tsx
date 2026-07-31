import { signIn } from "../../auth";
import { redirect } from "next/navigation";
import { auth } from "../../auth";

export default async function LoginPage() {
  const session = await auth();
  if (session) {
    redirect("/editor"); // Redirect to Dashboard if already logged in
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f111a] font-mono p-4">
      <div className="bg-[#1a1b26] border border-[#292e42] p-10 rounded-xl shadow-[0_0_30px_rgba(41,46,66,0.5)] w-full max-w-md relative overflow-hidden">
        
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#bb9af7] via-[#7dcfff] to-[#9ece6a]"></div>
        
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-white tracking-tight uppercase mb-2">
            NOVA_NEWS <span className="text-[#7dcfff]">//</span> AUTH
          </h1>
          <p className="text-sm text-[#565f89] uppercase tracking-widest font-bold">Identity Core / B2C</p>
        </div>
        
        <form
          action={async (formData) => {
            "use server"
            await signIn("credentials", formData)
          }}
          className="flex flex-col gap-6"
        >
          <div>
            <label className="block text-xs font-bold text-[#bb9af7] uppercase tracking-wider mb-2">Editor Email</label>
            <input 
              name="email" 
              type="email" 
              defaultValue="admin@novanews.ai" 
              className="w-full bg-[#0f111a] border border-[#292e42] rounded px-4 py-3 text-[#c0caf5] focus:outline-none focus:border-[#bb9af7] transition-colors font-sans" 
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-[#bb9af7] uppercase tracking-wider mb-2">Access Token</label>
            <input 
              name="password" 
              type="password" 
              defaultValue="admin" 
              className="w-full bg-[#0f111a] border border-[#292e42] rounded px-4 py-3 text-[#c0caf5] focus:outline-none focus:border-[#bb9af7] transition-colors font-sans" 
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-[#1f2335] border border-[#3b4261] hover:bg-[#bb9af7]/20 hover:border-[#bb9af7] text-[#bb9af7] font-bold py-3 rounded transition-all duration-300 uppercase tracking-widest mt-2 shadow-[0_0_10px_rgba(187,154,247,0.1)] hover:shadow-[0_0_15px_rgba(187,154,247,0.3)]"
          >
            Authenticate_Editor
          </button>
        </form>
        
        <div className="flex items-center my-8">
          <div className="flex-grow h-px bg-[#292e42]"></div>
          <span className="px-4 text-xs font-bold text-[#565f89] uppercase tracking-widest">Public Access</span>
          <div className="flex-grow h-px bg-[#292e42]"></div>
        </div>
        
        <form
          action={async () => {
            "use server"
            await signIn("github")
          }}
        >
          <button 
            type="submit" 
            className="w-full bg-[#7dcfff] hover:bg-[#2ac3de] text-[#1a1b26] font-bold py-3 rounded transition-all duration-300 uppercase tracking-widest flex items-center justify-center gap-3 shadow-[0_0_15px_rgba(125,207,255,0.2)] hover:shadow-[0_0_20px_rgba(125,207,255,0.4)]"
          >
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="opacity-80"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
            Initialize_OAuth // GitHub
          </button>
        </form>
      </div>
    </div>
  );
}
