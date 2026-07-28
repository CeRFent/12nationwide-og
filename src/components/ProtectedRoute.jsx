import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAdminPin } from '../utils/quoteStorage';

const SESSION_AUTH_KEY = '12NW_ADMIN_AUTHENTICATED';
const LOCKOUT_KEY = '12NW_ADMIN_LOCKOUT_TIME';
const FAILED_ATTEMPTS_KEY = '12NW_ADMIN_FAILED_ATTEMPTS';

export default function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLockedOut, setIsLockedOut] = useState(false);
  const [lockoutTimer, setLockoutTimer] = useState(0);

  // Check existing session & lockout status on mount
  useEffect(() => {
    const sessionAuth = sessionStorage.getItem(SESSION_AUTH_KEY);
    if (sessionAuth === 'true') {
      setIsAuthenticated(true);
    }

    checkLockout();
  }, []);

  // Countdown timer for lockout
  useEffect(() => {
    let interval = null;
    if (isLockedOut && lockoutTimer > 0) {
      interval = setInterval(() => {
        setLockoutTimer((prev) => {
          if (prev <= 1) {
            setIsLockedOut(false);
            localStorage.removeItem(LOCKOUT_KEY);
            localStorage.setItem(FAILED_ATTEMPTS_KEY, '0');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isLockedOut, lockoutTimer]);

  const checkLockout = () => {
    const lockTime = localStorage.getItem(LOCKOUT_KEY);
    if (lockTime) {
      const remainingSeconds = Math.ceil((parseInt(lockTime, 10) - Date.now()) / 1000);
      if (remainingSeconds > 0) {
        setIsLockedOut(true);
        setLockoutTimer(remainingSeconds);
      } else {
        localStorage.removeItem(LOCKOUT_KEY);
        localStorage.setItem(FAILED_ATTEMPTS_KEY, '0');
      }
    }
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (isLockedOut) return;

    const currentPin = getAdminPin(); // Default '212789' or user updated
    if (pinInput.trim() === currentPin) {
      sessionStorage.setItem(SESSION_AUTH_KEY, 'true');
      localStorage.setItem(FAILED_ATTEMPTS_KEY, '0');
      setIsAuthenticated(true);
      setErrorMsg('');
      setPinInput('');
    } else {
      const attempts = (parseInt(localStorage.getItem(FAILED_ATTEMPTS_KEY) || '0', 10)) + 1;
      localStorage.setItem(FAILED_ATTEMPTS_KEY, attempts.toString());

      if (attempts >= 5) {
        const lockoutUntil = Date.now() + 15 * 60 * 1000; // 15 min lock
        localStorage.setItem(LOCKOUT_KEY, lockoutUntil.toString());
        setIsLockedOut(true);
        setLockoutTimer(15 * 60);
        setErrorMsg('Too many failed attempts. Access locked for 15 minutes.');
      } else {
        setErrorMsg(`Incorrect Admin PIN. ${5 - attempts} attempts remaining.`);
      }
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_AUTH_KEY);
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center p-6 pt-[120px]">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-brand-card border border-brand-border p-8 rounded-xl shadow-2xl relative overflow-hidden"
        >
          {/* Subtle Accent Top Bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-brand-accent" />

          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-brand-accent/10 border border-brand-accent/30 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-accent">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="font-display font-black text-2xl uppercase tracking-wider text-white">
              Logistics <span className="text-brand-accent">Security Gate</span>
            </h1>
            <p className="text-white/50 text-xs mt-2 uppercase tracking-widest font-display font-medium">
              Authorized Staff Only
            </p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded text-red-400 text-xs font-mono text-center">
              {errorMsg}
            </div>
          )}

          {isLockedOut ? (
            <div className="text-center p-6 bg-white/5 border border-white/10 rounded-lg">
              <p className="text-yellow-400 font-display text-sm uppercase font-bold tracking-wider mb-2">
                🔒 Gate Temporarily Locked
              </p>
              <p className="text-white/60 text-xs mb-4">
                Too many invalid security PIN attempts. Try again in:
              </p>
              <div className="text-3xl font-mono font-bold text-white tracking-widest">
                {Math.floor(lockoutTimer / 60)}:{(lockoutTimer % 60).toString().padStart(2, '0')}
              </div>
            </div>
          ) : (
            <form onSubmit={handleLoginSubmit} className="space-y-6">
              <div>
                <label className="block text-white/60 text-xs uppercase font-display font-bold mb-2">
                  Enter Admin Passcode / PIN
                </label>
                <input
                  type="password"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="••••••"
                  maxLength={12}
                  autoFocus
                  className="w-full bg-white/5 border border-brand-border px-4 py-3 rounded text-white font-mono text-center text-xl tracking-[8px] focus:outline-none focus:border-brand-accent transition-colors"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-brand-accent text-brand-bg font-display font-bold py-3 uppercase tracking-wider text-sm hover:brightness-110 active:scale-[0.99] transition-all rounded shadow-lg"
              >
                Authenticate & Unlock
              </button>
            </form>
          )}

          <div className="mt-8 text-center border-t border-white/5 pt-4">
            <span className="text-[10px] text-white/30 font-mono tracking-widest uppercase">
              12 Nationwide Logistics Command • Protected System
            </span>
          </div>
        </motion.div>
      </div>
    );
  }

  // When authenticated, render children with Logout capabilities
  return (
    <div>
      <div className="bg-brand-card/90 backdrop-blur border-b border-brand-border px-6 py-2 flex justify-between items-center fixed top-[72px] left-0 right-0 z-40">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-white/70 text-xs font-mono uppercase tracking-wider">
            Admin Authenticated (PIN Active)
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="text-xs text-red-400 hover:text-red-300 font-display font-bold uppercase tracking-wider border border-red-500/30 bg-red-500/10 px-3 py-1 rounded transition-colors"
        >
          🔒 Lock & Logout
        </button>
      </div>

      <div className="pt-10">
        {children}
      </div>
    </div>
  );
}
