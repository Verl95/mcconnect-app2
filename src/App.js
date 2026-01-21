import React, { useState } from 'react';
import { 
  AlertTriangle, ShieldAlert, Thermometer, Box, PenTool, Monitor, Home, MessageSquare, 
  FileText, User, Bell, Menu, Heart, MessageCircle, Share2, MoreHorizontal, X, LogOut, 
  Settings, Calendar, ExternalLink, Truck, Shirt, Utensils, ChevronLeft, Camera, CheckCircle, 
  Trash2, Lock, Eye, FileCheck, Gavel, ClipboardList, MapPin, Phone, Home as HomeIcon
} from 'lucide-react';

// --- CONFIGURATION ---
const BRAND = { red: '#DA291C', yellow: '#FFC72C', dark: '#292929', grey: '#F5F5F7', white: '#FFFFFF' };

const BODY_ZONES = [
  { id: 'Head', t: '5%', l: '50%', w: 50, h: 50, x: '-50%', round: true },
  { id: 'Torso', t: '20%', l: '50%', w: 60, h: 100, x: '-50%', round: false },
  { id: 'L-Arm', t: '20%', l: '30%', w: 30, h: 80, x: '0', round: true },
  { id: 'R-Arm', t: '20%', r: '30%', w: 30, h: 80, x: '0', round: true },
  { id: 'L-Hand', t: '42%', l: '24%', w: 30, h: 30, x: '0', round: true },
  { id: 'R-Hand', t: '42%', r: '24%', w: 30, h: 30, x: '0', round: true },
  { id: 'L-Leg', t: '48%', l: '38%', w: 40, h: 100, x: '0', round: true },
  { id: 'R-Leg', t: '48%', r: '38%', w: 40, h: 100, x: '0', round: true },
  { id: 'L-Foot', t: '75%', l: '35%', w: 40, h: 30, x: '0', round: true },
  { id: 'R-Foot', t: '75%', r: '35%', w: 40, h: 30, x: '0', round: true },
];

