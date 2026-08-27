/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Search, 
  Star, 
  Calendar, 
  Clock, 
  Plus, 
  Edit, 
  Trash2, 
  Activity, 
  Bell, 
  User, 
  ShieldAlert, 
  Settings, 
  LogOut, 
  CheckCircle, 
  XCircle, 
  Phone, 
  Mail, 
  MapPin, 
  Filter, 
  ChevronRight, 
  AlertCircle,
  Sparkles,
  Stethoscope,
  Lock,
  PlusCircle,
  HelpCircle,
  Check,
  Eye,
  EyeOff,
  UserCheck,
  KeyRound,
  ShieldCheck,
  Loader2
} from 'lucide-react';
import { 
  Dentist, 
  Patient, 
  Appointment, 
  NotificationItem, 
  ActiveScreen, 
  AppointmentStatus,
  AuthUser
} from '../types';
import { 
  M3Button, 
  M3Card, 
  M3TextField, 
  M3Chip, 
  M3Badge, 
  M3FAB, 
  M3Switch 
} from './M3Components';
import { AVAILABLE_TIME_SLOTS, INITIAL_USERS } from '../data';

// ==========================================
// SCREEN 1: SPLASH SCREEN
// ==========================================
export const SplashScreenView: React.FC<{
  onEnter: () => void;
}> = ({ onEnter }) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onEnter();
    }, 2800);
    return () => clearTimeout(timer);
  }, [onEnter]);

  return (
    <div className="flex-1 bg-gradient-to-b from-[#1976D2] to-[#26A69A] flex flex-col items-center justify-between p-8 text-white relative">
      <div />
      
      <div className="flex flex-col items-center gap-6 animate-pulse">
        {/* Animated Centered Tooth/Heart Icon Frame */}
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-[0_8px_32px_rgba(255,255,255,0.25)] border-4 border-blue-100">
          <Stethoscope className="w-12 h-12 text-[#1976D2]" />
        </div>
        <div className="text-center">
          <h1 className="text-3xl font-bold font-sans tracking-tight">DentalCare</h1>
          <p className="text-sm text-blue-50/80 font-medium tracking-wide mt-1">Premium Healthcare App</p>
        </div>
      </div>

      <div className="w-full flex flex-col items-center gap-6 pb-8">
        {/* Material 3 Indeterminate Progress Indicator */}
        <div className="w-48 h-1.5 bg-white/20 rounded-full overflow-hidden">
          <div className="h-full bg-white rounded-full animate-progress-slide w-1/3" />
        </div>
        
        <button 
          onClick={onEnter} 
          className="text-xs text-blue-100/90 font-medium tracking-wider uppercase hover:text-white transition-colors duration-150 outline-none"
        >
          Skip Intro
        </button>
      </div>
    </div>
  );
};

