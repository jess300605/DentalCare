/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { AppointmentStatus } from '../types';

// ==========================================
// 1. BUTTONS (Material Design 3 Specs)
// ==========================================
interface M3ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'filled' | 'tonal' | 'outlined' | 'text';
  icon?: LucideIcon;
  id?: string;
}

export const M3Button: React.FC<M3ButtonProps> = ({
  children,
  variant = 'filled',
  icon: Icon,
  className = '',
  id,
  ...props
}) => {
  const baseStyle = "relative flex items-center justify-center gap-2 px-6 py-3 font-sans font-medium text-sm transition-all duration-200 outline-none select-none disabled:opacity-40 disabled:pointer-events-none active:scale-[0.98]";
  
  const variants = {
    filled: "bg-primary-m3 text-white rounded-full hover:bg-blue-700 hover:shadow-md focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white",
    tonal: "bg-primary-container-m3 text-on-primary-container-m3 rounded-full hover:bg-blue-200 hover:shadow-sm focus:ring-2 focus:ring-blue-300",
    outlined: "bg-transparent border border-outline-m3 text-primary-m3 rounded-full hover:bg-slate-50 active:bg-slate-100 focus:ring-2 focus:ring-blue-400",
    text: "bg-transparent text-primary-m3 rounded-full hover:bg-blue-50 active:bg-blue-100 px-4",
  };

  return (
    <button
      id={id}
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4" />}
      <span>{children}</span>
    </button>
  );
};

// ==========================================
// 2. CARDS (Material Design 3 Specs)
// ==========================================
interface M3CardProps {
  variant?: 'elevated' | 'outlined' | 'tonal';
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
  id?: string;
}

export const M3Card: React.FC<M3CardProps> = ({
  variant = 'elevated',
  className = '',
  onClick,
  children,
  id,
}) => {
  const baseStyle = "rounded-[24px] p-5 transition-all duration-200";
  
  const variants = {
    elevated: "bg-white text-slate-800 shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] border border-slate-100",
    outlined: "bg-white text-slate-800 border border-slate-200 hover:bg-slate-50/50",
    tonal: "bg-slate-50 text-slate-800 border-none hover:bg-slate-100/80",
  };

  return (
    <div
      id={id}
      onClick={onClick}
      className={`${baseStyle} ${variants[variant]} ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  );
};

// ==========================================
// 3. TEXT FIELDS (Material Design 3 Specs)
// ==========================================
interface M3TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  leadingIcon?: LucideIcon;
  trailingIcon?: LucideIcon;
  onTrailingIconClick?: () => void;
  trailingElement?: React.ReactNode;
  error?: string;
  id?: string;
}

export const M3TextField: React.FC<M3TextFieldProps> = ({
  label,
  leadingIcon: LeadingIcon,
  trailingIcon: TrailingIcon,
  onTrailingIconClick,
  trailingElement,
  error,
  id,
  className = '',
  ...props
}) => {
  return (
    <div className={`w-full flex flex-col gap-1 ${className}`}>
      <div className="relative flex items-center w-full">
        {LeadingIcon && (
          <div className="absolute left-3.5 text-slate-400">
            <LeadingIcon className="w-5 h-5" />
          </div>
        )}
        <input
          id={id}
          className={`w-full font-sans text-sm rounded-lg border bg-white py-3.5 px-4 outline-none transition-all duration-150
            ${LeadingIcon ? 'pl-11' : ''} 
            ${TrailingIcon || trailingElement ? 'pr-11' : ''}
            ${error 
              ? 'border-error-m3 focus:border-error-m3 focus:ring-1 focus:ring-error-m3' 
              : 'border-slate-300 focus:border-primary-m3 focus:ring-1 focus:ring-primary-m3'
            }
            text-slate-800 placeholder-transparent peer`}
          placeholder={label}
          {...props}
        />
        <label
          htmlFor={props.id || id}
          className={`absolute left-4 bg-white px-1 text-xs font-medium text-slate-500 transition-all duration-150 pointer-events-none
            peer-placeholder-shown:text-sm peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-3.5
            peer-focus:top-[-8px] peer-focus:text-xs peer-focus:text-primary-m3
            ${LeadingIcon ? 'peer-placeholder-shown:left-11' : 'peer-placeholder-shown:left-4'}
            ${error ? 'peer-focus:text-error-m3 text-error-m3' : ''}
            top-[-8px]`}
        >
          {label}
        </label>
        {TrailingIcon && (
          <button
            type="button"
            onClick={onTrailingIconClick}
            tabIndex={-1}
            className={`absolute right-3.5 text-slate-400 hover:text-slate-600 transition-colors ${onTrailingIconClick ? 'cursor-pointer' : 'pointer-events-none'}`}
          >
            <TrailingIcon className="w-5 h-5" />
          </button>
        )}
        {trailingElement && (
          <div className="absolute right-3.5">
            {trailingElement}
          </div>
        )}
      </div>
      {error && (
        <span className="text-xs text-error-m3 px-1 font-roboto font-medium">{error}</span>
      )}
    </div>
  );
};

// ==========================================
// 4. CHIPS (Material Design 3 Specs)
// ==========================================
interface M3ChipProps {
  label: string;
  selected?: boolean;
  onClick?: () => void;
  icon?: LucideIcon;
  id?: string;
}

export const M3Chip: React.FC<M3ChipProps> = ({
  label,
  selected = false,
  onClick,
  icon: Icon,
  id,
}) => {
  return (
    <button
      id={id}
      onClick={onClick}
      className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-full border transition-all duration-150 outline-none select-none active:scale-95
        ${selected
          ? 'bg-primary-m3 text-white border-primary-m3 shadow-sm'
          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
        }`}
    >
      {Icon && <Icon className="w-3.5 h-3.5" />}
      <span>{label}</span>
    </button>
  );
};

