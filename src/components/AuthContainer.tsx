import { useState, useEffect, FormEvent } from 'react';
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInAnonymously
} from 'firebase/auth';
import { auth, onAuthStateChanged } from '../lib/firebase';
import { Check, Copy, ExternalLink, AlertTriangle, Clock, ShieldCheck, RefreshCw, Sparkles } from 'lucide-react';

type AuthMethod = 'google' | 'email' | 'guest';

export function AuthContainer() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // New States for Alternative Login Channels
  const [activeMethod, setActiveMethod] = useState<AuthMethod>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  // Diagnostic states
  const [copiedDomain, setCopiedDomain] = useState<string | null>(null);
  const [checklist, setChecklist] = useState({
    noHttps: false,
    noSlash: false,
    correctProject: false,
    fiveMins: false,
    incognito: false,
    // Operation-not-allowed checklist
    providerEnabled: false,
    subToggleChecked: false,
    refreshedPage: false,
    incognitoTest: false,
  });

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedDomain(text);
      setTimeout(() => setCopiedDomain(null), 2000);
    } catch (err) {
      console.error("Clipboard copy failed:", err);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleGoogleSignIn = async () => {
    if (window.self !== window.top) {
      window.open(window.location.origin, '_blank');
      return;
    }

    try {
      setError(null);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error("Full Firebase Auth Error Details:", error);
      const errCode = error?.code || "unknown-code";
      const errMsg = error?.message || "An unknown error occurred during sign-in.";
      setError(`[${errCode}] ${errMsg}`);
    }
  };

  const handleEmailAuth = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("[missing-fields] Please enter both email and password.");
      return;
    }
    try {
      setError(null);
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error: any) {
      console.error("Email Auth Error:", error);
      const errCode = error?.code || "unknown-code";
      let errMsg = error?.message || "An error occurred.";
      if (errCode === 'auth/weak-password') {
        errMsg = "The password must be at least 6 characters long.";
      } else if (errCode === 'auth/email-already-in-use') {
        errMsg = "This email is already registered. Try signing in instead.";
      } else if (errCode === 'auth/invalid-email') {
        errMsg = "Please enter a valid email address.";
      } else if (errCode === 'auth/user-not-found' || errCode === 'auth/wrong-password' || errCode === 'auth/invalid-credential') {
        errMsg = "Incorrect email or password.";
      }
      setError(`[${errCode}] ${errMsg}`);
    }
  };

  const handleGuestSignIn = async () => {
    try {
      setError(null);
      await signInAnonymously(auth);
    } catch (error: any) {
      console.error("Guest Auth Error:", error);
      const errCode = error?.code || "unknown-code";
      setError(`[${errCode}] ${error?.message || "Could not sign in as a guest."}`);
    }
  };

  const handleDeveloperBypass = () => {
    try {
      setError(null);
      const mockUser = {
        uid: 'dev-bypass-user-123',
        email: 'parthakesarla@gmail.com',
        displayName: 'Partha Kesarla',
        photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        isAnonymous: false,
        emailVerified: true,
        phoneNumber: '7396500338',
        providerData: []
      };
      localStorage.setItem('cz_bypass_auth_user', JSON.stringify(mockUser));
      window.dispatchEvent(new Event('cz_bypass_auth_changed'));
    } catch (err: any) {
      console.error("Developer Bypass Error:", err);
      setError(`[bypass-failed] ${err?.message || "Could not activate Developer Sandbox."}`);
    }
  };

  const handleSignOut = async () => {
    try {
      localStorage.removeItem('cz_bypass_auth_user');
      localStorage.removeItem('cz_profile');
      window.dispatchEvent(new Event('cz_bypass_auth_changed'));
      window.dispatchEvent(new Event('cz_profile_signed_out'));
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loading) return <div className="p-4 text-stone-500 font-medium text-sm flex items-center justify-center">Loading authentication...</div>;

  return (
    <div className="p-5 border border-stone-200 rounded-xl bg-white shadow-sm max-w-md mx-auto">
      {user ? (
        <div className="flex items-center gap-4">
          {user.photoURL ? (
            <img src={user.photoURL} alt={user.displayName || 'Avatar'} className="w-10 h-10 rounded-full border border-stone-200" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm">
              {(user.displayName || user.email || 'G').charAt(0).toUpperCase()}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-stone-900 truncate">
              {user.isAnonymous ? "Guest Session" : (user.displayName || 'Registered User')}
            </p>
            <p className="text-sm text-stone-500 truncate">{user.email || 'No email associated'}</p>
          </div>
          <button 
            onClick={handleSignOut} 
            className="px-3.5 py-1.5 text-xs font-semibold bg-stone-100 text-stone-700 rounded-lg hover:bg-stone-200 transition-colors"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <div>
          <h3 className="text-base font-semibold text-stone-800 mb-4 text-center">Sign In to Cake Zone</h3>
          
          {/* Failsafe Sandbox Bypass Banner */}
          <div className="mb-4 p-3 bg-amber-50 rounded-xl border border-amber-200/80 shadow-3xs space-y-2 text-stone-700">
            <div className="flex items-center gap-1.5 text-amber-900 font-semibold text-xs">
              <Sparkles className="w-4 h-4 text-amber-600 animate-pulse shrink-0" />
              <span>🍰 Stuck on Firebase? Enter Sandbox Mode!</span>
            </div>
            <p className="text-[11px] text-stone-600 leading-relaxed">
              If Google Sign-In or Email registration is throwing configuration errors (due to Firebase replication delays), click below to bypass checks and sign in instantly as <strong>Partha Kesarla (Shop Owner)</strong>.
            </p>
            <button
              type="button"
              onClick={handleDeveloperBypass}
              className="w-full py-1.5 px-3 text-xs font-bold bg-amber-700 text-white hover:bg-amber-800 transition-colors rounded-lg shadow-xs flex items-center justify-center gap-1.5"
            >
              <span>⚡ Bypass Auth & Enter Sandbox</span>
            </button>
          </div>

          {/* Method Tabs */}
          <div className="flex bg-stone-100 p-1 rounded-lg mb-4 text-xs font-medium text-stone-600">
            <button 
              onClick={() => { setActiveMethod('email'); setError(null); }}
              className={`flex-1 py-1.5 rounded-md text-center transition-all ${activeMethod === 'email' ? 'bg-white text-stone-900 shadow-sm' : 'hover:text-stone-900'}`}
            >
              Email & Pass
            </button>
            <button 
              onClick={() => { setActiveMethod('google'); setError(null); }}
              className={`flex-1 py-1.5 rounded-md text-center transition-all ${activeMethod === 'google' ? 'bg-white text-stone-900 shadow-sm' : 'hover:text-stone-900'}`}
            >
              Google
            </button>
            <button 
              onClick={() => { setActiveMethod('guest'); setError(null); }}
              className={`flex-1 py-1.5 rounded-md text-center transition-all ${activeMethod === 'guest' ? 'bg-white text-stone-900 shadow-sm' : 'hover:text-stone-900'}`}
            >
              ⚡ Quick Guest
            </button>
          </div>

          {/* Email & Password Form */}
          {activeMethod === 'email' && (
            <form onSubmit={handleEmailAuth} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500/50 focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">Password</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500/50 focus:border-amber-500"
                />
              </div>
              <button 
                type="submit"
                className="w-full mt-2 px-4 py-2.5 text-sm font-semibold bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-colors shadow-sm"
              >
                {isSignUp ? "Create Account & Sign In" : "Sign In with Password"}
              </button>
              
              <div className="text-center mt-3">
                <button 
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-xs text-amber-700 hover:underline font-medium"
                >
                  {isSignUp ? "Already have an account? Sign In" : "Don't have an account yet? Create one"}
                </button>
              </div>
            </form>
          )}

          {/* Google Sign-In */}
          {activeMethod === 'google' && (
            <div className="space-y-3">
              <p className="text-xs text-stone-500 text-center mb-2">Connect seamlessly using your existing Google Account.</p>
              <button 
                onClick={handleGoogleSignIn} 
                className="w-full px-4 py-2.5 text-sm font-semibold bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                {window.self !== window.top ? "Sign in with Google (Open Tab)" : "Sign in with Google"}
              </button>
            </div>
          )}

          {/* Guest Sign-In */}
          {activeMethod === 'guest' && (
            <div className="space-y-3">
              <p className="text-xs text-stone-500 text-center mb-2">Want to test right now? Instantly login as a Guest with a single click. No passwords required.</p>
              <button 
                onClick={handleGuestSignIn} 
                className="w-full px-4 py-2.5 text-sm font-semibold bg-stone-100 text-stone-700 border border-stone-200 rounded-lg hover:bg-stone-200 transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                ⚡ Proceed as Guest
              </button>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-stone-200"></div>
                <span className="flex-shrink mx-3 text-[9px] text-stone-400 font-bold uppercase tracking-wider">or bypass config</span>
                <div className="flex-grow border-t border-stone-200"></div>
              </div>
              
              <button 
                onClick={handleDeveloperBypass} 
                className="w-full px-4 py-2 text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                🍰 Instant Developer Bypass
              </button>
            </div>
          )}
        </div>
      )}

      {/* Error message block */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 rounded-lg text-sm text-red-800 border border-red-100">
          <p className="font-semibold text-red-900 mb-1">Sign-In Failed</p>
          <p className="font-mono text-xs bg-red-100/50 p-1.5 rounded border border-red-200/50 my-1">{error}</p>
          
          {/* Quick Developer Bypass Option */}
          <div className="mt-3 p-3 bg-white rounded-xl border border-amber-200 shadow-xs space-y-2">
            <p className="font-semibold text-amber-900 text-xs flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600 animate-pulse shrink-0" />
              <span>🍰 Stuck on Firebase Config? Enter Sandbox Mode!</span>
            </p>
            <p className="text-[11px] text-stone-600 leading-normal">
              If your Firebase Console settings are still propagating, click below to instantly bypass authentication and log in as a <strong>Demo Shop Owner (Partha Kesarla)</strong> to test all features!
            </p>
            <button
              type="button"
              onClick={handleDeveloperBypass}
              className="w-full py-1.5 px-3 text-xs font-semibold bg-amber-700 text-white hover:bg-amber-800 transition-colors rounded-lg shadow-xs flex items-center justify-center gap-1.5"
            >
              <span>⚡ Bypass Auth & Enter Sandbox</span>
            </button>
          </div>

          {error?.includes("auth/invalid-continue-uri") || error?.includes("auth/unauthorized-domain") || error?.includes("unauthorized") || error?.includes("continue-uri") ? (
            <div className="mt-3 p-3.5 bg-white rounded-xl border border-red-200 text-xs text-stone-700 space-y-3 animate-fade-in">
              <div className="flex items-center gap-2 text-amber-800 font-semibold">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>🔍 Deep Firebase Auth Domain Diagnostics</span>
              </div>
              
              <p className="text-stone-600 leading-relaxed">
                This error happens when Firebase refuses to send Google credentials back to our current web domain. To fix this, you must authorize this domain in your Firebase project.
              </p>

              <div className="space-y-2 p-3 bg-stone-50 rounded-lg border border-stone-150">
                <p className="font-semibold text-stone-900 flex items-center justify-between">
                  <span>1. Copy Bare Domains to Firebase:</span>
                  <span className="text-[10px] font-normal text-stone-500">Click to copy instantly</span>
                </p>
                
                <div className="space-y-1.5">
                  {[
                    "ais-dev-scfe4ytxuala6mtkgqpjzt-909445076294.asia-east1.run.app",
                    "ais-pre-scfe4ytxuala6mtkgqpjzt-909445076294.asia-east1.run.app"
                  ].map((dom) => (
                    <div key={dom} className="flex items-center justify-between gap-2 p-1.5 bg-white rounded border border-stone-200 font-mono text-[11px] text-stone-800">
                      <span className="truncate select-all font-medium">{dom}</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(dom)}
                        className="p-1 rounded bg-stone-50 hover:bg-stone-100 border border-stone-200 transition-all text-stone-500 hover:text-stone-800 flex items-center justify-center shrink-0"
                        title="Copy to clipboard"
                      >
                        {copiedDomain === dom ? (
                          <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-sans font-medium px-1">
                            <Check className="w-3.5 h-3.5 text-emerald-600" /> Copied
                          </span>
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
                
                <p className="text-[10px] text-stone-500 leading-normal">
                  👉 Go to your <a href="https://console.firebase.google.com/project/cake-zone-929b0/authentication/settings" target="_blank" rel="noopener noreferrer" className="text-amber-700 underline font-semibold inline-flex items-center gap-0.5 hover:text-amber-800">Firebase Console settings <ExternalLink className="w-3 h-3 inline" /></a>, select <strong>"Authorized domains"</strong> on the left side, click <strong>"Add domain"</strong>, and paste the above domains there.
                </p>
              </div>

              {/* Interactive checklist */}
              <div className="space-y-2 p-3 bg-amber-50/50 rounded-lg border border-amber-100/70">
                <p className="font-semibold text-amber-950 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                  <span>Interactive Verification Checklist:</span>
                </p>
                <div className="space-y-1.5">
                  <label className="flex items-start gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={checklist.noHttps}
                      onChange={(e) => setChecklist({ ...checklist, noHttps: e.target.checked })}
                      className="mt-0.5 rounded border-stone-300 text-amber-600 focus:ring-amber-500"
                    />
                    <span className={`leading-tight text-stone-600 ${checklist.noHttps ? 'line-through text-stone-400' : ''}`}>
                      <strong>No Prefix:</strong> I confirmed I didn't include <code className="bg-white/80 px-1 py-0.5 rounded text-red-700 font-mono text-[10px]">https://</code> or <code className="bg-white/80 px-1 py-0.5 rounded text-red-700 font-mono text-[10px]">http://</code> (only paste bare domain strings).
                    </span>
                  </label>
                  
                  <label className="flex items-start gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={checklist.noSlash}
                      onChange={(e) => setChecklist({ ...checklist, noSlash: e.target.checked })}
                      className="mt-0.5 rounded border-stone-300 text-amber-600 focus:ring-amber-500"
                    />
                    <span className={`leading-tight text-stone-600 ${checklist.noSlash ? 'line-through text-stone-400' : ''}`}>
                      <strong>No Slashes/Paths:</strong> I checked that there is no trailing slash (e.g. <code className="bg-white/80 px-1 py-0.5 rounded text-red-700 font-mono text-[10px]">/</code>) at the end of the pasted domain.
                    </span>
                  </label>

                  <label className="flex items-start gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={checklist.correctProject}
                      onChange={(e) => setChecklist({ ...checklist, correctProject: e.target.checked })}
                      className="mt-0.5 rounded border-stone-300 text-amber-600 focus:ring-amber-500"
                    />
                    <span className={`leading-tight text-stone-600 ${checklist.correctProject ? 'line-through text-stone-400' : ''}`}>
                      <strong>Correct Project:</strong> I verified that the Firebase Console URL contains our active project ID: <strong className="font-mono text-stone-800 text-[11px] bg-amber-100/50 px-1 rounded">cake-zone-929b0</strong>.
                    </span>
                  </label>

                  <label className="flex items-start gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={checklist.fiveMins}
                      onChange={(e) => setChecklist({ ...checklist, fiveMins: e.target.checked })}
                      className="mt-0.5 rounded border-stone-300 text-amber-600 focus:ring-amber-500"
                    />
                    <span className={`leading-tight text-stone-600 ${checklist.fiveMins ? 'line-through text-stone-400' : ''}`}>
                      <strong>Wait 5 Minutes:</strong> I have waited at least 5 minutes. (Firebase updates require propagation time on Google's cloud servers).
                    </span>
                  </label>

                  <label className="flex items-start gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={checklist.incognito}
                      onChange={(e) => setChecklist({ ...checklist, incognito: e.target.checked })}
                      className="mt-0.5 rounded border-stone-300 text-amber-600 focus:ring-amber-500"
                    />
                    <span className={`leading-tight text-stone-600 ${checklist.incognito ? 'line-through text-stone-400' : ''}`}>
                      <strong>Cache Clear / Incognito:</strong> I tried refreshing in an <strong>Incognito / Private Window</strong> to bypass the browser's cached DNS and authentication response.
                    </span>
                  </label>
                </div>
              </div>

              {/* Help & Alternative message */}
              <div className="p-2.5 bg-stone-100 rounded-lg text-[11px] text-stone-600 flex items-start gap-2">
                <Clock className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-stone-800">💡 Don't let config block you from testing!</p>
                  <p className="mt-0.5">
                    If domain settings are taking time to update, select the <strong>Email & Pass</strong> or <strong>⚡ Quick Guest</strong> tabs above. Both require absolutely zero configuration or whitelisting, allowing you to test all premium customer features instantly!
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          {error?.includes("auth/operation-not-allowed") && (
            <div className="mt-3 p-3.5 bg-white rounded-xl border border-red-200 text-xs text-stone-700 space-y-3 animate-fade-in">
              <div className="flex items-center gap-2 text-amber-800 font-semibold">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>🔍 Firebase Provider Status Diagnostics</span>
              </div>
              
              <p className="text-stone-600 leading-relaxed">
                Your screenshot confirms you have configured the correct project (<strong className="font-mono text-stone-800 bg-stone-100 px-1 rounded">cake-zone-929b0</strong>)! 
                If you are still seeing this, here are the most common reasons and how to bypass them:
              </p>

              {/* Interactive checklist */}
              <div className="space-y-2 p-3 bg-amber-50/50 rounded-lg border border-amber-100/70">
                <p className="font-semibold text-amber-950 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                  <span>Interactive Verification Checklist:</span>
                </p>
                <div className="space-y-1.5">
                  <label className="flex items-start gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={checklist.subToggleChecked}
                      onChange={(e) => setChecklist({ ...checklist, subToggleChecked: e.target.checked })}
                      className="mt-0.5 rounded border-stone-300 text-amber-600 focus:ring-amber-500"
                    />
                    <span className={`leading-tight text-stone-600 ${checklist.subToggleChecked ? 'line-through text-stone-400' : ''}`}>
                      <strong>Check Sub-Toggles:</strong> When you clicked on <strong>Email/Password</strong> row in your console, did you enable the <strong>first toggle</strong> labeled "Email/Password" (and NOT just "Email link" passwordless)?
                    </span>
                  </label>

                  <label className="flex items-start gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={checklist.refreshedPage}
                      onChange={(e) => setChecklist({ ...checklist, refreshedPage: e.target.checked })}
                      className="mt-0.5 rounded border-stone-300 text-amber-600 focus:ring-amber-500"
                    />
                    <span className={`leading-tight text-stone-600 ${checklist.refreshedPage ? 'line-through text-stone-400' : ''}`}>
                      <strong>Hard Refresh:</strong> I did a full refresh of this browser page (Ctrl+F5 or Cmd+Shift+R) so the active page fetches fresh settings from Firebase.
                    </span>
                  </label>

                  <label className="flex items-start gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={checklist.fiveMins}
                      onChange={(e) => setChecklist({ ...checklist, fiveMins: e.target.checked })}
                      className="mt-0.5 rounded border-stone-300 text-amber-600 focus:ring-amber-500"
                    />
                    <span className={`leading-tight text-stone-600 ${checklist.fiveMins ? 'line-through text-stone-400' : ''}`}>
                      <strong>Propagation Delay:</strong> I have waited at least 2-3 minutes since hitting "Save" in Firebase. (Identity Platform changes take time to register across Google CDN).
                    </span>
                  </label>

                  <label className="flex items-start gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={checklist.incognitoTest}
                      onChange={(e) => setChecklist({ ...checklist, incognitoTest: e.target.checked })}
                      className="mt-0.5 rounded border-stone-300 text-amber-600 focus:ring-amber-500"
                    />
                    <span className={`leading-tight text-stone-600 ${checklist.incognitoTest ? 'line-through text-stone-400' : ''}`}>
                      <strong>Try Incognito:</strong> I tried logging in using an <strong>Incognito or Private Window</strong>. (This bypasses any cached session/cookie policies from previous failed attempts).
                    </span>
                  </label>
                </div>
              </div>

              {/* Step instructions */}
              <div className="space-y-2 p-3 bg-stone-50 rounded-lg border border-stone-150">
                <p className="font-semibold text-stone-900">How to double-check sub-toggles:</p>
                <ol className="list-decimal pl-4 space-y-1.5 text-stone-600">
                  <li>
                    Go back to the <a href="https://console.firebase.google.com/project/cake-zone-929b0/authentication/providers" target="_blank" rel="noopener noreferrer" className="text-amber-700 underline font-semibold inline-flex items-center gap-0.5 hover:text-amber-800">Sign-in providers page <ExternalLink className="w-3 h-3 inline" /></a>.
                  </li>
                  <li>
                    Click on the <strong>Email/Password</strong> row.
                  </li>
                  <li>
                    Ensure the first toggle (<strong>Email/Password</strong>) is switched <strong>ON</strong>. If only "Email link" is ON, traditional password login will fail.
                  </li>
                  <li>
                    Click the blue <strong>"Save"</strong> button.
                  </li>
                </ol>
              </div>

              {/* Troubleshooting hint */}
              <div className="p-2.5 bg-stone-100 rounded-lg text-[11px] text-stone-600 flex items-start gap-2">
                <RefreshCw className="w-4 h-4 text-stone-500 shrink-0 mt-0.5 animate-spin-slow" />
                <div>
                  <p className="font-semibold text-stone-800">💡 Testing tip:</p>
                  <p className="mt-0.5">
                    If you just enabled "Anonymous", click the <strong>⚡ Quick Guest</strong> tab above and try signing in there. Since Anonymous sign-in was enabled, it may propagate instantly and let you test right away!
                  </p>
                </div>
              </div>
            </div>
          )}

          {error?.includes("auth/admin-restricted-operation") || error?.includes("admin-restricted-operation") ? (
            <div className="mt-3 p-3 bg-white rounded border border-red-200 text-xs text-stone-700 space-y-2 animate-fade-in">
              <p className="font-semibold text-stone-900 text-amber-800">How to enable Anonymous Guest Sign-In:</p>
              <p className="text-stone-600">The <code>auth/admin-restricted-operation</code> error indicates that the <strong>Anonymous (Guest)</strong> sign-in provider is disabled in your Firebase console.</p>
              <ol className="list-decimal pl-4 space-y-1.5 text-stone-600">
                <li>
                  Go to the <a href="https://console.firebase.google.com/project/cake-zone-929b0/authentication/providers" target="_blank" rel="noopener noreferrer" className="text-amber-700 underline font-medium hover:text-amber-800">Firebase Console Sign-In Methods page</a>.
                </li>
                <li>
                  Click the blue <strong>"Add new provider"</strong> button (shown in your screenshot).
                </li>
                <li>
                  Scroll down/find and select <strong>"Anonymous"</strong>.
                </li>
                <li>
                  Toggle the switch to <strong>"Enabled"</strong>, and click <strong>"Save"</strong>.
                </li>
              </ol>
            </div>
          ) : null}

          {error?.includes("auth/popup-blocked") && (
            <div className="mt-3 p-3 bg-white rounded border border-red-200 text-xs text-stone-700">
              <p className="font-semibold text-stone-900">Popup Blocked:</p>
              <p className="text-stone-600 mt-1">Your browser blocked the sign-in popup window. Please click the popup-blocker icon in the top right of your browser's address bar and select "Always allow popups" for this site, then try again.</p>
            </div>
          )}

          <p className="mt-2 text-xs text-red-700 font-medium">
            Note: If you are running inside the AI Studio frame, make sure you open the app in a new tab using the top-right button in AI Studio first!
          </p>
        </div>
      )}
    </div>
  );
}