// ==========================================
// SCREEN 2: LOGIN SCREEN
// ==========================================
export const LoginScreenView: React.FC<{
  onLogin: (role: 'patient' | 'admin', user?: AuthUser) => void;
  onGoToRegister: () => void;
  registeredUsers?: AuthUser[];
}> = ({ onLogin, onGoToRegister, registeredUsers = INITIAL_USERS }) => {
  const [email, setEmail] = useState('alex.johnson@example.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Forgot Password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotFeedback, setForgotFeedback] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError('Email address is required.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      // Search in registered users
      const allUsers = registeredUsers.length > 0 ? registeredUsers : INITIAL_USERS;
      const matchedUser = allUsers.find(
        (u) => u.email.toLowerCase() === trimmedEmail.toLowerCase()
      );

      if (matchedUser) {
        // Check password
        if (matchedUser.password && matchedUser.password !== password) {
          setError('Incorrect password. Please verify your credentials or use the demo buttons below.');
          return;
        }
        onLogin(matchedUser.role, matchedUser);
      } else {
        // If not registered in list, determine role by email or default to patient
        if (trimmedEmail.toLowerCase().includes('admin')) {
          const customAdmin: AuthUser = {
            id: 'admin_' + Date.now(),
            name: 'Clinic Administrator',
            email: trimmedEmail,
            password: password,
            phone: '+1 (555) 000-1122',
            role: 'admin',
            createdAt: new Date().toISOString().split('T')[0],
            address: 'DentalCare Headquarters'
          };
          onLogin('admin', customAdmin);
        } else {
          const customPatient: AuthUser = {
            id: 'user_' + Date.now(),
            name: trimmedEmail.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()),
            email: trimmedEmail,
            password: password,
            phone: '+1 (555) 123-4567',
            role: 'patient',
            createdAt: new Date().toISOString().split('T')[0],
            address: 'Registered Patient Address'
          };
          onLogin('patient', customPatient);
        }
      }
    }, 450);
  };

  const handleQuickFill = (userType: 'alex' | 'jane' | 'admin') => {
    setError('');
    if (userType === 'alex') {
      setEmail('alex.johnson@example.com');
      setPassword('password123');
    } else if (userType === 'jane') {
      setEmail('jane.smith@example.com');
      setPassword('password123');
    } else if (userType === 'admin') {
      setEmail('admin@dentalcare.com');
      setPassword('admin123');
    }
  };

  const handleSendResetLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail || !forgotEmail.includes('@')) {
      setForgotFeedback('Please enter a valid registered email address.');
      return;
    }
    setForgotFeedback(`Instructions have been sent to ${forgotEmail}. Please check your inbox.`);
    setTimeout(() => {
      setShowForgotModal(false);
      setForgotFeedback('');
    }, 2800);
  };

  return (
    <div className="flex-1 bg-white p-6 flex flex-col justify-between font-sans text-slate-800 relative">
      <div className="flex flex-col gap-5 pt-4">
        
        {/* Header Branding */}
        <div className="text-center">
          <div className="w-12 h-12 bg-blue-50 text-primary-m3 rounded-2xl flex items-center justify-center mx-auto mb-2.5 shadow-sm border border-blue-100">
            <Stethoscope className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome Back</h2>
          <p className="text-xs text-slate-500 mt-0.5">Sign in to manage appointments & clinical records</p>
        </div>

        {/* Error Feedback Banner */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3.5 py-2.5 rounded-xl text-xs flex items-start gap-2 animate-fade-in">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <span className="leading-tight">{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLoginSubmit} className="flex flex-col gap-3.5">
          <M3TextField
            label="Email Address"
            leadingIcon={Mail}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError('');
            }}
            type="email"
            id="login-email"
            required
          />

          <M3TextField
            label="Password"
            leadingIcon={Lock}
            trailingIcon={showPassword ? EyeOff : Eye}
            onTrailingIconClick={() => setShowPassword(!showPassword)}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) setError('');
            }}
            type={showPassword ? 'text' : 'password'}
            id="login-password"
            required
          />

          <div className="flex justify-between items-center text-xs pt-1">
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-600 select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded text-primary-m3 focus:ring-primary-m3 border-slate-300 w-3.5 h-3.5"
              />
              <span className="text-[11px] font-medium">Remember me</span>
            </label>

            <button 
              type="button"
              onClick={() => {
                setForgotEmail(email);
                setShowForgotModal(true);
              }}
              className="text-[11px] font-bold text-primary-m3 hover:underline outline-none"
            >
              Forgot Password?
            </button>
          </div>

          <M3Button 
            type="submit" 
            variant="filled" 
            className="w-full mt-1 font-semibold flex items-center justify-center gap-2" 
            id="login-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying credentials...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </M3Button>
        </form>

        {/* Quick Demo Pre-fill Pills */}
        <div className="pt-1">
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-100"></div>
            <span className="flex-shrink mx-3 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              1-Click Demo Accounts
            </span>
            <div className="flex-grow border-t border-slate-100"></div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('alex')}
                className={`flex-1 py-2 px-2.5 text-[11px] font-bold rounded-xl border transition-all text-left flex items-center gap-1.5 outline-none
                  ${email === 'alex.johnson@example.com' 
                    ? 'bg-blue-100/60 border-blue-400 text-blue-800 font-bold shadow-sm' 
                    : 'bg-blue-50/60 hover:bg-blue-100 text-primary-m3 border-blue-200/80'}`}
              >
                <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[9px] font-bold shrink-0">
                  AJ
                </div>
                <div className="min-w-0 flex-1 truncate">
                  <span className="block truncate leading-none">Alex (Patient)</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('jane')}
                className={`flex-1 py-2 px-2.5 text-[11px] font-bold rounded-xl border transition-all text-left flex items-center gap-1.5 outline-none
                  ${email === 'jane.smith@example.com' 
                    ? 'bg-blue-100/60 border-blue-400 text-blue-800 font-bold shadow-sm' 
                    : 'bg-blue-50/60 hover:bg-blue-100 text-primary-m3 border-blue-200/80'}`}
              >
                <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[9px] font-bold shrink-0">
                  JS
                </div>
                <div className="min-w-0 flex-1 truncate">
                  <span className="block truncate leading-none">Jane (Patient)</span>
                </div>
              </button>
            </div>

            <button
              type="button"
              onClick={() => handleQuickFill('admin')}
              className={`w-full py-2 px-3 text-[11px] font-bold rounded-xl border transition-all text-left flex items-center justify-between outline-none
                ${email === 'admin@dentalcare.com' 
                  ? 'bg-teal-100/70 border-teal-500 text-teal-900 font-bold shadow-sm' 
                  : 'bg-teal-50/60 hover:bg-teal-100 text-teal-800 border-teal-200/80'}`}
            >
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center text-[9px] font-bold shrink-0">
                  SM
                </div>
                <span>Dr. Sarah Miller (Clinic Administrator)</span>
              </div>
              <span className="text-[9px] bg-teal-200/70 text-teal-900 px-1.5 py-0.5 rounded font-bold uppercase">Admin</span>
            </button>
          </div>
        </div>

      </div>

      {/* Footer Registration Link */}
      <div className="text-center pb-2 text-xs text-slate-500">
        Don't have an account?{' '}
        <button 
          onClick={onGoToRegister} 
          className="text-primary-m3 font-bold hover:underline outline-none"
        >
          Create New Account
        </button>
      </div>

      {/* Forgot Password Interactive Modal */}
      {showForgotModal && (
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl p-5 w-full shadow-2xl border border-slate-100 flex flex-col gap-3.5">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-50 text-primary-m3 flex items-center justify-center">
                  <KeyRound className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Reset Password</h3>
              </div>
              <button 
                onClick={() => setShowForgotModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Enter your email address to receive password reset instructions.
            </p>

            {forgotFeedback ? (
              <div className="bg-blue-50 border border-blue-200 text-blue-800 p-3 rounded-xl text-xs font-medium flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />
                <span>{forgotFeedback}</span>
              </div>
            ) : (
              <form onSubmit={handleSendResetLink} className="flex flex-col gap-3">
                <M3TextField
                  label="Registered Email"
                  leadingIcon={Mail}
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  type="email"
                  required
                />
                <div className="flex gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="flex-1 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <M3Button
                    type="submit"
                    variant="filled"
                    className="flex-1 !py-2 text-xs"
                  >
                    Send Link
                  </M3Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// SCREEN 3: REGISTER SCREEN
// ==========================================
export const RegisterScreenView: React.FC<{
  onRegister: (newUser: AuthUser) => void;
  onGoToLogin: () => void;
  registeredUsers?: AuthUser[];
}> = ({ onRegister, onGoToLogin, registeredUsers = INITIAL_USERS }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'patient' | 'admin'>('patient');
  const [address, setAddress] = useState('');
  const [pwd, setPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedName || trimmedName.length < 2) {
      setError('Please provide your full name.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    // Check if email already registered
    const existing = (registeredUsers || []).find(
      (u) => u.email.toLowerCase() === trimmedEmail.toLowerCase()
    );
    if (existing) {
      setError('An account with this email address already exists. Please sign in instead.');
      return;
    }

    if (!trimmedPhone) {
      setError('Please provide a contact phone number.');
      return;
    }

    if (pwd.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (pwd !== confirmPwd) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    if (!agreedToTerms) {
      setError('You must agree to the Terms of Service & Privacy Policy.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const newUser: AuthUser = {
        id: 'u_' + Date.now(),
        name: trimmedName,
        email: trimmedEmail,
        password: pwd,
        phone: trimmedPhone,
        role: role,
        address: address.trim() || (role === 'admin' ? 'DentalCare Medical Center' : 'Patient Address'),
        createdAt: new Date().toISOString().split('T')[0]
      };

      onRegister(newUser);
    }, 400);
  };

  return (
    <div className="flex-1 bg-white p-5 flex flex-col justify-between font-sans text-slate-800 overflow-y-auto no-scrollbar">
      <div className="flex flex-col gap-4 pt-2">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Create Account</h2>
          <p className="text-xs text-slate-500 mt-0.5">Join DentalCare for real-time bookings & records</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3.5 py-2.5 rounded-xl text-xs flex items-start gap-2 animate-fade-in">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <span className="leading-tight">{error}</span>
          </div>
        )}

        {/* Role Selector Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setRole('patient')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all
              ${role === 'patient' 
                ? 'bg-white text-primary-m3 shadow-sm' 
                : 'text-slate-500 hover:text-slate-800'}`}
          >
            Patient Account
          </button>
          <button
            type="button"
            onClick={() => setRole('admin')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all
              ${role === 'admin' 
                ? 'bg-white text-teal-700 shadow-sm' 
                : 'text-slate-500 hover:text-slate-800'}`}
          >
            Clinical Specialist
          </button>
        </div>

        <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-3">
          <M3TextField
            label="Full Name"
            leadingIcon={User}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError('');
            }}
            id="reg-name"
            placeholder="e.g. Alex Johnson"
            required
          />

          <M3TextField
            label="Email Address"
            leadingIcon={Mail}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError('');
            }}
            type="email"
            id="reg-email"
            placeholder="name@example.com"
            required
          />

          <M3TextField
            label="Phone Number"
            leadingIcon={Phone}
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              if (error) setError('');
            }}
            type="tel"
            id="reg-phone"
            placeholder="+1 (555) 000-0000"
            required
          />

          <M3TextField
            label="Address / Location"
            leadingIcon={MapPin}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            id="reg-address"
            placeholder="Street address, city"
          />

          <M3TextField
            label="Password (min 6 characters)"
            leadingIcon={Lock}
            trailingIcon={showPassword ? EyeOff : Eye}
            onTrailingIconClick={() => setShowPassword(!showPassword)}
            value={pwd}
            onChange={(e) => {
              setPwd(e.target.value);
              if (error) setError('');
            }}
            type={showPassword ? 'text' : 'password'}
            id="reg-pwd"
            required
          />

          <M3TextField
            label="Confirm Password"
            leadingIcon={Lock}
            value={confirmPwd}
            onChange={(e) => {
              setConfirmPwd(e.target.value);
              if (error) setError('');
            }}
            type={showPassword ? 'text' : 'password'}
            id="reg-conf"
            required
          />

          <div className="flex items-start gap-2 py-1">
            <input 
              type="checkbox" 
              id="terms" 
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-0.5 rounded border-slate-300 text-primary-m3 focus:ring-primary-m3 w-3.5 h-3.5" 
            />
            <label htmlFor="terms" className="text-[10px] text-slate-500 leading-tight select-none">
              I agree to the DentalCare App <span className="text-primary-m3 font-semibold hover:underline cursor-pointer">Terms of Service</span> and <span className="text-primary-m3 font-semibold hover:underline cursor-pointer">Privacy Policy</span>.
            </label>
          </div>

          <M3Button 
            type="submit" 
            variant="filled" 
            className="w-full mt-1" 
            id="reg-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating Profile...
              </span>
            ) : (
              <span>Create Account</span>
            )}
          </M3Button>
        </form>
      </div>

      <div className="text-center pb-2 text-xs text-slate-500 mt-3">
        Already have an account?{' '}
        <button 
          onClick={onGoToLogin} 
          className="text-primary-m3 font-bold hover:underline outline-none"
        >
          Sign In
        </button>
      </div>
    </div>
  );
};

// ==========================================
// SCREEN 4: PATIENT HOME DASHBOARD
// ==========================================
export const PatientDashboardView: React.FC<{
  appointments: Appointment[];
  notifications: NotificationItem[];
  currentUser?: AuthUser;
  onNavigate: (screen: ActiveScreen) => void;
  onSelectAppointment: (appt: Appointment) => void;
}> = ({ appointments, notifications, currentUser, onNavigate, onSelectAppointment }) => {
  // Find next upcoming appointment
  const upcoming = appointments.find(a => a.status === 'Confirmed' || a.status === 'Pending');
  const recentAlerts = notifications.slice(0, 2);

  const userName = currentUser?.name || 'Alex Johnson';
  const firstName = userName.split(' ')[0];
  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'AJ';

  return (
    <div className="flex-1 p-5 flex flex-col gap-5 text-slate-800">
      
      {/* Dynamic Welcome Heading */}
      <div className="flex justify-between items-center bg-blue-50/50 p-4 rounded-2xl border border-blue-100/50">
        <div>
          <span className="text-[10px] font-bold text-primary-m3 tracking-widest uppercase">Welcome back</span>
          <h2 className="text-xl font-bold text-slate-900">Hello, {firstName}</h2>
          <p className="text-xs text-slate-500">Your clinical records are synchronized</p>
        </div>
        <div 
          onClick={() => onNavigate('patient-profile')}
          className="w-12 h-12 rounded-full bg-primary-m3 text-white flex items-center justify-center font-bold text-base shadow-sm border-2 border-white cursor-pointer hover:scale-105 transition-transform"
        >
          {initials}
        </div>
      </div>

      {/* Hero Card: Next Appointment */}
      <div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Next Appointment</h3>
        {upcoming ? (
          <M3Card variant="elevated" className="border-l-4 border-l-primary-m3 !p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="text-[11px] font-bold text-primary-m3 uppercase tracking-wide">
                  {upcoming.time} • {upcoming.date}
                </span>
                <h4 className="text-base font-bold text-slate-800 mt-0.5">{upcoming.dentistName}</h4>
                <p className="text-xs text-slate-500 leading-tight">{upcoming.dentistSpecialty}</p>
              </div>
              <M3Badge status={upcoming.status} />
            </div>
            
            <div className="bg-slate-50 p-2.5 rounded-xl text-[11px] text-slate-600 mb-3 border border-slate-100 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              <span className="truncate">Reason: {upcoming.reason}</span>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => {
                  onSelectAppointment(upcoming);
                  onNavigate('my-appointments');
                }}
                className="flex-1 py-1.5 bg-primary-container-m3 text-on-primary-container-m3 text-xs font-bold rounded-lg hover:bg-blue-200 transition-all outline-none"
              >
                Manage Slot
              </button>
              <button 
                onClick={() => alert("Appointment details added to your calendar")}
                className="px-3 py-1.5 border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold rounded-lg transition-all outline-none"
              >
                Add Calendar
              </button>
            </div>
          </M3Card>
        ) : (
          <M3Card variant="outlined" className="text-center py-6 flex flex-col items-center gap-2">
            <Calendar className="w-8 h-8 text-slate-300" />
            <p className="text-xs text-slate-500 font-medium">No upcoming appointments scheduled.</p>
            <M3Button variant="tonal" onClick={() => onNavigate('book-appointment')} className="mt-1">
              Book Appointment
            </M3Button>
          </M3Card>
        )}
      </div>

      {/* Quick Actions Row */}
      <div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">Quick Actions</h3>
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => onNavigate('book-appointment')}
            className="flex flex-col items-center gap-2 p-3 bg-white hover:bg-slate-50/80 rounded-2xl border border-slate-100 shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all active:scale-95 group outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1976D2] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-slate-700">Book Appt</span>
          </button>
          
          <button
            onClick={() => onNavigate('my-appointments')}
            className="flex flex-col items-center gap-2 p-3 bg-white hover:bg-slate-50/80 rounded-2xl border border-slate-100 shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all active:scale-95 group outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#26A69A] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Activity className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-slate-700">My Appts</span>
          </button>

          <button
            onClick={() => onNavigate('dentist-list')}
            className="flex flex-col items-center gap-2 p-3 bg-white hover:bg-slate-50/80 rounded-2xl border border-slate-100 shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all active:scale-95 group outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Stethoscope className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-slate-700">Find Dentist</span>
          </button>
        </div>
      </div>

      {/* Recent Alerts */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Recent Notifications</h3>
          <button onClick={() => onNavigate('notifications')} className="text-[10px] font-bold text-primary-m3 hover:underline outline-none">
            View All
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {recentAlerts.map((n) => (
            <div 
              key={n.id} 
              onClick={() => onNavigate('notifications')}
              className="flex gap-3 items-start p-3 bg-white rounded-xl border border-slate-100 shadow-sm cursor-pointer hover:bg-slate-50/65 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-blue-50 text-primary-m3 flex items-center justify-center shrink-0 mt-0.5">
                <Bell className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex justify-between items-center mb-0.5">
                  <h4 className="text-[11px] font-bold text-slate-800 leading-tight">{n.title}</h4>
                  <span className="text-[9px] text-slate-400 font-medium whitespace-nowrap pl-1">{n.time}</span>
                </div>
                <p className="text-[10px] text-slate-500 leading-snug truncate">{n.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Wellness Tip */}
      <div className="bg-gradient-to-r from-blue-50 to-teal-50 border border-blue-100/40 p-4 rounded-2xl flex gap-3 items-start">
        <Sparkles className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-[11px] font-bold text-slate-800 uppercase tracking-wider mb-0.5">Clinic Health Tip</h4>
          <p className="text-[10px] text-slate-600 leading-relaxed">
            Keep your enamel strong! Drink plenty of fluoridated water and brush gently for a full 2 minutes twice a day.
          </p>
        </div>
      </div>

    </div>
  );
};

// ==========================================
// SCREEN 5: DENTIST LIST
// ==========================================
export const DentistListView: React.FC<{
  dentists: Dentist[];
  onSelectDentist: (dentist: Dentist) => void;
}> = ({ dentists, onSelectDentist }) => {
  const [search, setSearch] = useState('');

  const filtered = dentists.filter(d => 
    d.name.toLowerCase().includes(search.toLowerCase()) || 
    d.specialty.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 p-5 flex flex-col gap-4 text-slate-800">
      
      {/* Search Input Bar */}
      <div className="relative flex items-center">
        <Search className="absolute left-3.5 w-4 h-4 text-slate-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or specialty..."
          className="w-full text-xs font-medium py-3 pl-10 pr-10 bg-white border border-slate-200 rounded-full outline-none focus:border-primary-m3 transition-colors text-slate-800"
        />
        <Filter className="absolute right-3.5 w-4 h-4 text-slate-400 cursor-pointer hover:text-slate-600" />
      </div>

      {/* Dentist Cards */}
      <div className="flex flex-col gap-3">
        {filtered.map((d) => (
          <M3Card key={d.id} variant="outlined" className="relative !p-4 flex gap-4 items-center">
            
            {/* Colored Avatar Initials */}
            <div className={`w-14 h-14 rounded-full ${d.avatarColor} text-white flex items-center justify-center font-bold text-lg shrink-0 border border-white shadow-sm`}>
              {d.name.split(' ').slice(1).map(n => n[0]).join('')}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-primary-m3 uppercase tracking-wider">Dentist Spec</span>
                <h4 className="text-sm font-bold text-slate-900 leading-tight mt-0.5 truncate">{d.name}</h4>
                <p className="text-xs text-slate-500 leading-snug mt-0.5 truncate">{d.specialty}</p>
              </div>

              {/* Rating and Badges */}
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                <div className="flex items-center text-amber-500 gap-0.5">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="text-[11px] font-bold text-slate-700">{d.rating}</span>
                  <span className="text-[9px] text-slate-400">({d.reviewsCount})</span>
                </div>
                {d.availableToday ? (
                  <span className="inline-flex items-center px-2 py-0.5 text-[9px] font-bold rounded bg-teal-50 text-teal-700 border border-teal-200">
                    Available Today
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-0.5 text-[9px] font-bold rounded bg-slate-100 text-slate-500">
                    Away
                  </span>
                )}
              </div>
            </div>

            <div className="self-end mt-2">
              <button
                onClick={() => onSelectDentist(d)}
                className="py-1.5 px-3 bg-primary-container-m3 text-on-primary-container-m3 text-xs font-bold rounded-full hover:bg-blue-200 active:scale-95 transition-all outline-none"
              >
                Book Now
              </button>
            </div>
          </M3Card>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-10 text-slate-500 text-xs">No doctors matched your filter.</div>
        )}
      </div>

    </div>
  );
};

// ==========================================
// SCREEN 6: BOOK APPOINTMENT SCREEN
// ==========================================
export const BookAppointmentView: React.FC<{
  dentists: Dentist[];
  selectedDentist: Dentist | null;
  onSelectDentist: (dentist: Dentist) => void;
  onConfirmBooking: (booking: {
    dentist: Dentist;
    date: string;
    time: string;
    reason: string;
  }) => void;
}> = ({ dentists, selectedDentist, onSelectDentist, onConfirmBooking }) => {
  const [selectedDate, setSelectedDate] = useState<string>('2026-07-19');
  const [selectedTime, setSelectedTime] = useState<string>('10:00 AM');
  const [reason, setReason] = useState('Routine checkup & polish');

  const currentDentist = selectedDentist || dentists[0];

  // Simulated days of current month (August/JulyRecur)
  const days = [
    { num: '01', day: 'Thu', dateStr: '2026-07-15' },
    { num: '06', day: 'Tue', dateStr: '2026-07-18' },
    { num: '07', day: 'Wed', dateStr: '2026-07-19', active: true },
    { num: '12', day: 'Mon', dateStr: '2026-07-20' },
    { num: '15', day: 'Thu', dateStr: '2026-07-21' },
    { num: '18', day: 'Sun', dateStr: '2026-07-22' },
  ];

  const handleBookingConfirm = () => {
    onConfirmBooking({
      dentist: currentDentist,
      date: selectedDate,
      time: selectedTime,
      reason: reason || 'Routine treatment checkup',
    });
  };

  return (
    <div className="flex-1 p-5 flex flex-col gap-4 text-slate-800">
      
      {/* 1. Doctor Selector */}
      <div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Select Dentist</h3>
        <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
          {dentists.map((d) => {
            const isSelected = d.id === currentDentist.id;
            return (
              <div 
                key={d.id}
                onClick={() => onSelectDentist(d)}
                className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer shrink-0 transition-all select-none
                  ${isSelected 
                    ? 'bg-blue-50 border-primary-m3 shadow-sm' 
                    : 'bg-white border-slate-100 hover:bg-slate-50'}`}
              >
                <div className={`w-8 h-8 rounded-full ${d.avatarColor} text-white flex items-center justify-center font-bold text-xs`}>
                  {d.name.split(' ').slice(1).map(n => n[0]).join('')}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">{d.name}</h4>
                  <p className="text-[10px] text-slate-500 leading-none">{d.specialty.split(' ')[0]}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Calendar grid */}
      <div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">1. Select a Date</h3>
        <div className="flex justify-between gap-1.5 overflow-x-auto no-scrollbar">
          {days.map((d) => {
            const isSelected = selectedDate === d.dateStr;
            return (
              <div
                key={d.num}
                onClick={() => setSelectedDate(d.dateStr)}
                className={`flex-1 flex flex-col items-center p-3 rounded-2xl cursor-pointer select-none transition-all outline-none
                  ${isSelected
                    ? 'bg-primary-m3 text-white shadow-md scale-105'
                    : 'bg-white text-slate-600 border border-slate-100 hover:bg-slate-50'
                  }`}
              >
                <span className={`text-[10px] font-medium ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                  {d.day}
                </span>
                <span className="text-base font-bold leading-tight mt-0.5">{d.num}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Time Slots */}
      <div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">2. Select a Time Slot</h3>
        <div className="grid grid-cols-3 gap-2">
          {AVAILABLE_TIME_SLOTS.map((slot) => {
            const isSelected = selectedTime === slot;
            return (
              <button
                key={slot}
                onClick={() => setSelectedTime(slot)}
                className={`py-2 px-1 text-xs font-bold rounded-lg border transition-all outline-none
                  ${isSelected
                    ? 'bg-[#1976D2] text-white border-primary-m3'
                    : 'bg-white text-slate-600 border-slate-100 hover:bg-slate-50'
                  }`}
              >
                {slot}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Reason for Visit Input */}
      <div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">3. Reason for Visit</h3>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="e.g. Tooth sensitivity, scaling, annual routine checkup..."
          rows={2}
          className="w-full text-xs font-medium p-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-primary-m3 text-slate-800 placeholder-slate-400"
        />
      </div>

      {/* 5. Trigger Floating FAB Action Button */}
      <div className="mt-2">
        <M3Button 
          onClick={handleBookingConfirm} 
          variant="filled" 
          className="w-full"
          id="confirm-booking-btn"
        >
          Confirm Appointment
        </M3Button>
      </div>

    </div>
  );
};

// ==========================================
// SCREEN 7: APPOINTMENT CONFIRMATION SCREEN
// ==========================================
export const AppointmentConfirmationView: React.FC<{
  lastBooking: {
    dentist: Dentist;
    date: string;
    time: string;
    reason: string;
  } | null;
  onFinish: () => void;
}> = ({ lastBooking, onFinish }) => {
  const [mapVisible, setMapVisible] = useState(false);

  return (
    <div className="flex-1 p-6 flex flex-col justify-between text-slate-800 font-sans bg-white">
      <div className="flex flex-col items-center text-center gap-6 pt-4">
        
        {/* Checkmark icon scale */}
        <div className="w-20 h-20 bg-teal-50 text-teal-500 rounded-full flex items-center justify-center shadow-[0_4px_16px_rgba(38,166,154,0.15)] border-4 border-teal-100">
          <CheckCircle className="w-10 h-10" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Booking Confirmed!</h2>
          <p className="text-xs text-slate-500 mt-1">Your dental appointment has been recorded.</p>
        </div>

        {/* Confirmation Slip Card */}
        <div className="w-full bg-slate-50 rounded-2xl p-4 border border-slate-100 text-left">
          <span className="text-[9px] font-bold text-primary-m3 tracking-widest uppercase">Summary Slip</span>
          <h3 className="text-sm font-bold text-slate-900 mt-1">{lastBooking?.dentist.name || 'Dr. Sarah Miller'}</h3>
          <p className="text-xs text-slate-500 leading-none">{lastBooking?.dentist.specialty || 'Orthodontist'}</p>

          <div className="border-t border-slate-200/50 my-3" />

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-medium">Scheduled Date:</span>
              <span className="font-bold text-slate-700">{lastBooking?.date || '2026-07-19'}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-medium">Scheduled Time:</span>
              <span className="font-bold text-slate-700">{lastBooking?.time || '10:00 AM'}</span>
            </div>
            <div className="flex justify-between items-start text-xs">
              <span className="text-slate-400 font-medium">Treatment:</span>
              <span className="font-bold text-slate-700 max-w-[150px] text-right truncate">{lastBooking?.reason || 'Routine cleaning'}</span>
            </div>
            <div className="flex justify-between items-start text-xs">
              <span className="text-slate-400 font-medium">Location:</span>
              <div className="text-right">
                <span className="font-bold text-slate-700 block">SmileCare Clinic</span>
                <span className="text-[10px] text-slate-400 block">Medical Plaza, Suite 101</span>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200/50 my-3" />

          <button
            onClick={() => setMapVisible(!mapVisible)}
            className="w-full text-center text-xs font-bold text-primary-m3 hover:underline flex items-center justify-center gap-1.5 outline-none"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>{mapVisible ? 'Hide Clinic Map' : 'View Clinic Map & Address'}</span>
          </button>

          {mapVisible && (
            <div className="mt-3 rounded-xl overflow-hidden border border-slate-200 h-28 bg-blue-100 flex items-center justify-center relative">
              <div className="absolute inset-0 bg-slate-50 flex flex-col justify-center items-center text-center p-2 text-[10px] text-slate-500">
                <MapPin className="w-5 h-5 text-[#1976D2] mb-1 animate-bounce" />
                <span className="font-bold text-slate-800">123 Health Ave, Medical Plaza</span>
                <span>Active coordinates mapped in preview</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2.5 mt-6">
        <M3Button
          variant="outlined"
          onClick={() => alert("Event added to Google Calendar")}
          className="w-full"
        >
          Add to Google Calendar
        </M3Button>
        <M3Button
          variant="filled"
          onClick={onFinish}
          className="w-full"
          id="finish-booking-btn"
        >
          Finish
        </M3Button>
      </div>
    </div>
  );
};

// ==========================================
// SCREEN 8: MY APPOINTMENTS SCREEN
// ==========================================
export const MyAppointmentsView: React.FC<{
  appointments: Appointment[];
  selectedAppointment: Appointment | null;
  onSelectAppointment: (appt: Appointment) => void;
  onCancelAppointment: (id: string) => void;
  onRescheduleAppointment: (id: string) => void;
}> = ({ appointments, selectedAppointment, onSelectAppointment, onCancelAppointment, onRescheduleAppointment }) => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  const upcoming = appointments.filter(a => a.status === 'Confirmed' || a.status === 'Pending');
  const past = appointments.filter(a => a.status === 'Completed' || a.status === 'Cancelled');

  const activeList = activeTab === 'upcoming' ? upcoming : past;

  return (
    <div className="flex-1 flex flex-col text-slate-800">
      
      {/* Tab Navigation Switches */}
      <div className="flex bg-white border-b border-slate-100 sticky top-0 z-35">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`flex-1 py-3 text-xs font-bold border-b-2 transition-colors outline-none
            ${activeTab === 'upcoming' 
              ? 'border-primary-m3 text-primary-m3 font-semibold' 
              : 'border-transparent text-slate-400'}`}
        >
          Upcoming ({upcoming.length})
        </button>
        <button
          onClick={() => setActiveTab('past')}
          className={`flex-1 py-3 text-xs font-bold border-b-2 transition-colors outline-none
            ${activeTab === 'past' 
              ? 'border-primary-m3 text-primary-m3 font-semibold' 
              : 'border-transparent text-slate-400'}`}
        >
          Past Records ({past.length})
        </button>
      </div>

      <div className="p-4 flex flex-col gap-3">
        {activeList.map((a) => {
          const isSelected = selectedAppointment?.id === a.id;
          return (
            <M3Card 
              key={a.id} 
              variant="outlined" 
              className={`transition-all ${isSelected ? 'border-primary-m3 bg-blue-50/20' : ''}`}
            >
              <div 
                onClick={() => onSelectAppointment(a)}
                className="flex justify-between items-start cursor-pointer mb-2.5"
              >
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none block">
                    {a.date}
                  </span>
                  <span className="text-sm font-bold text-slate-950 mt-1 block">
                    {a.dentistName}
                  </span>
                  <p className="text-xs text-slate-500 leading-snug">{a.reason}</p>
                </div>
                <M3Badge status={a.status} />
              </div>

              {/* Collapsible expansion for interactive reschedule or treatment inspection */}
              {isSelected && (
                <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col gap-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Scheduled Time:</span>
                    <span className="font-bold text-slate-700">{a.time}</span>
                  </div>
                  
                  {a.notes && (
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[11px] text-slate-500 leading-normal">
                      <span className="font-bold text-slate-700 block mb-0.5">Doctor Notes:</span>
                      {a.notes}
                    </div>
                  )}

                  {/* Treatment details for Completed states */}
                  {a.status === 'Completed' && (
                    <div className="bg-teal-50/40 p-3 rounded-xl border border-teal-100 text-[11px] text-teal-800 leading-relaxed">
                      <div className="flex items-center gap-1 text-teal-700 font-bold mb-1">
                        <Activity className="w-3.5 h-3.5" />
                        <span>Registered Clinical Records:</span>
                      </div>
                      <p><strong className="text-teal-900 font-semibold">Diagnosis:</strong> {a.diagnosis}</p>
                      <p className="mt-1"><strong className="text-teal-900 font-semibold">Treatment:</strong> {a.treatment}</p>
                      <p className="mt-1"><strong className="text-teal-900 font-semibold">Observations:</strong> {a.observations}</p>
                    </div>
                  )}

                  {activeTab === 'upcoming' && (
                    <div className="flex gap-2 justify-end mt-1">
                      <button
                        onClick={() => onCancelAppointment(a.id)}
                        className="px-3 py-1.5 border border-error-m3 text-error-m3 rounded-lg font-bold hover:bg-red-50 text-[11px] transition-all outline-none"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => onRescheduleAppointment(a.id)}
                        className="px-3 py-1.5 bg-primary-m3 text-white rounded-lg font-bold hover:bg-blue-700 text-[11px] transition-all outline-none"
                      >
                        Reschedule
                      </button>
                    </div>
                  )}
                </div>
              )}
            </M3Card>
          );
        })}

        {activeList.length === 0 && (
          <div className="text-center py-10 flex flex-col items-center gap-2 text-slate-400 text-xs">
            <Calendar className="w-8 h-8 text-slate-300" />
            <span>No appointments found in this tab.</span>
          </div>
        )}
      </div>

    </div>
  );
};

// ==========================================
// SCREEN 9: NOTIFICATIONS SCREEN
// ==========================================
export const NotificationsView: React.FC<{
  notifications: NotificationItem[];
  onMarkAsRead: (id: string) => void;
  onClearAll: () => void;
}> = ({ notifications, onMarkAsRead, onClearAll }) => {
  return (
    <div className="flex-1 p-4 flex flex-col gap-3 text-slate-800">
      
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Recent Activity ({notifications.length})</span>
        <button 
          onClick={onClearAll} 
          className="text-xs font-bold text-primary-m3 hover:underline outline-none"
        >
          Clear All
        </button>
      </div>

      <div className="flex flex-col gap-2.5">
        {notifications.map((n) => {
          const typeColors = {
            confirmed: 'bg-teal-50 text-teal-600 border border-teal-100',
            reminder: 'bg-blue-50 text-primary-m3 border border-blue-100',
            updated: 'bg-amber-50 text-amber-600 border border-amber-100',
            cancelled: 'bg-red-50 text-error-m3 border border-red-100',
          };

          const typeIcons = {
            confirmed: CheckCircle,
            reminder: Clock,
            updated: Edit,
            cancelled: XCircle,
          };

          const Icon = typeIcons[n.type] || Bell;

          return (
            <div
              key={n.id}
              onClick={() => onMarkAsRead(n.id)}
              className={`flex gap-3.5 p-3.5 rounded-2xl border transition-all cursor-pointer relative
                ${n.read 
                  ? 'bg-white border-slate-100' 
                  : 'bg-blue-50/20 border-blue-200/50 shadow-sm'}`}
            >
              <div className={`w-9 h-9 rounded-full ${typeColors[n.type]} flex items-center justify-center shrink-0`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex justify-between items-center mb-0.5">
                  <h4 className={`text-xs ${n.read ? 'text-slate-800 font-medium' : 'text-slate-950 font-bold'} leading-tight`}>
                    {n.title}
                  </h4>
                  <span className="text-[9px] text-slate-400 shrink-0 font-semibold">{n.time}</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-normal">{n.message}</p>
              </div>
              {!n.read && (
                <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-blue-500" />
              )}
            </div>
          );
        })}

        {notifications.length === 0 && (
          <div className="text-center py-10 text-slate-400 text-xs flex flex-col items-center gap-2">
            <Bell className="w-8 h-8 text-slate-200 animate-bounce" />
            <span>You have no notifications right now.</span>
          </div>
        )}
      </div>

    </div>
  );
};

// ==========================================
// SCREEN 10: PATIENT PROFILE SCREEN
// ==========================================
export const PatientProfileView: React.FC<{
  currentUser?: AuthUser;
  onUpdateProfile?: (updated: Partial<AuthUser>) => void;
  onLogout: () => void;
}> = ({ currentUser, onUpdateProfile, onLogout }) => {
  const [phoneAlerts, setPhoneAlerts] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [name, setName] = useState(currentUser?.name || 'Alex Johnson');
  const [email, setEmail] = useState(currentUser?.email || 'alex.johnson@example.com');
  const [phone, setPhone] = useState(currentUser?.phone || '+1 (555) 234-5678');
  const [address, setAddress] = useState(currentUser?.address || '742 Evergreen Terrace, Springfield');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync state if currentUser changes
  React.useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setEmail(currentUser.email);
      setPhone(currentUser.phone);
      if (currentUser.address) setAddress(currentUser.address);
    }
  }, [currentUser]);

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'AJ';

  const handleSaveProfile = () => {
    if (onUpdateProfile) {
      onUpdateProfile({
        name,
        email,
        phone,
        address
      });
    }
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="flex-1 p-5 flex flex-col gap-5 text-slate-800">
      
      {/* Profile Header section */}
      <div className="flex flex-col items-center text-center gap-3 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative">
          <div className="w-20 h-20 bg-primary-container-m3 text-primary-m3 rounded-full flex items-center justify-center font-bold text-2xl border-2 border-blue-200 shadow-inner">
            {initials}
          </div>
          <button 
            onClick={() => setIsEditing(true)}
            className="absolute bottom-0 right-0 p-1.5 bg-primary-m3 hover:bg-blue-700 text-white rounded-full shadow border-2 border-white outline-none"
            title="Edit Profile"
          >
            <Edit className="w-3.5 h-3.5" />
          </button>
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900">{name}</h3>
          <div className="flex items-center justify-center gap-2 mt-1">
            <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded uppercase">
              ID: #{currentUser?.id ? currentUser.id.substring(currentUser.id.length - 5).toUpperCase() : 'DC-8821'}
            </span>
            <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded uppercase">
              {currentUser?.role === 'admin' ? 'Specialist' : 'Patient'}
            </span>
          </div>
          {currentUser?.createdAt && (
            <p className="text-[10px] text-slate-400 mt-1">Member since {currentUser.createdAt}</p>
          )}
        </div>
      </div>

      {saveSuccess && (
        <div className="bg-teal-50 border border-teal-200 text-teal-800 px-3 py-2 rounded-xl text-xs flex items-center gap-2 animate-fade-in">
          <CheckCircle className="w-4 h-4 text-teal-600 shrink-0" />
          <span>Profile updated successfully!</span>
        </div>
      )}

      {/* Account Info section */}
      <div>
        <div className="flex justify-between items-center mb-2 px-1">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Personal Info</h4>
          <button 
            onClick={() => setIsEditing(!isEditing)} 
            className="text-xs font-bold text-primary-m3 hover:underline outline-none"
          >
            {isEditing ? 'Cancel' : 'Edit Info'}
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-4 flex flex-col gap-3 shadow-sm">
          {isEditing ? (
            <div className="flex flex-col gap-3">
              <M3TextField label="Full Name" value={name} onChange={(e) => setName(e.target.value)} id="p-name" />
              <M3TextField label="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} id="p-email" />
              <M3TextField label="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} id="p-phone" />
              <M3TextField label="Address" value={address} onChange={(e) => setAddress(e.target.value)} id="p-address" />
              <M3Button variant="filled" onClick={handleSaveProfile} className="w-full mt-1">
                Save Changes
              </M3Button>
            </div>
          ) : (
            <div className="flex flex-col gap-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">Email Address:</span>
                <span className="font-semibold text-slate-700">{email}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">Phone Number:</span>
                <span className="font-semibold text-slate-700">{phone}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Home Address:</span>
                <span className="font-semibold text-slate-700 text-right">{address}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Settings / Preferences section */}
      <div>
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">App Settings</h4>
        <div className="bg-white rounded-2xl border border-slate-100 p-4 flex flex-col gap-3 shadow-sm text-xs">
          <div className="flex justify-between items-center py-1">
            <div>
              <span className="font-semibold text-slate-700 block">Push Notifications</span>
              <span className="text-[10px] text-slate-400">Receive appointment checks & tips</span>
            </div>
            <M3Switch checked={phoneAlerts} onChange={setPhoneAlerts} id="alert-switch-push" />
          </div>
          <div className="flex justify-between items-center py-1 border-t border-slate-50 pt-2">
            <div>
              <span className="font-semibold text-slate-700 block">Email Reminders</span>
              <span className="text-[10px] text-slate-400">Get clinical checkup schedule emails</span>
            </div>
            <M3Switch checked={emailAlerts} onChange={setEmailAlerts} id="alert-switch-email" />
          </div>
          <div className="flex justify-between items-center py-1 border-t border-slate-50 pt-2">
            <div>
              <span className="font-semibold text-slate-700 block">Simulate Dark Mode</span>
              <span className="text-[10px] text-slate-400">For display evaluation only</span>
            </div>
            <M3Switch checked={darkMode} onChange={setDarkMode} id="alert-switch-dark" />
          </div>
        </div>
      </div>

      {/* Logout Action */}
      <button
        onClick={onLogout}
        className="w-full py-3 bg-red-50 hover:bg-red-100 text-error-m3 font-bold rounded-2xl border border-red-100 text-xs flex justify-center items-center gap-2.5 transition-colors outline-none mt-2 shadow-sm"
      >
        <LogOut className="w-4 h-4" />
        <span>Log Out Account</span>
      </button>

    </div>
  );
};

// ==========================================
// SCREEN 11: ADMINISTRATOR DASHBOARD
// ==========================================
export const AdminDashboardView: React.FC<{
  appointments: Appointment[];
  patients: Patient[];
  dentists: Dentist[];
  onNavigate: (screen: ActiveScreen) => void;
}> = ({ appointments, patients, dentists, onNavigate }) => {
  const pendingCount = appointments.filter(a => a.status === 'Pending').length;
  const todayCount = appointments.filter(a => a.status === 'Confirmed').length;

  return (
    <div className="flex-1 p-5 flex flex-col gap-5 text-slate-800">
      
      {/* Header Banner */}
      <div className="bg-slate-800 text-white p-4 rounded-2xl border border-slate-700 flex justify-between items-center">
        <div>
          <span className="text-[9px] font-bold text-teal-400 tracking-wider uppercase">Administrative Controls</span>
          <h2 className="text-lg font-bold">Admin Console</h2>
          <p className="text-[10px] text-slate-300">DentalCare Clinic Management Suite</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-teal-500 text-white flex items-center justify-center font-bold">
          AD
        </div>
      </div>

      {/* Grid statistics container */}
      <div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">Quick Clinical Stats</h3>
        <div className="grid grid-cols-2 gap-3">
          
          <M3Card variant="elevated" className="!p-3.5">
            <span className="text-[9px] font-bold text-[#1976D2] uppercase tracking-wide">Confirmed Today</span>
            <div className="flex justify-between items-baseline mt-1">
              <span className="text-2xl font-bold text-slate-900">{todayCount}</span>
              <span className="text-[10px] text-slate-400">Appts</span>
            </div>
          </M3Card>

          <M3Card variant="elevated" className="!p-3.5">
            <span className="text-[9px] font-bold text-teal-600 uppercase tracking-wide">Registered Patients</span>
            <div className="flex justify-between items-baseline mt-1">
              <span className="text-2xl font-bold text-slate-900">{patients.length}</span>
              <span className="text-[10px] text-slate-400">Total</span>
            </div>
          </M3Card>

          <M3Card variant="elevated" className="!p-3.5">
            <span className="text-[9px] font-bold text-indigo-600 uppercase tracking-wide">Active Specialists</span>
            <div className="flex justify-between items-baseline mt-1">
              <span className="text-2xl font-bold text-slate-900">{dentists.length}</span>
              <span className="text-[10px] text-slate-400">Dentists</span>
            </div>
          </M3Card>

          <M3Card variant="elevated" className="!p-3.5 border-l-2 border-l-amber-400">
            <span className="text-[9px] font-bold text-amber-600 uppercase tracking-wide">Pending Confirm</span>
            <div className="flex justify-between items-baseline mt-1">
              <span className="text-2xl font-bold text-amber-700">{pendingCount}</span>
              <span className="text-[10px] text-slate-400 animate-pulse">Alerts</span>
            </div>
          </M3Card>

        </div>
      </div>

      {/* Quick Admin Actions Row */}
      <div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">Admin Quick actions</h3>
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => onNavigate('manage-dentists')}
            className="flex flex-col items-center gap-1.5 p-3 bg-white hover:bg-slate-50/80 rounded-2xl border border-slate-100 shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all active:scale-95 group outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <Stethoscope className="w-4.5 h-4.5" />
            </div>
            <span className="text-[9px] font-bold text-slate-600 text-center">Dentist List</span>
          </button>

          <button
            onClick={() => onNavigate('manage-patients')}
            className="flex flex-col items-center gap-1.5 p-3 bg-white hover:bg-slate-50/80 rounded-2xl border border-slate-100 shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all active:scale-95 group outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <User className="w-4.5 h-4.5" />
            </div>
            <span className="text-[9px] font-bold text-slate-600 text-center">Patient Records</span>
          </button>

          <button
            onClick={() => onNavigate('appointment-management')}
            className="flex flex-col items-center gap-1.5 p-3 bg-white hover:bg-slate-50/80 rounded-2xl border border-slate-100 shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all active:scale-95 group outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <Calendar className="w-4.5 h-4.5" />
            </div>
            <span className="text-[9px] font-bold text-slate-600 text-center">Appts Calendar</span>
          </button>
        </div>
      </div>

      {/* Recent Activity List */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-2.5">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Recent Clinic Logs</h4>
        <div className="flex flex-col gap-2.5 text-[11px] text-slate-500">
          <div className="flex gap-2.5 items-start">
            <div className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 shrink-0" />
            <p>New treatment record registered for <strong>Alex Johnson</strong> (Tooth scaling).</p>
          </div>
          <div className="flex gap-2.5 items-start border-t border-slate-50 pt-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
            <p>Patient <strong>Sofia Martinez</strong> requested appointment with Dr. Rostova.</p>
          </div>
          <div className="flex gap-2.5 items-start border-t border-slate-50 pt-2">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
            <p>Dr. James Carter updated status to <strong>"Away"</strong> for clinical leave.</p>
          </div>
        </div>
      </div>

    </div>
  );
};

// ==========================================
// SCREEN 12: MANAGE DENTISTS
// ==========================================
export const ManageDentistsView: React.FC<{
  dentists: Dentist[];
  onAddDentist: (dentist: Dentist) => void;
  onDeleteDentist: (id: string) => void;
  onToggleAvailability: (id: string) => void;
}> = ({ dentists, onAddDentist, onDeleteDentist, onToggleAvailability }) => {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !specialty) return;
    onAddDentist({
      id: 'd_' + Date.now(),
      name,
      specialty,
      rating: 4.8,
      reviewsCount: 1,
      availableToday: true,
      avatarColor: 'bg-[#1976D2]'
    });
    setName('');
    setSpecialty('');
    setShowForm(false);
  };

  return (
    <div className="flex-1 p-5 flex flex-col gap-4 text-slate-800 relative">
      
      {showForm ? (
        <form onSubmit={handleAddSubmit} className="bg-white p-4 rounded-2xl border border-slate-100 flex flex-col gap-3.5 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900">Add New Dental Specialist</h3>
          <M3TextField label="Doctor Full Name" value={name} onChange={(e) => setName(e.target.value)} id="md-name" required />
          <M3TextField label="Specialty Focus" value={specialty} onChange={(e) => setSpecialty(e.target.value)} id="md-spec" required />
          <div className="flex gap-2">
            <button 
              type="button" 
              onClick={() => setShowForm(false)} 
              className="flex-1 py-2 text-xs font-semibold border border-slate-200 hover:bg-slate-50 rounded-full outline-none"
            >
              Cancel
            </button>
            <M3Button type="submit" variant="filled" className="flex-1 !py-2">
              Save Doctor
            </M3Button>
          </div>
        </form>
      ) : (
        <div className="flex flex-col gap-3">
          {dentists.map((d) => (
            <M3Card key={d.id} variant="outlined" className="!p-3.5 flex justify-between items-center relative">
              <div className="flex gap-3 items-center min-w-0">
                <div className={`w-10 h-10 rounded-full ${d.avatarColor} text-white flex items-center justify-center font-bold text-sm shrink-0`}>
                  {d.name.split(' ').slice(1).map(n => n[0]).join('')}
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 leading-tight truncate">{d.name}</h4>
                  <p className="text-[10px] text-slate-500 leading-none mt-1 truncate">{d.specialty}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[9px] text-slate-400 font-bold uppercase leading-none">Status</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-slate-600 font-semibold">{d.availableToday ? 'Active' : 'On Leave'}</span>
                    <M3Switch checked={d.availableToday} onChange={() => onToggleAvailability(d.id)} id={`status-switch-${d.id}`} />
                  </div>
                </div>

                <button 
                  onClick={() => onDeleteDentist(d.id)} 
                  className="p-1.5 text-error-m3 hover:bg-red-50 rounded-full transition-colors outline-none"
                  title="Remove Doctor"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </M3Card>
          ))}
        </div>
      )}

      {/* Admin floating FAB triggers */}
      {!showForm && (
        <div className="absolute bottom-5 right-5 z-40">
          <M3FAB icon={Plus} label="Add Dentist" onClick={() => setShowForm(true)} id="fab-add-dentist" />
        </div>
      )}

    </div>
  );
};

// ==========================================
// SCREEN 13: MANAGE PATIENTS
// ==========================================
export const ManagePatientsView: React.FC<{
  patients: Patient[];
  onSelectPatient: (patient: Patient) => void;
  onNavigate: (screen: ActiveScreen) => void;
}> = ({ patients, onSelectPatient, onNavigate }) => {
  const [search, setSearch] = useState('');

  const filtered = patients.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 p-5 flex flex-col gap-4 text-slate-800">
      
      {/* Search Input */}
      <div className="relative flex items-center">
        <Search className="absolute left-3.5 w-4 h-4 text-slate-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search patient by name or ID..."
          className="w-full text-xs font-medium py-3 pl-10 pr-4 bg-white border border-slate-200 rounded-full outline-none focus:border-primary-m3 text-slate-800"
        />
      </div>

      <div className="flex flex-col gap-3">
        {filtered.map((p) => (
          <M3Card key={p.id} variant="outlined" className="!p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className="text-[9px] bg-blue-50 text-primary-m3 font-bold px-1.5 py-0.5 rounded uppercase leading-none inline-block">
                  Patient ID: {p.id.toUpperCase()}
                </span>
                <h4 className="text-sm font-bold text-slate-900 mt-1">{p.name}</h4>
                <p className="text-xs text-slate-500 leading-tight mt-0.5">{p.phone}</p>
              </div>
              <div className="text-right">
                <span className="text-[9px] text-slate-400 block font-bold uppercase leading-none">Last Clinical Visit</span>
                <span className="text-xs font-bold text-slate-700 block mt-1">{p.lastVisit}</span>
              </div>
            </div>

            <div className="border-t border-slate-50 my-2.5" />

            <div className="flex gap-2 justify-between items-center text-xs">
              <span className="text-slate-400 font-medium">History items: {p.history.length}</span>
              <div className="flex gap-1.5">
                <button
                  onClick={() => {
                    onSelectPatient(p);
                    onNavigate('treatment-registration');
                  }}
                  className="px-3 py-1.5 bg-[#26A69A]/10 text-[#26A69A] hover:bg-[#26A69A]/20 font-bold rounded-lg text-[11px] transition-all outline-none"
                >
                  New Treatment
                </button>
                <button
                  onClick={() => {
                    onSelectPatient(p);
                    onNavigate('treatment-registration');
                  }}
                  className="px-3 py-1.5 bg-primary-container-m3 text-on-primary-container-m3 hover:bg-blue-200 font-bold rounded-lg text-[11px] transition-all outline-none"
                >
                  View History
                </button>
              </div>
            </div>
          </M3Card>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-10 text-slate-500 text-xs">No patients found.</div>
        )}
      </div>

    </div>
  );
};

// ==========================================
// SCREEN 14: APPOINTMENT MANAGEMENT (Admin)
// ==========================================
export const AppointmentManagementView: React.FC<{
  appointments: Appointment[];
  patients: Patient[];
  dentists: Dentist[];
  onUpdateStatus: (id: string, status: AppointmentStatus) => void;
  onAddNewAppointment: (appt: Appointment) => void;
}> = ({ appointments, patients, dentists, onUpdateStatus, onAddNewAppointment }) => {
  const [showModal, setShowModal] = useState(false);
  const [patientName, setPatientName] = useState('Jane Smith');
  const [dentistId, setDentistId] = useState('d1');
  const [date, setDate] = useState('2026-07-20');
  const [time, setTime] = useState('11:00 AM');
  const [reason, setReason] = useState('Gingivitis Assessment');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const doc = dentists.find(d => d.id === dentistId) || dentists[0];
    onAddNewAppointment({
      id: 'appt_' + Date.now(),
      dentistId: doc.id,
      dentistName: doc.name,
      dentistSpecialty: doc.specialty,
      date,
      time,
      patientName,
      reason,
      status: 'Pending',
    });
    setShowModal(false);
  };

  return (
    <div className="flex-1 p-5 flex flex-col gap-4 text-slate-800 relative">
      
      {showModal ? (
        <form onSubmit={handleAddSubmit} className="bg-white p-4 rounded-2xl border border-slate-100 flex flex-col gap-3 shadow-sm z-30">
          <h3 className="text-sm font-bold text-slate-900 mb-1">Schedule New Appointment</h3>
          
          <div className="flex flex-col gap-1 text-xs">
            <label className="font-semibold text-slate-500">Patient Selector</label>
            <select 
              value={patientName} 
              onChange={(e) => setPatientName(e.target.value)} 
              className="w-full p-2.5 bg-white border border-slate-200 rounded-lg outline-none focus:border-primary-m3 text-slate-800 font-sans"
            >
              {patients.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-1 text-xs">
            <label className="font-semibold text-slate-500">Assign Dentist</label>
            <select 
              value={dentistId} 
              onChange={(e) => setDentistId(e.target.value)} 
              className="w-full p-2.5 bg-white border border-slate-200 rounded-lg outline-none focus:border-primary-m3 text-slate-800 font-sans"
            >
              {dentists.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>

          <div className="flex gap-2">
            <M3TextField label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} id="am-date" className="flex-1" />
            <M3TextField label="Time" placeholder="11:00 AM" value={time} onChange={(e) => setTime(e.target.value)} id="am-time" className="flex-1" />
          </div>

          <M3TextField label="Reason for Visit" value={reason} onChange={(e) => setReason(e.target.value)} id="am-reason" />

          <div className="flex gap-2 mt-2">
            <button 
              type="button" 
              onClick={() => setShowModal(false)} 
              className="flex-1 py-2 text-xs font-semibold border border-slate-200 hover:bg-slate-50 rounded-full outline-none"
            >
              Cancel
            </button>
            <M3Button type="submit" variant="filled" className="flex-1 !py-2">
              Save Booking
            </M3Button>
          </div>
        </form>
      ) : (
        <div className="flex flex-col gap-3">
          {/* Calendar visual wrapper */}
          <div className="p-3 bg-white rounded-2xl border border-slate-100 flex items-center justify-between text-xs shadow-sm">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-primary-m3" />
              <span className="font-bold text-slate-800">July 2026 REC CALENDAR</span>
            </div>
            <span className="text-[10px] bg-slate-100 font-semibold text-slate-500 px-2 py-0.5 rounded uppercase">Month View</span>
          </div>

          {/* List of active clinic schedule */}
          <div className="flex flex-col gap-2.5">
            {appointments.map((a) => (
              <M3Card key={a.id} variant="outlined" className="!p-3.5 flex justify-between items-center relative">
                <div className="min-w-0 flex-1 pr-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold text-slate-400">{a.date} at {a.time}</span>
                    <span className="text-[9px] bg-blue-50 text-primary-m3 px-1 rounded uppercase font-bold">{a.dentistName.split(' ')[1]}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 mt-1 truncate">Patient: {a.patientName}</h4>
                  <p className="text-[11px] text-slate-500 truncate leading-none mt-0.5">Reason: {a.reason}</p>
                </div>

                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <M3Badge status={a.status} />
                  <select
                    value={a.status}
                    onChange={(e) => onUpdateStatus(a.id, e.target.value as AppointmentStatus)}
                    className="text-[10px] p-1 border border-slate-200 rounded bg-white outline-none font-bold text-slate-600 font-sans cursor-pointer"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </M3Card>
            ))}
          </div>
        </div>
      )}

      {!showModal && (
        <div className="absolute bottom-5 right-5 z-40">
          <M3FAB icon={Plus} label="New Slot" onClick={() => setShowModal(true)} id="fab-new-appt" />
        </div>
      )}

    </div>
  );
};

// ==========================================
// SCREEN 15: TREATMENT REGISTRATION
// ==========================================
export const TreatmentRegistrationView: React.FC<{
  selectedPatient: Patient | null;
  onSaveTreatment: (patientId: string, record: {
    diagnosis: string;
    treatment: string;
    observations: string;
  }) => void;
}> = ({ selectedPatient, onSaveTreatment }) => {
  const [diagnosis, setDiagnosis] = useState('Mild dental plaque with clinical gingivitis');
  const [treatment, setTreatment] = useState('Professional Scaling & Root Planing with fluoride treatment');
  const [observations, setObservations] = useState('Instructed patient on flossing twice daily. Recommended soft toothbrush.');
  const [success, setSuccess] = useState(false);

  const activePatient = selectedPatient || {
    id: 'p1',
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    phone: '+1 (555) 234-5678',
    lastVisit: '2026-04-12',
    history: []
  };

  const handleSaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveTreatment(activePatient.id, {
      diagnosis,
      treatment,
      observations
    });
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
    }, 3000);
  };

  return (
    <div className="flex-1 p-5 flex flex-col gap-4 text-slate-800">
      
      {/* Patient brief outline card */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-[9px] bg-teal-50 text-teal-700 font-bold px-1.5 py-0.5 rounded uppercase leading-none inline-block">Active Patient</span>
          <h3 className="text-sm font-bold text-slate-900 mt-1">{activePatient.name}</h3>
          <p className="text-xs text-slate-500 mt-0.5">{activePatient.phone}</p>
        </div>
        <div className="text-right">
          <span className="text-[9px] text-slate-400 block font-bold uppercase leading-none">Last visit</span>
          <span className="text-xs font-bold text-slate-700 block mt-1">{activePatient.lastVisit}</span>
        </div>
      </div>

      {success && (
        <div className="bg-teal-50 border border-teal-200 text-teal-800 p-3.5 rounded-xl flex items-center gap-2 text-xs">
          <Check className="w-4 h-4 text-teal-600 shrink-0" />
          <span>Dental treatment successfully saved to clinical timeline!</span>
        </div>
      )}

      {/* Treatment Form */}
      <form onSubmit={handleSaveSubmit} className="flex flex-col gap-4">
        
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">1. Medical Diagnosis</label>
          <textarea
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            placeholder="Diagnosis notes..."
            rows={2}
            className="w-full text-xs font-medium p-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-primary-m3 text-slate-800"
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">2. Clinical Treatment Performed</label>
          <textarea
            value={treatment}
            onChange={(e) => setTreatment(e.target.value)}
            placeholder="Description of treatment..."
            rows={2}
            className="w-full text-xs font-medium p-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-primary-m3 text-slate-800"
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">3. Post-op Observations & Recommendations</label>
          <textarea
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
            placeholder="Additional observation recommendations..."
            rows={2}
            className="w-full text-xs font-medium p-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-primary-m3 text-slate-800"
            required
          />
        </div>

        <M3Button type="submit" variant="filled" className="w-full mt-2" id="save-treatment-btn">
          Save and Notify Patient
        </M3Button>
      </form>

      {/* History timeline brief preview */}
      {activePatient.history && activePatient.history.length > 0 && (
        <div className="mt-2">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Previous Treatment Records</h4>
          <div className="flex flex-col gap-2.5">
            {activePatient.history.map((hist, idx) => (
              <div key={idx} className="bg-white/60 p-3 rounded-xl border border-slate-100 text-xs">
                <span className="text-[10px] text-slate-400 font-bold">{hist.date}</span>
                <p className="mt-1 font-semibold text-slate-800">{hist.treatment}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{hist.diagnosis}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