// --- MAIN COMPONENT ---
export default function App() {
  const [activeTab, setActiveTab] = useState('Home');
  const [currentView, setCurrentView] = useState('Dashboard');
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  
  // SHARED STATE (Database)
  const [reports, setReports] = useState([]);

  const handleNav = (tab) => { 
    setActiveTab(tab); 
    setCurrentView('Dashboard'); 
    setMenuOpen(false); 
    setNotifOpen(false); 
  };

  const addNewReport = (newReport) => {
    setReports([newReport, ...reports]);
    setCurrentView('Dashboard');
    alert("Report Submitted Successfully to Compliance Hub");
  };

  // NEW: Function to update a report's status (Used by Manager)
  const handleUpdateReport = (id, updates) => {
    setReports(prevReports => 
      prevReports.map(report => 
        report.id === id ? { ...report, ...updates } : report
      )
    );
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#F5F5F7] font-sans antialiased text-gray-900 overflow-hidden relative">
      
      {/* HEADER */}
      <header className="flex-none shadow-md z-30 bg-[#DA291C] relative">
        <div className="flex justify-between items-center px-5 py-4">
          <div className="flex items-center gap-3">
            {(currentView !== 'Dashboard' && activeTab === 'Report') && (
              <button onClick={() => setCurrentView('Dashboard')} className="text-white">
                <ChevronLeft size={24} />
              </button>
            )}
            <div>
              <h1 className="text-white font-extrabold text-2xl tracking-tight">McConnect</h1>
              <p className="text-white text-xs opacity-90 font-medium">Store #1318 • Skelmersdale</p>
            </div>
          </div>
          <div className="flex gap-3">
             <HeaderBtn icon={<Bell size={20} />} onClick={() => setNotifOpen(!notifOpen)} hasBadge />
             <HeaderBtn icon={menuOpen ? <X size={20} /> : <Menu size={20} />} onClick={() => setMenuOpen(!menuOpen)} />
          </div>
        </div>
        <div className="h-1.5 w-full bg-[#FFC72C]"></div>
      </header>

      {/* OVERLAYS */}
      {notifOpen && <NotificationDropdown />}
      {menuOpen && <SideMenu close={() => setMenuOpen(false)} onManagerClick={() => { setMenuOpen(false); handleNav('Manager'); }} />}

      {/* CONTENT AREA */}
      <main className="flex-1 overflow-y-auto pb-32" onClick={() => { setMenuOpen(false); setNotifOpen(false); }}>
        
        {activeTab === 'Home' && <HomeFeed />}
        
        {/* REPORTING FLOW */}
        {activeTab === 'Report' && currentView === 'Dashboard' && (
          <ReportingGrid onSelect={(cat) => cat === 'Accident' && setCurrentView('AccidentForm')} />
        )}
        {activeTab === 'Report' && currentView === 'AccidentForm' && (
          <AccidentForm onSubmit={addNewReport} />
        )}

        {/* MANAGER PORTAL FLOW */}
        {activeTab === 'Manager' && (
          <ManagerPortal 
            reports={reports} 
            onUpdateReport={handleUpdateReport} 
          />
        )}

        {activeTab === 'Chat' && <Placeholder title="Team Chat" icon={<MessageSquare size={48} />} />}
        {activeTab === 'Profile' && <Placeholder title="My Profile" icon={<User size={48} />} />}
      </main>

      {/* BOTTOM NAVIGATION */}
      <nav className="fixed bottom-0 w-full z-30 bg-white/95 backdrop-blur-md border-t border-gray-200" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="flex justify-around items-end h-16 w-full max-w-md mx-auto relative">
          <NavBtn icon={<Home size={24} />} label="Home" active={activeTab === 'Home'} onClick={() => handleNav('Home')} />
          <div className="relative -top-5">
            <button 
              onClick={() => handleNav('Report')} 
              className="h-14 w-14 rounded-full shadow-lg flex items-center justify-center transform active:scale-95 transition-all text-white bg-[#DA291C]"
            >
              <FileText size={24} strokeWidth={2.5} />
            </button>
          </div>
          <NavBtn icon={<MessageSquare size={24} />} label="Chat" active={activeTab === 'Chat'} onClick={() => handleNav('Chat')} />
        </div>
        <div className="h-6 w-full bg-transparent"></div>
      </nav>

    </div>
  );
}

