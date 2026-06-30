import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Shield, Check, AlertCircle, Eye, EyeOff, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

interface ResetPasswordViewProps {
  onNavigateToLogin: () => void;
}

export const ResetPasswordView: React.FC<ResetPasswordViewProps> = ({ onNavigateToLogin }) => {
  const [searchParams] = useSearchParams();
  const fallbackEmail = searchParams.get('email') || '';
  const token = searchParams.get('token') || '';

  const [supabaseUser, setSupabaseUser] = useState<any>(null);
  const [checkingSession, setCheckingSession] = useState(isSupabaseConfigured);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check Supabase session on mount and listen to changes for resilient recovery session capturing
  useEffect(() => {
    if (!isSupabaseConfigured) {
      setCheckingSession(false);
      return;
    }

    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setSupabaseUser(session.user);
        }
      } catch (err) {
        console.error("Error checking Supabase reset session:", err);
      } finally {
        setCheckingSession(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setSupabaseUser(session.user);
      } else {
        setSupabaseUser(null);
      }
      setCheckingSession(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const email = supabaseUser?.email || fallbackEmail;
  const isLinkInvalid = isSupabaseConfigured 
    ? (!supabaseUser && (!fallbackEmail || !token)) 
    : (!fallbackEmail || !token);

  // Password strength checks
  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password);

  const getStrengthPercent = () => {
    let score = 0;
    if (password.length > 0) score += 20;
    if (password.length >= 8) score += 20;
    if (hasUpperCase) score += 20;
    if (hasNumber) score += 20;
    if (hasSpecialChar || hasLowerCase) score += 20;
    return score;
  };

  const getStrengthLabel = () => {
    const percent = getStrengthPercent();
    if (percent === 0) return { label: 'Empty', color: 'bg-slate-200 text-slate-500' };
    if (percent <= 40) return { label: 'Weak', color: 'bg-red-500 text-red-500' };
    if (percent <= 80) return { label: 'Moderate', color: 'bg-amber-500 text-amber-500' };
    return { label: 'Strong & Secure', color: 'bg-emerald-500 text-emerald-500' };
  };

  const isPasswordValid = hasMinLength && hasUpperCase && hasNumber && (hasSpecialChar || hasLowerCase);

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isLinkInvalid) {
      setError("This security reset link appears to be invalid or incomplete. Please request a new link.");
      return;
    }

    if (!isPasswordValid) {
      setError("Please ensure your new password satisfies all strength criteria listed below.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please re-type your matching passwords.");
      return;
    }

    setLoading(true);

    try {
      if (isSupabaseConfigured && supabaseUser) {
        // Production Supabase flow
        const { error: updateError } = await supabase.auth.updateUser({
          password: password
        });

        if (updateError) throw updateError;

        // Sign out to clear the recovery session so they must log in with the new password
        await supabase.auth.signOut();
        setSuccess(true);
      } else {
        // Fallback local mock flow
        const response = await fetch('/api/auth/reset-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, token, newPassword: password })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Password reset failed. The reset token might have expired.');
        }

        setSuccess(true);
      }
    } catch (err: any) {
      console.error("Reset password error:", err);
      setError(err.message || 'An error occurred during password update. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white rounded-2xl shadow-xl border border-slate-100 p-8 text-center space-y-4">
        <Loader2 className="w-8 h-8 text-[#0066FF] animate-spin mx-auto" />
        <p className="text-sm text-slate-500 font-bold">Verifying your security credentials...</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="bg-[#0066FF] h-2 w-full" />
        <div className="p-8 text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center border border-emerald-100">
            <Check className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Password Reset Complete</h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              Your security password has been updated. You can now log into the BANTConfirm platform with your new credentials.
            </p>
          </div>
          <button
            onClick={onNavigateToLogin}
            className="w-full bg-[#0066FF] hover:bg-blue-700 text-white font-extrabold py-3 rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            Access Sourcing Desk <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto my-12 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
      <div className="bg-[#0066FF] text-white px-8 py-6 text-center relative border-b border-slate-100">
        <div className="mx-auto w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-3">
          <Shield className="w-6 h-6 text-[#FFC107]" />
        </div>
        <h2 className="text-xl font-black tracking-tight">Establish New Password</h2>
        <p className="text-xs text-white/80 mt-1">Configure secure credentials for {email || 'your account'}</p>
      </div>

      <div className="p-8 space-y-6">
        {isLinkInvalid ? (
          <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex gap-3 text-red-700 text-xs leading-relaxed">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500" />
            <div>
              <p className="font-bold">Invalid Security Link</p>
              <p className="mt-1">This reset page requires an active verification session or a valid reset token. Please request a new "Forgot Password" link from the Login screen.</p>
            </div>
          </div>
        ) : null}

        {error && (
          <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex gap-3 text-red-700 text-xs leading-relaxed animate-shake">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500" />
            <div>
              <p className="font-bold">Security Verification Failed</p>
              <p className="mt-1">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleResetSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">New Security Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                disabled={loading || isLinkInvalid}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Choose robust password"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-3 text-sm focus:ring-1 focus:ring-blue-500 outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Confirm Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                disabled={loading || isLinkInvalid}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm chosen password"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 py-3 text-sm focus:ring-1 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Password strength visualization */}
          {password.length > 0 && (
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3 animate-fade-in">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-500">Security Strength:</span>
                <span className={`font-black uppercase tracking-wider text-[10px] px-2 py-0.5 rounded-md ${getStrengthLabel().color === 'bg-emerald-500 text-emerald-500' ? 'bg-emerald-50 text-emerald-600' : getStrengthLabel().color === 'bg-amber-500 text-amber-500' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'}`}>
                  {getStrengthLabel().label}
                </span>
              </div>
              
              {/* Colored meter bar */}
              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${getStrengthPercent() <= 40 ? 'bg-red-500' : getStrengthPercent() <= 80 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                  style={{ width: `${getStrengthPercent()}%` }}
                />
              </div>

              {/* Requirement Checklist */}
              <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                <div className="flex items-center gap-1.5">
                  <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0 ${hasMinLength ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                    <Check className="w-2.5 h-2.5" />
                  </div>
                  <span className={hasMinLength ? 'text-slate-700 font-medium' : 'text-slate-400'}>Min 8 characters</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0 ${hasUpperCase ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                    <Check className="w-2.5 h-2.5" />
                  </div>
                  <span className={hasUpperCase ? 'text-slate-700 font-medium' : 'text-slate-400'}>Capital letter (A-Z)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0 ${hasNumber ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                    <Check className="w-2.5 h-2.5" />
                  </div>
                  <span className={hasNumber ? 'text-slate-700 font-medium' : 'text-slate-400'}>One number (0-9)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0 ${(hasSpecialChar || hasLowerCase) ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                    <Check className="w-2.5 h-2.5" />
                  </div>
                  <span className={(hasSpecialChar || hasLowerCase) ? 'text-slate-700 font-medium' : 'text-slate-400'}>Special/Lower char</span>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || isLinkInvalid}
            className="w-full bg-[#0066FF] hover:bg-blue-700 disabled:opacity-50 text-white font-extrabold py-3 rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? "Re-authorizing Credentials..." : "Commit Password Update"}
          </button>
        </form>
      </div>
    </div>
  );
};
