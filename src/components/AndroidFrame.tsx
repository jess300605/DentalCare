/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Wifi, 
  Battery, 
  Signal, 
  ChevronLeft, 
  Menu, 
  User, 
  Bell, 
  Calendar, 
  Home, 
  ShieldAlert, 
  Settings 
} from 'lucide-react';
import { ActiveScreen } from '../types';

interface AndroidFrameProps {
  children: React.ReactNode;
  activeScreen: ActiveScreen;
  onNavigate: (screen: ActiveScreen) => void;
  title?: string;
  showBackButton?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  userRole: 'patient' | 'admin';
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({
  children,
  activeScreen,
  onNavigate,
  title = "DentalCare",
  showBackButton = false,
  onBack,
  rightAction,
  userRole,
}) => {
  // Get time formatted as HH:MM
  const timeStr = "12:30";

  // Check if current screen should hide navigation bars (e.g., splash, login, register)
  const hideBars = ['splash', 'login', 'register', 'appointment-confirmation'].includes(activeScreen);

  // Helper to determine active state of bottom navigation items
  const isNavActive = (screens: ActiveScreen[]) => {
    return screens.includes(activeScreen);
  };

  return (
    <div className="relative w-full max-w-[410px] h-[820px] bg-slate-950 rounded-[50px] p-3.5 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] border-[6px] border-slate-800 flex flex-col overflow-hidden select-none select-none">
      
      {/* 1. Android Camera Cutout (Punch hole) & Ear Speaker */}
      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-slate-950 rounded-full flex items-center justify-center gap-1.5 z-50">
        <div className="w-2.5 h-2.5 bg-slate-900 rounded-full border border-slate-800" />
        <div className="w-12 h-1 bg-slate-800 rounded-full" />
      </div>

      {/* 2. Top Android Status Bar */}
      <div className="h-10 px-6 pt-2 pb-1 bg-white text-slate-800 flex items-center justify-between text-xs font-semibold font-roboto select-none z-40 shrink-0">
        <span className="text-slate-800">{timeStr}</span>
        <div className="flex items-center gap-1.5 text-slate-800">
          <Signal className="w-3.5 h-3.5" />
          <span className="text-[10px] tracking-tighter">5G</span>
          <Wifi className="w-3.5 h-3.5" />
          <Battery className="w-4 h-4" />
        </div>
      </div>

      {/* 3. Material Design 3 Top App Bar */}
      {!hideBars && (
        <div className="h-14 px-4 bg-white text-slate-800 flex items-center justify-between border-b border-slate-100 shrink-0 z-40 select-none">
          <div className="flex items-center gap-2">
            {showBackButton ? (
              <button
                onClick={onBack}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors active:scale-90 outline-none"
              >
                <ChevronLeft className="w-6 h-6 text-slate-800" />
              </button>
            ) : (
              <div className="p-2 text-primary-m3">
                <Settings className="w-5 h-5 animate-spin-slow text-primary-m3" />
              </div>
            )}
            <h1 className="text-lg font-bold font-sans tracking-tight text-slate-800 max-w-[180px] truncate">
              {title}
            </h1>
          </div>
          <div className="flex items-center gap-1">
            {rightAction ? (
              rightAction
            ) : (
              userRole === 'patient' ? (
                <button 
                  onClick={() => onNavigate('patient-profile')} 
                  className="w-8 h-8 rounded-full bg-primary-container-m3 flex items-center justify-center border border-primary-m3/20 overflow-hidden active:scale-95 transition-all outline-none"
                >
                  <User className="w-4 h-4 text-primary-m3" />
                </button>
              ) : (
                <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-1 rounded-full text-[10px] font-bold border border-amber-200">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Admin</span>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* 4. Active Screen Canvas Area */}
      <div className="flex-1 bg-bg-m3 overflow-y-auto no-scrollbar relative flex flex-col">
        {children}
      </div>

      {/* 5. Material Design 3 Bottom Navigation Bar */}
      {!hideBars && (
        <div className="bg-white border-t border-slate-100 py-2.5 px-4 flex justify-around items-center shrink-0 z-40">
          {userRole === 'patient' ? (
            <>
              {/* Home */}
              <button
                onClick={() => onNavigate('patient-dashboard')}
                className="flex flex-col items-center gap-1 outline-none group"
              >
                <div className={`px-5 py-1.5 rounded-full transition-all duration-200 flex items-center justify-center
                  ${isNavActive(['patient-dashboard', 'dentist-list', 'book-appointment']) 
                    ? 'bg-primary-container-m3 text-primary-m3 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-800 group-active:scale-95'}`}
                >
                  <Home className="w-5 h-5" />
                </div>
                <span className={`text-[10px] font-bold tracking-tight transition-colors
                  ${isNavActive(['patient-dashboard', 'dentist-list', 'book-appointment']) 
                    ? 'text-primary-m3' 
                    : 'text-slate-500'}`}
                >
                  Home
                </span>
              </button>

              {/* Appointments */}
              <button
                onClick={() => onNavigate('my-appointments')}
                className="flex flex-col items-center gap-1 outline-none group"
              >
                <div className={`px-5 py-1.5 rounded-full transition-all duration-200 flex items-center justify-center
                  ${isNavActive(['my-appointments']) 
                    ? 'bg-primary-container-m3 text-primary-m3 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-800 group-active:scale-95'}`}
                >
                  <Calendar className="w-5 h-5" />
                </div>
                <span className={`text-[10px] font-bold tracking-tight transition-colors
                  ${isNavActive(['my-appointments']) 
                    ? 'text-primary-m3' 
                    : 'text-slate-500'}`}
                >
                  Appointments
                </span>
              </button>

              {/* Notifications */}
              <button
                onClick={() => onNavigate('notifications')}
                className="flex flex-col items-center gap-1 outline-none group"
              >
                <div className={`px-5 py-1.5 rounded-full transition-all duration-200 flex items-center justify-center relative
                  ${isNavActive(['notifications']) 
                    ? 'bg-primary-container-m3 text-primary-m3 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-800 group-active:scale-95'}`}
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-5 w-2 h-2 rounded-full bg-error-m3 animate-ping" />
                  <span className="absolute top-1 right-5 w-2 h-2 rounded-full bg-error-m3" />
                </div>
                <span className={`text-[10px] font-bold tracking-tight transition-colors
                  ${isNavActive(['notifications']) 
                    ? 'text-primary-m3' 
                    : 'text-slate-500'}`}
                >
                  Alerts
                </span>
              </button>

              {/* Profile */}
              <button
                onClick={() => onNavigate('patient-profile')}
                className="flex flex-col items-center gap-1 outline-none group"
              >
                <div className={`px-5 py-1.5 rounded-full transition-all duration-200 flex items-center justify-center
                  ${isNavActive(['patient-profile']) 
                    ? 'bg-primary-container-m3 text-primary-m3 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-800 group-active:scale-95'}`}
                >
                  <User className="w-5 h-5" />
                </div>
                <span className={`text-[10px] font-bold tracking-tight transition-colors
                  ${isNavActive(['patient-profile']) 
                    ? 'text-primary-m3' 
                    : 'text-slate-500'}`}
                >
                  Profile
                </span>
              </button>
            </>
          ) : (
            // ADMIN BOTTOM NAV
            <>
              {/* Admin Dashboard */}
              <button
                onClick={() => onNavigate('admin-dashboard')}
                className="flex flex-col items-center gap-1 outline-none group"
              >
                <div className={`px-5 py-1.5 rounded-full transition-all duration-200 flex items-center justify-center
                  ${isNavActive(['admin-dashboard']) 
                    ? 'bg-secondary-container-m3 text-on-secondary-container-m3 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-800 group-active:scale-95'}`}
                >
                  <Home className="w-5 h-5" />
                </div>
                <span className={`text-[10px] font-bold tracking-tight transition-colors
                  ${isNavActive(['admin-dashboard']) 
                    ? 'text-teal-700' 
                    : 'text-slate-500'}`}
                >
                  Dashboard
                </span>
              </button>

              {/* Manage Appointments */}
              <button
                onClick={() => onNavigate('appointment-management')}
                className="flex flex-col items-center gap-1 outline-none group"
              >
                <div className={`px-5 py-1.5 rounded-full transition-all duration-200 flex items-center justify-center
                  ${isNavActive(['appointment-management']) 
                    ? 'bg-secondary-container-m3 text-on-secondary-container-m3 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-800 group-active:scale-95'}`}
                >
                  <Calendar className="w-5 h-5" />
                </div>
                <span className={`text-[10px] font-bold tracking-tight transition-colors
                  ${isNavActive(['appointment-management']) 
                    ? 'text-teal-700' 
                    : 'text-slate-500'}`}
                >
                  Appts
                </span>
              </button>

              {/* Manage Patients */}
              <button
                onClick={() => onNavigate('manage-patients', 'treatment-registration' as any)}
                className="flex flex-col items-center gap-1 outline-none group"
              >
                <div className={`px-5 py-1.5 rounded-full transition-all duration-200 flex items-center justify-center
                  ${isNavActive(['manage-patients', 'treatment-registration']) 
                    ? 'bg-secondary-container-m3 text-on-secondary-container-m3 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-800 group-active:scale-95'}`}
                >
                  <User className="w-5 h-5" />
                </div>
                <span className={`text-[10px] font-bold tracking-tight transition-colors
                  ${isNavActive(['manage-patients', 'treatment-registration']) 
                    ? 'text-teal-700' 
                    : 'text-slate-500'}`}
                >
                  Patients
                </span>
              </button>

              {/* Manage Dentists */}
              <button
                onClick={() => onNavigate('manage-dentists')}
                className="flex flex-col items-center gap-1 outline-none group"
              >
                <div className={`px-5 py-1.5 rounded-full transition-all duration-200 flex items-center justify-center
                  ${isNavActive(['manage-dentists']) 
                    ? 'bg-secondary-container-m3 text-on-secondary-container-m3 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-800 group-active:scale-95'}`}
                >
                  <Settings className="w-5 h-5" />
                </div>
                <span className={`text-[10px] font-bold tracking-tight transition-colors
                  ${isNavActive(['manage-dentists']) 
                    ? 'text-teal-700' 
                    : 'text-slate-500'}`}
                >
                  Dentists
                </span>
              </button>
            </>
          )}
        </div>
      )}

      {/* 6. Android Native System Gesture Pill Bar */}
      <div className="h-6 bg-white flex items-center justify-center shrink-0 select-none z-40">
        <div className="w-36 h-1 bg-slate-900 rounded-full" />
      </div>
    </div>
  );
};