// --- MANAGER PORTAL (SECURE SECTION) ---
const ManagerPortal = ({ reports, onUpdateReport }) => {
  const [isAuth, setIsAuth] = useState(false);
  const [pin, setPin] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);

  const handleLogin = () => {
    if (pin === '1318') setIsAuth(true);
    else alert('Invalid Manager PIN');
  };

  const handleSignOff = () => {
    // 1. Update the report status in the main App state
    onUpdateReport(selectedReport.id, { 
      status: 'Closed',
      closedDate: new Date().toLocaleDateString()
    });

    // 2. Alert and close the view
    alert(`Case #${selectedReport.id} has been signed off and closed.`);
    setSelectedReport(null);
  };

  if (!isAuth) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 space-y-6">
        <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center"><Lock size={40} className="text-gray-500" /></div>
        <div className="text-center"><h2 className="text-2xl font-bold text-gray-900">Manager Access</h2><p className="text-sm text-gray-500">Restricted to Salaried & Business Managers.</p></div>
        <input type="password" maxLength="4" className="text-center text-3xl tracking-widest w-48 p-3 border-2 border-gray-300 rounded-xl focus:border-red-600 outline-none" placeholder="PIN" value={pin} onChange={(e) => setPin(e.target.value)} />
        <button onClick={handleLogin} className="w-48 bg-[#DA291C] text-white font-bold py-3 rounded-xl shadow-lg">Access Portal</button>
      </div>
    );
  }

  if (!selectedReport) {
    return (
      <div className="p-4">
        <div className="flex justify-between items-center mb-6"><h2 className="text-xl font-bold text-gray-900 flex items-center gap-2"><ShieldAlert className="text-red-600" /> Compliance Hub</h2><span className="text-xs bg-gray-200 px-2 py-1 rounded text-gray-600 font-bold">Secure</span></div>
        <div className="space-y-3">
          {reports.length === 0 ? <div className="text-center text-gray-400 py-10">No new reports submitted.</div> : reports.map(r => (
            <button key={r.id} onClick={() => setSelectedReport(r)} className="w-full bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex justify-between items-center hover:bg-gray-50 transition-colors">
              <div className="text-left">
                <div className="flex items-center gap-2 mb-1"><span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${r.status === 'Closed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{r.status}</span><span className="text-xs text-gray-400">#{r.id}</span></div>
                <h4 className="font-bold text-sm text-gray-900">{r.injury}</h4>
                <p className="text-xs text-gray-500">{r.fullName} ({r.role}) • {r.date}</p>
              </div>
              <ChevronLeft className="rotate-180 text-gray-300" />
            </button>
          ))}
        </div>
      </div>
    );
  }

  // DETAILED REVIEW
  return (
    <div className="p-4 pb-20">
      <button onClick={() => setSelectedReport(null)} className="flex items-center gap-1 text-sm font-bold text-gray-500 mb-4"><ChevronLeft size={16} /> Back to List</button>
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 p-4 border-b border-gray-100">
          <div className="flex justify-between items-start">
            <div><h2 className="text-lg font-bold text-gray-900">Incident #{selectedReport.id}</h2><p className="text-xs text-gray-500">{selectedReport.date} at {selectedReport.time}</p></div>
            {selectedReport.riddor && <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded">RIDDOR</span>}
          </div>
        </div>

        <div className="p-5 space-y-4">
          
          {/* PERSONAL DETAILS SECTION */}
          <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
            <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Personal Details</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm"><span className="text-gray-500">Full Name:</span> <span className="font-bold">{selectedReport.fullName}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">Role:</span> <span className="font-bold">{selectedReport.role}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">Contact:</span> <span className="font-bold">{selectedReport.contact}</span></div>
              <div className="text-sm mt-1"><span className="text-gray-500 block">Address:</span> <span className="font-medium block mt-1 text-xs text-gray-800 bg-white p-2 rounded border border-gray-200">{selectedReport.address}</span></div>
            </div>
          </div>

          <div><p className="label">Location</p><p className="val">{selectedReport.location}</p></div>
          <div><p className="label">Body Zones</p><div className="flex flex-wrap gap-1 mt-1">{selectedReport.parts.map(p => <span key={p} className="bg-red-50 text-red-700 text-xs px-2 py-1 rounded font-bold">{p}</span>)}</div></div>
          
          <div>
            <p className="label">Description</p>
            <p className="val bg-gray-50 p-3 rounded-lg text-sm leading-relaxed border border-gray-100">{selectedReport.description || "No description provided."}</p>
          </div>

          <div>
             <p className="label">Evidence Submitted</p>
             {selectedReport.evidence ? (
               <div className="mt-2 rounded-xl overflow-hidden border border-gray-200"><img src={selectedReport.evidence} alt="Evidence" className="w-full h-48 object-cover" /></div>
             ) : (
               <p className="text-xs text-gray-400 italic mt-1">No photo evidence attached.</p>
             )}
          </div>
        </div>

        {/* MANAGER ACTION SECTION */}
        {selectedReport.status !== 'Closed' ? (
          <div className="bg-blue-50 p-5 border-t border-blue-100">
            <h3 className="font-bold text-blue-900 flex items-center gap-2 mb-4"><Gavel size={18} /> Manager Investigation</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                {['Witness Statements Taken', 'CCTV Footage Saved', 'Risk Assessment Reviewed'].map(item => (
                  <label key={item} className="flex items-center gap-3 bg-white p-3 rounded-lg border border-blue-100">
                    <input type="checkbox" className="w-5 h-5 accent-blue-600" />
                    <span className="text-sm font-medium text-gray-700">{item}</span>
                  </label>
                ))}
              </div>
              <div>
                <label className="text-xs font-bold text-blue-800 uppercase mb-1 block">Investigation Findings</label>
                <textarea className="w-full p-3 text-sm border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none min-h-[80px]" placeholder="Corrective actions taken..."></textarea>
              </div>
              
              {/* FUNCTIONAL SIGN OFF BUTTON */}
              <button 
                onClick={handleSignOff}
                className="w-full bg-green-600 text-white font-bold py-3 rounded-xl shadow-md flex items-center justify-center gap-2 active:scale-95 transition-transform"
              >
                <FileCheck size={18} /> Sign Off & Close Case
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-green-50 p-5 border-t border-green-100 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-2">
              <FileCheck size={24} className="text-green-600" />
            </div>
            <h3 className="font-bold text-green-800">Case Closed</h3>
            <p className="text-sm text-green-700">Signed off on {selectedReport.closedDate || 'Unknown Date'}</p>
          </div>
        )}

      </div>
    </div>
  );
};

// --- ACCIDENT FORM (UPDATED WITH PERSONAL DETAILS & LOCATION INPUT) ---
const AccidentForm = ({ onSubmit }) => {
  const [step, setStep] = useState(1);
  const [parts, setParts] = useState([]);
  
  // Data State
  const [role, setRole] = useState('');
  const [fullName, setFullName] = useState('');
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');
  const [location, setLocation] = useState(''); 
  
  const [injury, setInjury] = useState('');
  const [description, setDescription] = useState('');
  const [evidence, setEvidence] = useState(null);
  
  const togglePart = (id) => setParts(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);

  const handleImg = (e) => {
    if(e.target.files[0]) setEvidence(URL.createObjectURL(e.target.files[0]));
  };

  const handleFinalSubmit = () => {
    const newReport = {
      id: Math.floor(Math.random() * 1000) + 200,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      role: role || 'Unknown',
      fullName: fullName || 'Unknown',
      contact: contact || 'N/A',
      address: address || 'N/A',
      location: location || 'Unknown',
      injury: injury || 'Unspecified Injury',
      parts: parts,
      description: description,
      evidence: evidence,
      status: 'New',
      riddor: false
    };
    onSubmit(newReport);
  };

  return (
    <div className="p-4 animation-fade-in">
      <div className="flex gap-2 mb-6">{[1, 2, 3].map(i => <div key={i} className={`h-2 flex-1 rounded-full ${step >= i ? 'bg-red-600' : 'bg-gray-200'}`} />)}</div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 bg-gray-50 border-b flex items-center gap-3"><AlertTriangle className="text-red-600" size={24} /><h2 className="font-bold text-gray-900">Accident Record</h2></div>
        
        <div className="p-5 space-y-6">
          {step === 1 && (
            <>
              {/* ROLE INPUT (TEXT BOX) */}
              <div>
                <label className="label-header">Person Involved (Role)</label>
                <input type="text" className="input-field" placeholder="E.g. Crew Member, Contractor, Customer..." onChange={(e) => setRole(e.target.value)} />
              </div>

              {/* PERSONAL DETAILS INPUTS */}
              <div className="space-y-4 border-t border-gray-100 pt-4">
                <div>
                   <label className="label-header">Full Name</label>
                   <input type="text" className="input-field" placeholder="First and Last Name" onChange={(e) => setFullName(e.target.value)} />
                </div>
                <div>
                   <label className="label-header">Contact Number</label>
                   <input type="tel" className="input-field" placeholder="07XXX XXXXXX" onChange={(e) => setContact(e.target.value)} />
                </div>
                <div>
                   <label className="label-header">Address</label>
                   <textarea className="input-field min-h-[60px]" placeholder="Full postal address..." onChange={(e) => setAddress(e.target.value)} />
                </div>
              </div>

              {/* LOCATION INPUT (TEXT BOX) */}
              <div className="pt-2">
                <label className="label-header">Accident Location</label>
                <input type="text" className="input-field" placeholder="E.g. Walkway between Vat 1 and Grill 2..." onChange={(e) => setLocation(e.target.value)} />
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <label className="label-header">Body Map</label>
                <div className="relative h-[400px] bg-gray-100 rounded-xl border flex justify-center overflow-hidden">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/c/c2/Human_body_silhouette.svg" className="h-[350px] opacity-20 mt-6" alt="body" />
                  {BODY_ZONES.map(z => (
                    <button key={z.id} onClick={() => togglePart(z.id)} 
                      className={`absolute border-2 transition-colors ${z.round ? 'rounded-full' : 'rounded-xl'} ${parts.includes(z.id) ? 'bg-red-500/70 border-red-600 z-20' : 'border-dashed border-gray-400 hover:bg-red-100/50 z-10'}`}
                      style={{ top: z.t, left: z.l, right: z.r, width: z.w, height: z.h, transform: z.x ? `translateX(${z.x})` : 'none' }} />
                  ))}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">{parts.map(p => <span key={p} className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">{p}</span>)}</div>
              </div>
              <div><label className="label-header">Type of Injury</label><input type="text" className="input-field" placeholder="E.g. Deep cut on thumb..." onChange={(e) => setInjury(e.target.value)} /></div>
            </>
          )}

          {step === 3 && (
            <>
              <div><label className="label-header">Description</label><textarea className="input-field min-h-[100px]" placeholder="Describe what happened..." onChange={(e) => setDescription(e.target.value)} /></div>
              <div>
                <label className="label-header">Evidence</label>
                {!evidence ? (
                  <label className="w-full p-6 bg-yellow-50 border-2 border-dashed border-yellow-300 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer active:bg-yellow-100">
                    <input type="file" accept="image/*" className="hidden" onChange={handleImg} />
                    <Camera className="text-yellow-700" size={32} /><span className="text-xs font-bold text-yellow-800">Tap to Upload Photo</span>
                  </label>
                ) : (
                  <div className="relative h-48 bg-black rounded-xl overflow-hidden border border-gray-200">
                    <img src={evidence} className="w-full h-full object-cover" alt="evidence" />
                    <button onClick={() => setEvidence(null)} className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full shadow-lg"><Trash2 size={16}/></button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <div className="p-4 bg-gray-50 border-t flex justify-between">
          {step > 1 ? <button onClick={() => setStep(step - 1)} className="font-bold text-gray-500 px-4 py-2">Back</button> : <div/>}
          <button onClick={() => step < 3 ? setStep(step + 1) : handleFinalSubmit()} className={`px-8 py-3 text-white font-bold rounded-xl shadow-lg transition-transform active:scale-95 flex items-center gap-2 ${step < 3 ? 'bg-red-600' : 'bg-green-600'}`}>
            {step < 3 ? 'Next' : <><CheckCircle size={18}/> Submit</>}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- REPORTING GRID ---
const ReportingGrid = ({ onSelect }) => {
  const [overlay, setOverlay] = useState(null);
  const categories = [
    { id: 1, title: "Accident", sub: "Injury", icon: <AlertTriangle size={32} />, isUrgent: true },
    { id: 2, title: "Incident", sub: "Security", icon: <ShieldAlert size={32} />, isUrgent: true },
    { id: 3, title: "Sickness", sub: "Absence", icon: <Thermometer size={32} />, isUrgent: false },
    { id: 4, title: "Stock", sub: "Supplies", icon: <Box size={32} />, isUrgent: false, hasSubMenu: true },
    { id: 5, title: "Equipment", sub: "Fix", icon: <PenTool size={32} />, isUrgent: false },
    { id: 6, title: "IT Help", sub: "Tech", icon: <Monitor size={32} />, isUrgent: false }
  ];
  return (
    <div className="px-5 pt-6">
      <div className="mb-6"><h2 className="text-xl font-bold text-gray-900">Reporting Hub</h2><p className="text-gray-500 text-sm mt-1">Select a category.</p></div>
      <div className="grid grid-cols-2 gap-4">
        {categories.map(item => (
          <button key={item.id} onClick={() => item.hasSubMenu ? setOverlay('Stock') : onSelect(item.title)} className={`relative flex flex-col items-start justify-between p-4 rounded-2xl shadow-sm bg-white overflow-hidden aspect-square text-left transition-transform active:scale-95 ${item.isUrgent ? 'border-2 border-red-600' : 'border border-transparent'}`}>
            {item.isUrgent && <div className="absolute inset-0 opacity-5 bg-red-500 pointer-events-none" />}
            <div className={`p-3 rounded-xl mb-2 flex items-center justify-center ${item.isUrgent ? 'bg-red-50 text-[#DA291C]' : 'bg-gray-50 text-[#292929]'}`}>{item.icon}</div>
            <div><span className="block font-bold text-lg leading-tight text-gray-900">{item.title}</span><span className="text-xs text-gray-500 font-medium">{item.sub}</span></div>
          </button>
        ))}
      </div>
      {overlay === 'Stock' && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm" onClick={() => setOverlay(null)}></div>
          <div className="relative z-10 flex flex-col gap-6 items-center w-full max-w-sm animate-bounce-in">
            <h3 className="text-white font-bold text-xl">Select Stock Type</h3>
            <div className="flex flex-wrap justify-center gap-6">
              <Bubble label="Martin Brower" icon={<Truck size={32} />} color="#DA291C" />
              <Bubble label="H+K" icon={<Utensils size={32} />} color="#FFC72C" txt="#292929" />
              <Bubble label="Uniform" icon={<Shirt size={32} />} color="#292929" />
            </div>
            <button onClick={() => setOverlay(null)} className="mt-8 bg-white/20 text-white rounded-full p-2 hover:bg-white/30"><X size={24} /></button>
          </div>
        </div>
      )}
    </div>
  );
};

// --- HOME FEED ---
const HomeFeed = () => {
  const posts = [
    { id: 1, author: "Sarah Peeney", role: "Business Manager", time: "2h ago", content: "Great job on OEPE!", likes: 14, comments: 3 },
    { id: 2, author: "Lewis Evans", role: "Crew Trainer", time: "4h ago", content: "Cover my shift Friday?", likes: 2, comments: 5, tag: "Shift Swap" }
  ];
  return (
    <div className="px-4 pt-4 space-y-4">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-3">
        <div className="h-10 w-10 rounded-full bg-gray-200" />
        <div className="flex-1 bg-gray-50 rounded-full h-10 flex items-center px-4 text-gray-400 text-sm">Share an update...</div>
      </div>
      {posts.map(p => (
        <div key={p.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-3">
             <div className="flex gap-3">
               <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center font-bold text-yellow-800 text-sm">{p.author[0]}</div>
               <div><h3 className="font-bold text-sm text-gray-900">{p.author}</h3><p className="text-xs text-gray-400">{p.role}</p></div>
             </div>
             <MoreHorizontal size={20} className="text-gray-300" />
          </div>
          <p className="text-sm text-gray-800 mb-3">{p.tag && <span className="bg-red-100 text-red-700 text-[10px] font-bold px-1 rounded mr-2">URGENT</span>}{p.content}</p>
          <div className="flex gap-4 border-t border-gray-50 pt-3">
            <button className="flex items-center gap-1 text-gray-400 text-xs font-bold"><Heart size={18} /> {p.likes}</button>
            <button className="flex items-center gap-1 text-gray-400 text-xs font-bold"><MessageCircle size={18} /> {p.comments}</button>
          </div>
        </div>
      ))}
    </div>
  );
};

// --- SIDE MENU ---
const SideMenu = ({ close, onManagerClick }) => (
  <div className="absolute inset-0 z-40 flex">
    <div className="flex-1 bg-black bg-opacity-50" onClick={close} />
    <div className="w-3/4 max-w-xs bg-white h-full shadow-2xl flex flex-col">
      <div className="p-6 bg-gray-900 text-white">
        <div className="h-16 w-16 rounded-full bg-yellow-400 flex items-center justify-center text-gray-900 font-bold text-xl mb-4">DB</div>
        <h2 className="text-xl font-bold">Daniel Birrell</h2><p className="text-gray-400 text-sm">Shift Manager</p>
      </div>
      <div className="flex-1 p-4 space-y-2">
        {['My Profile', 'My Schedule', 'MyStuff 2.0', 'Settings'].map(l => (
          <button key={l} className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-gray-50 text-gray-700 font-medium">
            <User size={20} className="text-gray-400"/> {l}
          </button>
        ))}
        <button onClick={onManagerClick} className="flex items-center gap-3 w-full p-3 rounded-xl bg-red-50 text-red-700 font-bold border border-red-100 mt-4">
          <ShieldAlert size={20} /> Manager Portal
        </button>
      </div>
      <div className="p-4 border-t border-gray-100">
        <button className="flex items-center gap-3 text-red-600 font-bold w-full p-3 rounded-xl hover:bg-red-50"><LogOut size={20}/> Log Out</button>
      </div>
    </div>
  </div>
);

// --- HELPERS ---
const NotificationDropdown = () => (
  <div className="absolute top-20 right-4 w-80 bg-white rounded-2xl shadow-2xl z-50 border border-gray-100 overflow-hidden">
    <div className="p-4 border-b border-gray-100 flex justify-between items-center"><h3 className="font-bold text-gray-900">Notifications</h3><span className="text-xs text-red-600 font-bold">Clear</span></div>
    <div className="max-h-80 overflow-y-auto">
       <div className="flex gap-3 p-4 border-b border-gray-50 hover:bg-gray-50"><div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center"><Calendar size={16}/></div><div><h4 className="text-sm font-bold text-gray-900">Shift Approved</h4><p className="text-xs text-gray-500">Your swap request approved.</p></div></div>
    </div>
  </div>
);
const HeaderBtn = ({ icon, onClick, hasBadge }) => (
  <button onClick={onClick} className="h-10 w-10 flex items-center justify-center bg-black bg-opacity-20 rounded-full text-white active:bg-opacity-30 relative">
    {icon}{hasBadge && <span className="absolute top-2 right-2 h-2.5 w-2.5 bg-yellow-400 border-2 border-red-800 rounded-full" />}
  </button>
);
const NavBtn = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className="flex flex-col items-center justify-center w-20 h-full pb-2">
    <div style={{ color: active ? '#DA291C' : '#9CA3AF' }}>{icon}</div>
    <span className="text-[10px] font-bold mt-1" style={{ color: active ? '#DA291C' : '#9CA3AF' }}>{label}</span>
  </button>
);
const Bubble = ({ label, icon, color, txt='#FFF' }) => (
  <button className="flex flex-col items-center gap-3 group transition-transform active:scale-90">
    <div className="w-24 h-24 rounded-full shadow-xl flex items-center justify-center" style={{ backgroundColor: color, color: txt }}>{icon}</div>
    <span className="text-white font-bold text-sm bg-black/40 px-3 py-1 rounded-full backdrop-blur-md">{label}</span>
  </button>
);
const Placeholder = ({ title, icon }) => (
  <div className="flex flex-col items-center justify-center h-96 text-gray-300"><div className="mb-4">{icon}</div><h2 className="text-lg font-bold text-gray-400">{title}</h2></div>
);
