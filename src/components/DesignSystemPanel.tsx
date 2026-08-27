/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Palette, 
  Type, 
  Layers, 
  Navigation, 
  Smartphone, 
  User, 
  ShieldCheck, 
  Info, 
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  Code,
  Download,
  BookOpen,
  FileCode
} from 'lucide-react';
import { ActiveScreen } from '../types';
import { KOTLIN_PROJECT_FILES } from './KotlinCodeCatalog';

interface DesignSystemPanelProps {
  activeScreen: ActiveScreen;
  onNavigate: (screen: ActiveScreen) => void;
  userRole: 'patient' | 'admin';
  onChangeRole: (role: 'patient' | 'admin') => void;
}

export const DesignSystemPanel: React.FC<DesignSystemPanelProps> = ({
  activeScreen,
  onNavigate,
  userRole,
  onChangeRole,
}) => {
  const [panelTab, setPanelTab] = useState<'design' | 'kotlin'>('design');
  const [selectedKotlinFileIdx, setSelectedKotlinFileIdx] = useState<number>(0);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  const colors = [
    { name: 'Primary (Medical Blue)', token: 'md.sys.color.primary', hex: '#1976D2', usage: 'Main brand, primary actions, active highlights', bg: 'bg-[#1976D2]', text: 'text-white' },
    { name: 'Secondary (Teal)', token: 'md.sys.color.secondary', hex: '#26A69A', usage: 'Filter chips, secondary metrics, growth actions', bg: 'bg-[#26A69A]', text: 'text-white' },
    { name: 'Background', token: 'md.sys.color.background', hex: '#F8FAFC', usage: 'Android system wallpaper, layout backing', bg: 'bg-[#F8FAFC] border border-slate-700', text: 'text-slate-800' },
    { name: 'Surface', token: 'md.sys.color.surface', hex: '#FFFFFF', usage: 'Cards, bottom nav, dialog backing', bg: 'bg-white border border-slate-300', text: 'text-slate-800' },
    { name: 'Success (Green)', token: 'md.sys.color.success', hex: '#4CAF50', usage: 'Confirmed badges, success validation', bg: 'bg-[#4CAF50]', text: 'text-white' },
    { name: 'Warning (Amber)', token: 'md.sys.color.warning', hex: '#FFC107', usage: 'Pending states, alert messages', bg: 'bg-[#FFC107]', text: 'text-slate-900' },
    { name: 'Error (Red)', token: 'md.sys.color.error', hex: '#F44336', usage: 'Cancelled badges, destructive actions', bg: 'bg-[#F44336]', text: 'text-white' },
  ];

  const typography = [
    { role: 'Display Large', weight: 'Bold', size: '57sp', spacing: '-0.25px', desc: 'Splash title, display indicators' },
    { role: 'Headline Medium', weight: 'SemiBold', size: '28sp', spacing: '0', desc: 'Screen headers, action headers' },
    { role: 'Title Large', weight: 'Medium', size: '22sp', spacing: '0', desc: 'Card headings, list headers' },
    { role: 'Body Large', weight: 'Regular', size: '16sp', spacing: '0.5px', desc: 'Standard paragraphs, user input' },
    { role: 'Label Medium', weight: 'Medium', size: '12sp', spacing: '0.5px', desc: 'Button labels, metadata, chips' },
  ];

  const badges = [
    { status: 'Confirmed', bg: 'bg-[#D1F2EB]', text: 'text-[#0B5345]', border: 'Green' },
    { status: 'Pending', bg: 'bg-[#FEF5E7]', text: 'text-[#7E5109]', border: 'Amber' },
    { status: 'Cancelled', bg: 'bg-[#FADBD8]', text: 'text-[#7B241C]', border: 'Red' },
    { status: 'Completed', bg: 'bg-[#E8F6F3]', text: 'text-[#1B4F72]', border: 'Blue' },
  ];

  const screenGroups = [
    {
      title: '🎬 Onboarding Flows',
      screens: [
        { id: 'splash', name: '1. Splash Screen', role: 'both' },
        { id: 'login', name: '2. Login Screen', role: 'both' },
        { id: 'register', name: '3. Register Screen', role: 'both' },
      ],
    },
    {
      title: '🧑‍⚕️ Patient Portal',
      screens: [
        { id: 'patient-dashboard', name: '4. Patient Home Dashboard', role: 'patient' },
        { id: 'dentist-list', name: '5. Dentist List', role: 'patient' },
        { id: 'book-appointment', name: '6. Book Appointment', role: 'patient' },
        { id: 'appointment-confirmation', name: '7. Appointment Confirmed', role: 'patient' },
        { id: 'my-appointments', name: '8. My Appointments', role: 'patient' },
        { id: 'notifications', name: '9. Notifications', role: 'patient' },
        { id: 'patient-profile', name: '10. Patient Profile', role: 'patient' },
      ],
    },
    {
      title: '⚙️ Administrator Console',
      screens: [
        { id: 'admin-dashboard', name: '11. Administrator Dashboard', role: 'admin' },
        { id: 'manage-dentists', name: '12. Manage Dentists', role: 'admin' },
        { id: 'manage-patients', name: '13. Manage Patients', role: 'admin' },
        { id: 'appointment-management', name: '14. Appointment Management', role: 'admin' },
        { id: 'treatment-registration', name: '15. Treatment Registration', role: 'admin' },
      ],
    },
  ];

  const handleCopyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedColor(hex);
    setTimeout(() => setCopiedColor(null), 1500);
  };

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleScreenSelect = (screenId: string, allowedRole: string) => {
    if (allowedRole === 'admin' && userRole !== 'admin') {
      onChangeRole('admin');
    } else if (allowedRole === 'patient' && userRole !== 'patient') {
      onChangeRole('patient');
    }
    onNavigate(screenId as ActiveScreen);
  };

  const activeKotlinFile = KOTLIN_PROJECT_FILES[selectedKotlinFileIdx];

  return (
    <div className="w-full xl:w-[480px] bg-slate-900 border-r border-slate-800 flex flex-col h-full overflow-y-auto no-scrollbar shrink-0 text-slate-100 select-none">
      
      {/* Header Panel */}
      <div className="p-6 border-b border-slate-800 bg-gradient-to-br from-slate-900 to-slate-850">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 bg-blue-600 rounded-lg text-white">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <span className="text-xs font-bold tracking-widest text-blue-400 uppercase">Android Development</span>
        </div>
        <h2 className="text-2xl font-bold font-sans text-white tracking-tight">DentalCare Android</h2>
        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
          Interactive simulator and full Kotlin Jetpack Compose 3 design system source explorer.
        </p>
      </div>

      {/* Main Feature Tab Switcher */}
      <div className="px-4 py-2 bg-slate-950/80 border-b border-slate-800/60 flex items-center gap-1 shrink-0">
        <button
          onClick={() => setPanelTab('design')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all outline-none
            ${panelTab === 'design'
              ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
              : 'text-slate-400 hover:text-slate-200'}`}
        >
          <Palette className="w-4 h-4" />
          <span>🎨 M3 Specs</span>
        </button>
        <button
          onClick={() => setPanelTab('kotlin')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all outline-none
            ${panelTab === 'kotlin'
              ? 'bg-[#26A69A]/20 text-[#26A69A] border border-[#26A69A]/30'
              : 'text-slate-400 hover:text-[#26A69A]'}`}
        >
          <Code className="w-4 h-4" />
          <span>☕ Kotlin Code</span>
        </button>
      </div>

      {panelTab === 'design' ? (
        <>
          {/* Role Switcher */}
          <div className="p-4 bg-slate-950/60 border-b border-slate-800/80 flex gap-2 items-center justify-between">
            <span className="text-xs font-bold text-slate-400 pl-2">Active Persona:</span>
            <div className="flex bg-slate-900 rounded-full p-1 border border-slate-800">
              <button
                onClick={() => {
                  onChangeRole('patient');
                  if (activeScreen.startsWith('admin-') || activeScreen === 'treatment-registration' || activeScreen === 'manage-dentists' || activeScreen === 'manage-patients') {
                    onNavigate('patient-dashboard');
                  }
                }}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all outline-none
                  ${userRole === 'patient' 
                    ? 'bg-[#1976D2] text-white shadow' 
                    : 'text-slate-400 hover:text-slate-200'}`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Patient</span>
              </button>
              <button
                onClick={() => {
                  onChangeRole('admin');
                  if (!activeScreen.startsWith('admin-') && activeScreen !== 'treatment-registration' && activeScreen !== 'manage-dentists' && activeScreen !== 'manage-patients' && !['splash', 'login', 'register'].includes(activeScreen)) {
                    onNavigate('admin-dashboard');
                  }
                }}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all outline-none
                  ${userRole === 'admin' 
                    ? 'bg-[#26A69A] text-white shadow' 
                    : 'text-slate-400 hover:text-slate-200'}`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin</span>
              </button>
            </div>
          </div>

          {/* Design system controls */}
          <div className="p-5 flex flex-col gap-6">

            {/* SECTION A: SCREEN SELECTOR (Primary Interactive Core) */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Navigation className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Quick Screen Navigator (15 Screens)</span>
              </div>
              
              <div className="flex flex-col gap-4">
                {screenGroups.map((group, gIdx) => (
                  <div key={gIdx} className="bg-slate-950/40 rounded-xl p-3 border border-slate-800/60">
                    <h4 className="text-xs font-bold text-slate-300 mb-2">{group.title}</h4>
                    <div className="flex flex-col gap-1.5">
                      {group.screens.map((screen) => {
                        const isSelected = activeScreen === screen.id;
                        return (
                          <button
                            key={screen.id}
                            onClick={() => handleScreenSelect(screen.id, screen.role)}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-left transition-all outline-none
                              ${isSelected 
                                ? 'bg-blue-600/15 text-blue-300 border border-blue-500/30 font-semibold scale-[1.01]' 
                                : 'hover:bg-slate-800/80 text-slate-400 border border-transparent'}`}
                          >
                            <div className="flex items-center gap-2">
                              <Smartphone className={`w-3.5 h-3.5 ${isSelected ? 'text-blue-400' : 'text-slate-500'}`} />
                              <span>{screen.name}</span>
                            </div>
                            {screen.role === 'admin' && (
                              <span className="text-[9px] bg-teal-950 text-teal-400 border border-teal-800 px-1.5 py-0.5 rounded font-bold uppercase scale-90">Admin</span>
                            )}
                            {screen.role === 'patient' && (
                              <span className="text-[9px] bg-blue-950 text-blue-400 border border-blue-900 px-1.5 py-0.5 rounded font-bold uppercase scale-90">Patient</span>
                            )}
                            {isSelected && (
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION B: COLOR PALETTE */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Palette className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Color Palette (M3 Specs)</span>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {colors.map((color, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center justify-between p-2.5 bg-slate-950/30 rounded-xl border border-slate-800/80 hover:bg-slate-950/60 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg ${color.bg} flex items-center justify-center shrink-0 shadow-inner`}>
                        <span className="text-[9px] font-bold opacity-0 group-hover:opacity-100 transition-opacity text-slate-800 font-bold">M3</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white leading-none mb-0.5">{color.name}</p>
                        <p className="text-[10px] text-slate-500 leading-none truncate mb-1">{color.token}</p>
                        <p className="text-[10px] text-slate-400 leading-tight italic">{color.usage}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleCopyHex(color.hex)}
                      className="p-1.5 rounded bg-slate-850 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors relative outline-none"
                      title="Copy Hex"
                    >
                      {copiedColor === color.hex ? (
                        <Check className="w-3.5 h-3.5 text-green-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION C: TYPOGRAPHY SCALE */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Type className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Typography Scale</span>
              </div>
              <div className="bg-slate-950/30 rounded-xl border border-slate-800/80 p-3 flex flex-col gap-3">
                {typography.map((type, idx) => (
                  <div key={idx} className="border-b border-slate-800/60 last:border-none pb-2 last:pb-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="text-xs font-bold text-blue-300">{type.role}</span>
                      <span className="text-[10px] font-mono text-slate-500">{type.size} • {type.weight}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-tight">{type.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION D: CLINIC APPOINTMENT STATUS BADGES */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Layers className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Tonal Badges Workflow</span>
              </div>
              <div className="bg-slate-950/30 rounded-xl border border-slate-800/80 p-3.5 grid grid-cols-2 gap-2.5">
                {badges.map((badge, idx) => (
                  <div key={idx} className="flex flex-col gap-1 items-center justify-center p-2 rounded-lg bg-slate-900 border border-slate-800/80">
                    <span className={`inline-flex items-center px-2.5 py-1 text-[11px] font-bold rounded-full ${badge.bg} ${badge.text}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1" />
                      {badge.status}
                    </span>
                    <span className="text-[9px] text-slate-500 text-center mt-1">
                      M3 {badge.border} Tonal
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION E: DESIGN PRINCIPLES BRIEF */}
            <div className="bg-blue-950/30 border border-blue-900/60 rounded-xl p-3.5">
              <div className="flex items-start gap-2.5">
                <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-xs font-bold text-white mb-1">Material Design 3 Logic</h5>
                  <p className="text-[10px] text-slate-300 leading-relaxed">
                    DentalCare uses a healthcare-oriented aesthetic. Rounded corners (16dp to 24dp) are applied to cards to deliver a soft, friendly, and professional clinical atmosphere. Large rounded squares (28dp) are implemented for FAB triggers.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </>
      ) : (
        /* KOTLIN EXPLORER */
        <div className="p-5 flex flex-col gap-4 animate-fade-in select-text">
          
          {/* File Selector Tabs */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FileCode className="w-4 h-4 text-[#26A69A]" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Project Structure (Kotlin/Compose)</span>
            </div>
            
            <div className="flex flex-wrap gap-1.5 bg-slate-950/40 p-2 rounded-xl border border-slate-800/80">
              {KOTLIN_PROJECT_FILES.map((file, idx) => {
                const isSelected = selectedKotlinFileIdx === idx;
                return (
                  <button
                    key={file.name}
                    onClick={() => {
                      setSelectedKotlinFileIdx(idx);
                      setCopiedCode(false);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all outline-none cursor-pointer
                      ${isSelected
                        ? 'bg-[#26A69A] text-white shadow font-bold scale-[1.02]'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'}`}
                  >
                    {file.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Current File Metadata */}
          <div className="bg-slate-950/30 rounded-xl p-4 border border-slate-800/80 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-teal-400">{activeKotlinFile.path}</span>
              <span className="text-[10px] bg-[#26A69A]/10 text-[#26A69A] border border-[#26A69A]/30 px-2 py-0.5 rounded font-bold uppercase font-mono">
                {activeKotlinFile.language}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              {activeKotlinFile.description}
            </p>
          </div>

          {/* Code Viewer Container */}
          <div className="relative rounded-xl border border-slate-800 bg-slate-950/90 overflow-hidden flex flex-col min-h-[350px]">
            
            {/* Code Bar Header */}
            <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400 select-none">Kotlin Source Editor</span>
              <button
                onClick={() => handleCopyCode(activeKotlinFile.code)}
                className="flex items-center gap-1.5 px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 hover:text-white transition-colors outline-none cursor-pointer"
              >
                {copiedCode ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-green-400" />
                    <span className="text-green-400 font-semibold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>

            {/* Code Lines scroll wrapper */}
            <div className="p-4 overflow-auto max-h-[350px] no-scrollbar font-mono text-xs text-slate-300 select-text bg-[#090D16]">
              <pre className="whitespace-pre overflow-x-auto text-[11px] leading-relaxed select-text no-scrollbar">
                <code>
                  {activeKotlinFile.code}
                </code>
              </pre>
            </div>
          </div>

          {/* Android Studio Configuration Sheet */}
          <div className="bg-[#26A69A]/5 border border-[#26A69A]/20 rounded-xl p-4 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4.5 h-4.5 text-[#26A69A]" />
              <h5 className="text-xs font-bold text-white">How to run this in Android Studio:</h5>
            </div>
            <ol className="list-decimal list-inside text-[11px] text-slate-300 space-y-2 leading-relaxed pl-1">
              <li>Open Android Studio and click <strong>New Project</strong>.</li>
              <li>Select the <strong>Empty Activity</strong> (Jetpack Compose) template.</li>
              <li>Set Application Name to <strong className="text-[#26A69A]">DentalCare App</strong> and Package Name to <strong className="text-[#26A69A]">com.example.dentalcare</strong>.</li>
              <li>Replace files inside the <code className="bg-slate-950 px-1 py-0.5 rounded font-mono text-[9px]">app/src/main/java/com/example/dentalcare/</code> structure with these corresponding Kotlin sources.</li>
              <li>Make sure to apply the dependencies inside your <code className="bg-slate-950 px-1 py-0.5 rounded font-mono text-[9px]">app/build.gradle.kts</code> file.</li>
              <li>Sync Gradle and hit <strong>Run</strong> to deploy on an emulator or Android device!</li>
            </ol>
          </div>
        </div>
      )}

    </div>
  );
};