// ==========================================
// 5. APPOINTMENT BADGES (Custom Tonal Palettes)
// ==========================================
interface M3BadgeProps {
  status: AppointmentStatus;
  id?: string;
}

export const M3Badge: React.FC<M3BadgeProps> = ({ status, id }) => {
  const styles = {
    Confirmed: {
      bg: 'bg-[#D1F2EB]',
      text: 'text-[#0B5345]',
      label: 'Confirmed'
    },
    Pending: {
      bg: 'bg-[#FEF5E7]',
      text: 'text-[#7E5109]',
      label: 'Pending'
    },
    Cancelled: {
      bg: 'bg-[#FADBD8]',
      text: 'text-[#7B241C]',
      label: 'Cancelled'
    },
    Completed: {
      bg: 'bg-[#E8F6F3]',
      text: 'text-[#1B4F72]',
      label: 'Completed'
    },
  };

  const current = styles[status] || styles.Pending;

  return (
    <span
      id={id}
      className={`inline-flex items-center px-2.5 py-1 text-xs font-bold rounded-full ${current.bg} ${current.text} border-none`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 animate-pulse" />
      {current.label}
    </span>
  );
};

// ==========================================
// 6. FLOATING ACTION BUTTON (M3 FAB Spec)
// ==========================================
interface M3FABProps {
  icon: LucideIcon;
  label?: string;
  onClick?: () => void;
  id?: string;
}

export const M3FAB: React.FC<M3FABProps> = ({ icon: Icon, label, onClick, id }) => {
  return (
    <button
      id={id}
      onClick={onClick}
      className="flex items-center gap-2 p-4 bg-primary-container-m3 text-on-primary-container-m3 hover:bg-blue-200 shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.2)] rounded-[16px] transition-all duration-200 active:scale-95 z-40 outline-none"
    >
      <Icon className="w-6 h-6 text-primary-m3" />
      {label && <span className="text-sm font-semibold text-on-primary-container-m3 pr-1">{label}</span>}
    </button>
  );
};

// ==========================================
// 7. MATERIAL 3 TOGGLE SWITCH
// ==========================================
interface M3SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  id?: string;
}

export const M3Switch: React.FC<M3SwitchProps> = ({ checked, onChange, id }) => {
  return (
    <button
      id={id}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-1 focus:ring-primary-m3
        ${checked ? 'bg-primary-m3' : 'bg-slate-200'}`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out
          ${checked ? 'translate-x-5' : 'translate-x-0'}`}
      />
    </button>
  );
};
