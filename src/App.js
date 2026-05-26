import { useState, useMemo, useEffect } from "react";

// ── DEVISES ──────────────────────────────────────────────────
const CURRENCIES = {
  USD: { symbol: "$",  name: "Dollar américain / US Dollar", rate: 1 },
  EUR: { symbol: "€",  name: "Euro",                         rate: 0.92 },
  GNF: { symbol: "FG", name: "Franc guinéen",                rate: 8650 },
  XAF: { symbol: "Fr", name: "Franc CFA",                    rate: 603 },
  SLE: { symbol: "Le", name: "Leone sierra-léonais",         rate: 22.5 },
};

// ── TRADUCTIONS ───────────────────────────────────────────────
const T = {
  fr: {
    appSub: "Sauvegardé automatiquement",
    tabs: { dashboard:"Accueil", transactions:"Transactions", debtors:"Je dois", creditors:"On me doit", settings:"Réglages" },
    // Dashboard
    revenues: "Revenus", expenses: "Dépenses", balance: "Solde", netPos: "Pos. nette",
    iOwe: "Je dois à", owesMe: "On me doit", person: "personne(s)",
    last6: "6 derniers mois", chart_income: "Revenus", chart_expense: "Dépenses",
    next30: "Échéances — 30 prochains jours",
    dueLabel: "🔴 Je dois", receiveLabel: "🟢 Attendu",
    inDays: "dans", day: "jour",
    recentTx: "Dernières transactions", noTx: "Aucune transaction encore.",
    // Transactions
    addTx: "+ Ajouter une transaction", closeTx: "✕ Fermer",
    entry: "↑ Entrée", exit: "↓ Sortie",
    desc: "Description *", amount: "Montant *", note: "Note (optionnel)",
    save: "✓ Enregistrer",
    filters: "🔍 Filtres", allTypes: "Tous types", entries: "Entrées", exits: "Sorties",
    allCats: "Toutes catégories", reset: "✕ Réinitialiser",
    result: "résultat", results: "résultats", noResult: "Aucune transaction trouvée",
    original: "Original",
    // Debtors (je dois)
    debtorBanner: "Personnes à qui vous devez de l'argent",
    addDebtor: "+ Ajouter une personne à qui je dois",
    personInfo: "👤 Informations de la personne",
    fullName: "Nom complet *", phone: "Téléphone (ex: +224 620 00 00 00)", address: "Adresse / Ville / Pays",
    debtDetails: "💰 Détails de la dette",
    dueDate: "Échéance", currency: "Devise",
    late: "EN RETARD", soon: "BIENTÔT", paid: "PAYÉ ✓",
    partialBtn: "💳 Paiement partiel", markPaid: "✓ Tout payé", markUnpaid: "↩ Marquer impayé",
    progress: "Progression", paidPct: "% payé",
    contactCard: "👤 Fiche contact", payHistory: "💳 Historique paiements",
    // Creditors (on me doit)
    creditorBanner: "Personnes qui vous doivent de l'argent",
    addCreditor: "+ Ajouter une personne qui me doit",
    credDetails: "💰 Détails de la créance",
    expected: "Attendu le",
    received: "REÇU ✓", lateReceive: "EN RETARD",
    partialReceive: "💳 Réception partielle", markReceived: "✓ Tout reçu", markNotReceived: "↩ Marquer non reçu",
    recPct: "% reçu",
    // Partial modal
    registerPayment: "Enregistrer un paiement", registerReceive: "Enregistrer une réception",
    remaining: "Solde restant", cancel: "Annuler", confirm: "✓ Confirmer",
    // Settings
    security: "🔒 Sécurité PIN",
    pinActive: "✓ PIN activé — application protégée",
    disablePin: "Désactiver le PIN", changePin: "Changer le PIN", enablePin: "Activer le PIN",
    noPinMsg: "Aucun PIN configuré. Activez-le pour protéger vos données.",
    customCats: "📂 Catégories personnalisées",
    incomeLabel: "↑ Revenus", expenseLabel: "↓ Dépenses",
    addCat: "+ Ajouter", newCat: "Nouvelle catégorie",
    incomeOpt: "Revenu", expenseOpt: "Dépense",
    danger: "⚠️ Zone dangereuse", clearAll: "🗑 Effacer toutes les données",
    clearConfirm: "Effacer TOUTES les données ? Cette action est irréversible.",
    language: "🌐 Langue / Language",
    // PIN screen
    enterPin: "Entrez votre PIN", unlockApp: "Déverrouiller FinanceTrack",
    createPin: "Créez votre PIN", choose4: "Choisissez 4 chiffres",
    confirmPin: "Confirmez votre PIN", samePin: "Entrez le même PIN à nouveau",
    wrongPin: "PIN incorrect, réessayez",
    incomeCats: ["Vente", "Service", "Remboursement reçu", "Investissement", "Autre revenu"],
    expenseCats: ["Achat stock", "Loyer", "Transport", "Salaire", "Taxes", "Autre dépense"],
  },
  en: {
    appSub: "Auto-saved",
    tabs: { dashboard:"Home", transactions:"Transactions", debtors:"I Owe", creditors:"Owed to Me", settings:"Settings" },
    revenues: "Revenue", expenses: "Expenses", balance: "Balance", netPos: "Net Position",
    iOwe: "I owe to", owesMe: "Owed to me", person: "person(s)",
    last6: "Last 6 months", chart_income: "Revenue", chart_expense: "Expenses",
    next30: "Upcoming — Next 30 days",
    dueLabel: "🔴 I owe", receiveLabel: "🟢 Expected",
    inDays: "in", day: "day",
    recentTx: "Recent transactions", noTx: "No transactions yet.",
    addTx: "+ Add a transaction", closeTx: "✕ Close",
    entry: "↑ Income", exit: "↓ Expense",
    desc: "Description *", amount: "Amount *", note: "Note (optional)",
    save: "✓ Save",
    filters: "🔍 Filters", allTypes: "All types", entries: "Income", exits: "Expenses",
    allCats: "All categories", reset: "✕ Reset",
    result: "result", results: "results", noResult: "No transactions found",
    original: "Original",
    debtorBanner: "People you owe money to",
    addDebtor: "+ Add someone I owe",
    personInfo: "👤 Person information",
    fullName: "Full name *", phone: "Phone (e.g. +224 620 00 00 00)", address: "Address / City / Country",
    debtDetails: "💰 Debt details",
    dueDate: "Due date", currency: "Currency",
    late: "OVERDUE", soon: "SOON", paid: "PAID ✓",
    partialBtn: "💳 Partial payment", markPaid: "✓ Mark fully paid", markUnpaid: "↩ Mark unpaid",
    progress: "Progress", paidPct: "% paid",
    contactCard: "👤 Contact card", payHistory: "💳 Payment history",
    creditorBanner: "People who owe you money",
    addCreditor: "+ Add someone who owes me",
    credDetails: "💰 Receivable details",
    expected: "Expected by",
    received: "RECEIVED ✓", lateReceive: "OVERDUE",
    partialReceive: "💳 Partial receipt", markReceived: "✓ Mark fully received", markNotReceived: "↩ Mark not received",
    recPct: "% received",
    registerPayment: "Record a payment", registerReceive: "Record a receipt",
    remaining: "Remaining balance", cancel: "Cancel", confirm: "✓ Confirm",
    security: "🔒 PIN Security",
    pinActive: "✓ PIN enabled — app is protected",
    disablePin: "Disable PIN", changePin: "Change PIN", enablePin: "Enable PIN",
    noPinMsg: "No PIN configured. Enable it to protect your data.",
    customCats: "📂 Custom categories",
    incomeLabel: "↑ Income", expenseLabel: "↓ Expenses",
    addCat: "+ Add", newCat: "New category",
    incomeOpt: "Income", expenseOpt: "Expense",
    danger: "⚠️ Danger zone", clearAll: "🗑 Clear all data",
    clearConfirm: "Delete ALL data? This action is irreversible.",
    language: "🌐 Langue / Language",
    enterPin: "Enter your PIN", unlockApp: "Unlock FinanceTrack",
    createPin: "Create your PIN", choose4: "Choose 4 digits",
    confirmPin: "Confirm your PIN", samePin: "Enter the same PIN again",
    wrongPin: "Wrong PIN, try again",
    incomeCats: ["Sale", "Service", "Refund received", "Investment", "Other income"],
    expenseCats: ["Stock purchase", "Rent", "Transport", "Salary", "Taxes", "Other expense"],
  },
};

const DEFAULT_CATS = (lang) => ({
  income:  T[lang].incomeCats,
  expense: T[lang].expenseCats,
});

const today = () => new Date().toISOString().split("T")[0];
const toUSD   = (a, c) => a / CURRENCIES[c].rate;
const fromUSD = (a, c) => a * CURRENCIES[c].rate;
const fmtAmt  = (n, c="USD") => `${CURRENCIES[c].symbol} ${Math.abs(n).toLocaleString("fr-FR", { minimumFractionDigits:0, maximumFractionDigits:2 })}`;
const MONTHS = {
  fr: ["Jan","Fév","Mar","Avr","Mai","Jun","Jul","Aoû","Sep","Oct","Nov","Déc"],
  en: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
};

// ── STORAGE ───────────────────────────────────────────────────
const STORAGE_KEY = "financetrack_v3";
const EMPTY_DATA = (lang="fr") => ({
  transactions:[], debtors:[], creditors:[],
  categories: DEFAULT_CATS(lang),
  pin:null, pinEnabled:false, lang:"fr",
});
const loadData = () => {
  try { const d = localStorage.getItem(STORAGE_KEY); return d ? JSON.parse(d) : EMPTY_DATA(); }
  catch { return EMPTY_DATA(); }
};
const saveData = (d) => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(d)); } catch {} };

// ── STYLES ────────────────────────────────────────────────────
const inp = {
  width:"100%", padding:"11px 14px", borderRadius:10,
  background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.15)",
  color:"#f0e6d3", fontFamily:"Georgia,serif", fontSize:14,
  boxSizing:"border-box", outline:"none", marginBottom:10,
};
const mkBtn = (bg, color="#1a1a2e") => ({
  width:"100%", padding:"12px", background:bg, border:"none",
  borderRadius:10, color, fontWeight:"bold", fontSize:14,
  cursor:"pointer", fontFamily:"Georgia,serif", marginBottom:2,
});
const cardStyle = (border="rgba(255,255,255,0.1)") => ({
  background:"rgba(255,255,255,0.05)", borderRadius:12,
  padding:"14px 16px", marginBottom:10, border:`1px solid ${border}`,
});
const tagStyle = (bg, color) => ({
  fontSize:10, background:bg, color, padding:"2px 7px", borderRadius:20, whiteSpace:"nowrap",
});

// ── PDF EXPORT ────────────────────────────────────────────────
function exportPDF(data, stats, dc, t) {
  const fmt = (n) => fmtAmt(fromUSD(n, dc), dc);
  const row = (cells) => `<tr>${cells.map(c=>`<td>${c}</td>`).join("")}</tr>`;
  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>FinanceTrack Report</title>
  <style>body{font-family:Georgia,serif;color:#1a1a2e;padding:30px;max-width:950px;margin:0 auto}
  h1{color:#302b63;border-bottom:3px solid #f7c948;padding-bottom:10px}h2{color:#302b63;margin-top:28px;font-size:16px}
  table{width:100%;border-collapse:collapse;margin-top:8px;font-size:12px}th{background:#302b63;color:#f7c948;padding:8px 10px;text-align:left}
  td{padding:7px 10px;vertical-align:top;border-bottom:1px solid #eee}tr:nth-child(even){background:#f8f6ff}
  .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:18px 0}
  .stat{background:#f8f6ff;border-radius:8px;padding:12px;border-left:4px solid #f7c948}
  .v{font-size:17px;font-weight:bold}.l{font-size:11px;color:#666;margin-top:2px}
  .footer{margin-top:36px;font-size:11px;color:#999;border-top:1px solid #eee;padding-top:10px}</style></head><body>
  <h1>📊 FinanceTrack</h1>
  <p style="color:#666;font-size:13px">${new Date().toLocaleDateString("fr-FR",{dateStyle:"full"})} · ${dc}</p>
  <div class="grid">
    <div class="stat"><div class="v" style="color:#16a34a">${fmt(stats.totalIn)}</div><div class="l">${t.revenues}</div></div>
    <div class="stat"><div class="v" style="color:#dc2626">${fmt(stats.totalOut)}</div><div class="l">${t.expenses}</div></div>
    <div class="stat"><div class="v" style="color:${stats.balance>=0?'#16a34a':'#dc2626'}">${fmt(stats.balance)}</div><div class="l">${t.balance}</div></div>
    <div class="stat"><div class="v" style="color:#dc2626">${fmt(stats.totalDue)}</div><div class="l">${t.iOwe}</div></div>
    <div class="stat"><div class="v" style="color:#16a34a">${fmt(stats.totalToReceive)}</div><div class="l">${t.owesMe}</div></div>
    <div class="stat"><div class="v" style="color:${stats.netPosition>=0?'#16a34a':'#dc2626'}">${fmt(stats.netPosition)}</div><div class="l">${t.netPos}</div></div>
  </div>
  <h2>💸 ${t.tabs.transactions}</h2>
  <table><thead><tr><th>Date</th><th>${t.desc.replace(' *','')}</th><th>${t.allCats.replace('All ','').replace('Toutes ','')}</th><th>${t.amount.replace(' *','')}</th><th>${t.currency}</th><th>${t.note.replace(' (optionnel)','').replace(' (optional)','')}</th></tr></thead><tbody>
  ${data.transactions.map(tx=>row([tx.date,tx.label,tx.category,
    `<span style="color:${tx.type==='income'?'#16a34a':'#dc2626'}">${tx.type==='income'?'+':'-'}${fmt(toUSD(tx.amount,tx.currency))}</span>`,
    tx.currency,tx.note||'—'])).join("")}</tbody></table>
  <h2>🔴 ${t.tabs.debtors}</h2>
  <table><thead><tr><th>${t.fullName.replace(' *','')}</th><th>${t.phone.split('(')[0].trim()}</th><th>${t.address}</th><th>${t.amount.replace(' *','')}</th><th>${t.dueDate}</th><th>Status</th></tr></thead><tbody>
  ${data.debtors.map(c=>row([c.name,c.phone||'—',c.address||'—',
    `<span style="color:#dc2626">${fmt(toUSD(c.remaining??c.amount,c.currency))}</span>`,
    c.due,c.paid?`✅ ${c.paidDate||''}`:'❌'])).join("")}</tbody></table>
  <h2>🟢 ${t.tabs.creditors}</h2>
  <table><thead><tr><th>${t.fullName.replace(' *','')}</th><th>${t.phone.split('(')[0].trim()}</th><th>${t.address}</th><th>${t.amount.replace(' *','')}</th><th>${t.dueDate}</th><th>Status</th></tr></thead><tbody>
  ${data.creditors.map(d=>row([d.name,d.phone||'—',d.address||'—',
    `<span style="color:#16a34a">${fmt(toUSD(d.remaining??d.amount,d.currency))}</span>`,
    d.due,d.received?`✅ ${d.receivedDate||''}`:'⏳'])).join("")}</tbody></table>
  <div class="footer">FinanceTrack · ${new Date().toISOString()}</div></body></html>`;
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([html],{type:"text/html"}));
  a.download = `FinanceTrack_${today()}.html`; a.click();
}

// ── BAR CHART ─────────────────────────────────────────────────
function BarChart({ data: cd, t, lang }) {
  const max = Math.max(...cd.map(d=>Math.max(d.income,d.expense)),1);
  return (
    <div style={{ display:"flex",alignItems:"flex-end",gap:4,height:90,padding:"0 4px" }}>
      {cd.map((d,i)=>(
        <div key={i} style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2 }}>
          <div style={{ width:"100%",display:"flex",gap:2,alignItems:"flex-end",height:70 }}>
            <div style={{ flex:1,background:"rgba(74,222,128,0.7)",borderRadius:"3px 3px 0 0",height:`${(d.income/max)*100}%`,minHeight:d.income>0?3:0 }}/>
            <div style={{ flex:1,background:"rgba(248,113,113,0.7)",borderRadius:"3px 3px 0 0",height:`${(d.expense/max)*100}%`,minHeight:d.expense>0?3:0 }}/>
          </div>
          <div style={{ fontSize:8,color:"#7c6fa0" }}>{d.label}</div>
        </div>
      ))}
    </div>
  );
}

// ── PERSON FIELDS ─────────────────────────────────────────────
function PersonFields({ form, setForm, accent, t }) {
  return (
    <div style={{ background:`rgba(${accent},0.06)`,borderRadius:10,padding:"12px 12px 2px",marginBottom:10,border:`1px solid rgba(${accent},0.2)` }}>
      <div style={{ fontSize:11,color:"#a89ec9",marginBottom:8,fontStyle:"italic" }}>{t.personInfo}</div>
      <input placeholder={t.fullName} value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} style={inp}/>
      <input placeholder={t.phone}    value={form.phone||""} onChange={e=>setForm(p=>({...p,phone:e.target.value}))} style={inp}/>
      <input placeholder={t.address}  value={form.address||""} onChange={e=>setForm(p=>({...p,address:e.target.value}))} style={inp}/>
    </div>
  );
}

function PersonCard({ item, accent, t }) {
  return (
    <div style={{ marginTop:8,padding:"10px 12px",background:"rgba(255,255,255,0.04)",borderRadius:10,borderLeft:`3px solid ${accent}` }}>
      <div style={{ fontSize:11,color:"#a89ec9",marginBottom:4 }}>{t.contactCard}</div>
      {item.phone   && <div style={{ fontSize:12,color:"#d4c8f0" }}>📞 {item.phone}</div>}
      {item.address && <div style={{ fontSize:12,color:"#d4c8f0" }}>📍 {item.address}</div>}
      {item.note    && <div style={{ fontSize:12,color:"#d4c8f0",fontStyle:"italic",marginTop:4 }}>📝 {item.note}</div>}
      {item.payments&&item.payments.length>0&&(
        <div style={{ marginTop:8 }}>
          <div style={{ fontSize:11,color:"#a89ec9",marginBottom:4 }}>{t.payHistory}</div>
          {item.payments.map((p,i)=>(
            <div key={i} style={{ fontSize:11,color:"#c4b8e0" }}>• {p.date} — {fmtAmt(p.amount,p.currency)} {p.currency} {p.note?`(${p.note})`:""}</div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── PIN SCREEN ────────────────────────────────────────────────
function PinScreen({ onUnlock, title, subtitle }) {
  const [entered, setEntered] = useState("");
  const [error,   setError]   = useState(false);
  const keys = ["1","2","3","4","5","6","7","8","9","","0","⌫"];
  const handleKey = (k) => {
    if (k==="⌫") { setEntered(p=>p.slice(0,-1)); setError(false); return; }
    if (k==="") return;
    const next = entered+k;
    setEntered(next);
    if (next.length===4) { onUnlock(next, ()=>{ setError(true); setEntered(""); }); }
  };
  return (
    <div style={{ minHeight:"100vh",background:"linear-gradient(160deg,#0d0b1e,#1e1b3a,#0d1a12)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:20 }}>
      <div style={{ fontSize:32,marginBottom:8 }}>🔒</div>
      <div style={{ fontSize:20,fontWeight:"bold",color:"#f7c948",fontFamily:"Georgia,serif",marginBottom:4 }}>FinanceTrack</div>
      <div style={{ fontSize:14,color:"#a89ec9",marginBottom:6 }}>{title}</div>
      {subtitle&&<div style={{ fontSize:12,color:"#7c6fa0",marginBottom:20,textAlign:"center" }}>{subtitle}</div>}
      <div style={{ display:"flex",gap:12,marginBottom:28 }}>
        {[0,1,2,3].map(i=>(
          <div key={i} style={{ width:16,height:16,borderRadius:"50%",background:i<entered.length?"#f7c948":"rgba(255,255,255,0.15)",border:"2px solid rgba(247,201,72,0.4)",transition:"all 0.15s" }}/>
        ))}
      </div>
      {error&&<div style={{ color:"#f87171",fontSize:13,marginBottom:12 }}>{title.includes("PIN")||title.includes("PIN")?"PIN incorrect":"Wrong PIN"}</div>}
      <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,width:220 }}>
        {keys.map((k,i)=>(
          <button key={i} onClick={()=>handleKey(k)} style={{
            padding:"16px 0",borderRadius:12,border:"1px solid rgba(255,255,255,0.1)",
            background:k==="⌫"?"rgba(248,113,113,0.15)":k===""?"transparent":"rgba(255,255,255,0.07)",
            color:k===""?"transparent":"#f0e6d3",fontSize:20,fontWeight:"bold",
            cursor:k===""?"default":"pointer",fontFamily:"Georgia,serif",
            visibility:k===""?"hidden":"visible",
          }}>{k}</button>
        ))}
      </div>
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────
export default function App() {
  const [data,       setData]       = useState(()=>loadData());
  const [tab,        setTab]        = useState("dashboard");
  const [dc,         setDc]         = useState("USD");
  const [unlocked,   setUnlocked]   = useState(false);
  const [settingPin, setSettingPin] = useState(false);
  const [tempPin,    setTempPin]    = useState("");
  const [expanded,   setExpanded]   = useState(null);
  const [partialModal,setPartialModal] = useState(null);
  const [partialAmt, setPartialAmt] = useState("");
  const [partialNote,setPartialNote] = useState("");
  const [partialCur, setPartialCur] = useState("USD");
  const [newCat,     setNewCat]     = useState({ type:"income", name:"" });
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo,   setFilterTo]   = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterCat,  setFilterCat]  = useState("all");

  useEffect(()=>{ saveData(data); }, [data]);

  const lang = data.lang || "fr";
  const t = T[lang];
  const cats = data.categories || DEFAULT_CATS(lang);

  const setLang = (l) => setData(d=>({...d, lang:l}));

  const emptyTx = { type:"income",label:"",amount:"",currency:"USD",date:today(),category:cats.income[0],note:"" };
  const emptyDe = { name:"",phone:"",address:"",amount:"",currency:"USD",due:today(),note:"" };
  const emptyCr = { name:"",phone:"",address:"",amount:"",currency:"USD",due:today(),note:"" };
  const [txForm,setTxForm] = useState(emptyTx);
  const [deForm,setDeForm] = useState(emptyDe);
  const [crForm,setCrForm] = useState(emptyCr);
  const [showTxForm,setShowTxForm] = useState(false);
  const [showDeForm,setShowDeForm] = useState(false);
  const [showCrForm,setShowCrForm] = useState(false);

  const stats = useMemo(()=>{
    const totalIn        = data.transactions.filter(t=>t.type==="income") .reduce((s,t)=>s+toUSD(t.amount,t.currency),0);
    const totalOut       = data.transactions.filter(t=>t.type==="expense").reduce((s,t)=>s+toUSD(t.amount,t.currency),0);
    const balance        = totalIn - totalOut;
    const totalDue       = data.debtors .filter(c=>!c.paid)    .reduce((s,c)=>s+toUSD(c.remaining??c.amount,c.currency),0);
    const totalToReceive = data.creditors.filter(d=>!d.received).reduce((s,d)=>s+toUSD(d.remaining??d.amount,d.currency),0);
    const netPosition    = balance + totalToReceive - totalDue;
    return { totalIn,totalOut,balance,totalDue,totalToReceive,netPosition };
  },[data]);

  const fmt = (usd) => fmtAmt(fromUSD(usd,dc),dc);

  const chartData = useMemo(()=>{
    const now = new Date();
    return Array.from({length:6},(_,i)=>{
      const d = new Date(now.getFullYear(),now.getMonth()-5+i,1);
      const ym = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`;
      const txs = data.transactions.filter(t=>t.date.startsWith(ym));
      return {
        label: MONTHS[lang][d.getMonth()],
        income:  txs.filter(t=>t.type==="income") .reduce((s,t)=>s+toUSD(t.amount,t.currency),0),
        expense: txs.filter(t=>t.type==="expense").reduce((s,t)=>s+toUSD(t.amount,t.currency),0),
      };
    });
  },[data.transactions,lang]);

  const upcoming30 = useMemo(()=>{
    const now=new Date(); now.setHours(0,0,0,0);
    const in30=new Date(now); in30.setDate(now.getDate()+30);
    const items=[];
    data.debtors.filter(c=>!c.paid).forEach(c=>{
      const d=new Date(c.due);
      if(d>=now&&d<=in30) items.push({...c,kind:"due",daysLeft:Math.ceil((d-now)/86400000)});
    });
    data.creditors.filter(c=>!c.received).forEach(c=>{
      const d=new Date(c.due);
      if(d>=now&&d<=in30) items.push({...c,kind:"receive",daysLeft:Math.ceil((d-now)/86400000)});
    });
    return items.sort((a,b)=>a.daysLeft-b.daysLeft);
  },[data]);

  const filteredTx = useMemo(()=>data.transactions.filter(tx=>{
    if(filterFrom&&tx.date<filterFrom) return false;
    if(filterTo  &&tx.date>filterTo)   return false;
    if(filterType!=="all"&&tx.type!==filterType) return false;
    if(filterCat !=="all"&&tx.category!==filterCat) return false;
    return true;
  }),[data.transactions,filterFrom,filterTo,filterType,filterCat]);

  // Actions
  const addTx=()=>{ if(!txForm.label||!txForm.amount) return; setData(d=>({...d,transactions:[{...txForm,id:Date.now(),amount:parseFloat(txForm.amount)},...d.transactions]})); setTxForm(emptyTx); setShowTxForm(false); };
  const addDe=()=>{ if(!deForm.name||!deForm.amount) return; const a=parseFloat(deForm.amount); setData(d=>({...d,debtors:[{...deForm,id:Date.now(),amount:a,remaining:a,paid:false,payments:[]},...d.debtors]})); setDeForm(emptyDe); setShowDeForm(false); };
  const addCr=()=>{ if(!crForm.name||!crForm.amount) return; const a=parseFloat(crForm.amount); setData(d=>({...d,creditors:[{...crForm,id:Date.now(),amount:a,remaining:a,received:false,payments:[]},...d.creditors]})); setCrForm(emptyCr); setShowCrForm(false); };

  const applyPartial=()=>{
    const amt=parseFloat(partialAmt); if(!amt||amt<=0) return;
    const payment={date:today(),amount:amt,currency:partialCur,note:partialNote};
    if(partialModal.type==="de"){
      setData(d=>({...d,debtors:d.debtors.map(c=>{
        if(c.id!==partialModal.id) return c;
        const rem=Math.max(0,fromUSD(toUSD(c.remaining??c.amount,c.currency)-toUSD(amt,partialCur),c.currency));
        return {...c,remaining:rem,paid:rem<=0,paidDate:rem<=0?today():undefined,payments:[...(c.payments||[]),payment]};
      })}));
    } else {
      setData(d=>({...d,creditors:d.creditors.map(c=>{
        if(c.id!==partialModal.id) return c;
        const rem=Math.max(0,fromUSD(toUSD(c.remaining??c.amount,c.currency)-toUSD(amt,partialCur),c.currency));
        return {...c,remaining:rem,received:rem<=0,receivedDate:rem<=0?today():undefined,payments:[...(c.payments||[]),payment]};
      })}));
    }
    setPartialModal(null); setPartialAmt(""); setPartialNote(""); setPartialCur("USD");
  };

  const togglePaid = id=>setData(d=>({...d,debtors:  d.debtors  .map(c=>c.id===id?{...c,paid:    !c.paid,    remaining:c.paid?    c.amount:0,paidDate:    !c.paid?    today():undefined}:c)}));
  const toggleRec  = id=>setData(d=>({...d,creditors:d.creditors.map(c=>c.id===id?{...c,received:!c.received,remaining:c.received?c.amount:0,receivedDate:!c.received?today():undefined}:c)}));
  const delTx = id=>setData(d=>({...d,transactions:d.transactions.filter(t=>t.id!==id)}));
  const delDe = id=>setData(d=>({...d,debtors:     d.debtors    .filter(c=>c.id!==id)}));
  const delCr = id=>setData(d=>({...d,creditors:   d.creditors  .filter(c=>c.id!==id)}));

  const addCatFn=()=>{ if(!newCat.name.trim()) return; setData(d=>({...d,categories:{...cats,[newCat.type]:[...cats[newCat.type],newCat.name.trim()]}})); setNewCat({type:"income",name:""}); };
  const delCat=(type,name)=>setData(d=>({...d,categories:{...cats,[type]:cats[type].filter(c=>c!==name)}}));

  // PIN
  const isPinEnabled = data.pinEnabled&&data.pin;
  const needsUnlock  = isPinEnabled&&!unlocked;
  const handleUnlock    = (e,onFail)=>{ if(e===data.pin){setUnlocked(true);}else{onFail();} };
  const handleSetPin1   = (e,onFail)=>{ setTempPin(e); setSettingPin("new2"); };
  const handleSetPin2   = (e,onFail)=>{ if(e===tempPin){setData(d=>({...d,pin:e,pinEnabled:true}));setSettingPin(false);setTempPin("");setUnlocked(true);}else{onFail();} };
  const disablePin = ()=>setData(d=>({...d,pin:null,pinEnabled:false}));

  if(settingPin==="new1") return <PinScreen onUnlock={handleSetPin1} title={t.createPin} subtitle={t.choose4}/>;
  if(settingPin==="new2") return <PinScreen onUnlock={handleSetPin2} title={t.confirmPin} subtitle={t.samePin}/>;
  if(needsUnlock)         return <PinScreen onUnlock={handleUnlock}  title={t.unlockApp}/>;

  const allCats=[...new Set([...cats.income,...cats.expense])];
  const tabList=[
    {id:"dashboard",   icon:"📊", label:t.tabs.dashboard},
    {id:"transactions",icon:"💸", label:t.tabs.transactions},
    {id:"debtors",     icon:"🔴", label:t.tabs.debtors},
    {id:"creditors",   icon:"🟢", label:t.tabs.creditors},
    {id:"settings",    icon:"⚙️",  label:t.tabs.settings},
  ];

  return (
    <div style={{ fontFamily:"Georgia,serif",background:"linear-gradient(160deg,#0d0b1e 0%,#1e1b3a 50%,#0d1a12 100%)",minHeight:"100vh",color:"#f0e6d3" }}>

      {/* HEADER */}
      <div style={{ background:"rgba(10,8,28,0.88)",backdropFilter:"blur(12px)",borderBottom:"1px solid rgba(247,201,72,0.15)",padding:"14px 16px 0",position:"sticky",top:0,zIndex:100 }}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12 }}>
          <div style={{ display:"flex",alignItems:"center",gap:10 }}>
            <div style={{ width:36,height:36,borderRadius:"50%",background:"linear-gradient(135deg,#f7c948,#e87c2f)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:"bold",color:"#1a1a2e" }}>₣</div>
            <div>
              <div style={{ fontSize:17,fontWeight:"bold",color:"#f7c948",letterSpacing:1 }}>FinanceTrack</div>
              <div style={{ fontSize:9,color:"#7c6fa0" }}>💾 {t.appSub}</div>
            </div>
          </div>
          <div style={{ display:"flex",gap:6,alignItems:"center" }}>
            {/* Lang toggle */}
            <div style={{ display:"flex",borderRadius:8,overflow:"hidden",border:"1px solid rgba(247,201,72,0.3)" }}>
              {["fr","en"].map(l=>(
                <button key={l} onClick={()=>setLang(l)} style={{
                  padding:"5px 10px",background:lang===l?"rgba(247,201,72,0.25)":"transparent",
                  border:"none",color:lang===l?"#f7c948":"#7c6fa0",fontSize:12,fontWeight:lang===l?"bold":"normal",
                  cursor:"pointer",fontFamily:"Georgia,serif",
                }}>{l.toUpperCase()}</button>
              ))}
            </div>
            <select value={dc} onChange={e=>setDc(e.target.value)}
              style={{ background:"rgba(255,255,255,0.08)",border:"1px solid rgba(247,201,72,0.3)",color:"#f7c948",borderRadius:8,padding:"5px 8px",fontSize:12,fontFamily:"Georgia,serif",cursor:"pointer" }}>
              {Object.entries(CURRENCIES).map(([k,v])=><option key={k} value={k}>{k} {v.symbol}</option>)}
            </select>
            <button onClick={()=>exportPDF(data,stats,dc,t)}
              style={{ background:"rgba(247,201,72,0.12)",border:"1px solid rgba(247,201,72,0.35)",color:"#f7c948",borderRadius:8,padding:"5px 10px",fontSize:12,cursor:"pointer",fontFamily:"Georgia,serif" }}>
              📄 PDF
            </button>
          </div>
        </div>
        <div style={{ display:"flex" }}>
          {tabList.map(tb=>(
            <button key={tb.id} onClick={()=>setTab(tb.id)} style={{
              flex:1,background:tab===tb.id?"rgba(247,201,72,0.1)":"transparent",
              border:"none",borderBottom:tab===tb.id?"2px solid #f7c948":"2px solid transparent",
              color:tab===tb.id?"#f7c948":"#7c6fa0",
              padding:"8px 2px",cursor:"pointer",fontFamily:"Georgia,serif",transition:"all 0.2s",
            }}>
              <div style={{ fontSize:15 }}>{tb.icon}</div>
              <div style={{ fontSize:8,marginTop:2 }}>{tb.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* PARTIAL MODAL */}
      {partialModal&&(
        <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:20 }}>
          <div style={{ background:"#1e1b3a",borderRadius:16,padding:24,width:"100%",maxWidth:380,border:"1px solid rgba(247,201,72,0.3)" }}>
            <div style={{ fontSize:15,fontWeight:"bold",color:"#f7c948",marginBottom:4 }}>
              {partialModal.type==="de"?t.registerPayment:t.registerReceive}
            </div>
            <div style={{ fontSize:12,color:"#a89ec9",marginBottom:16 }}>
              {t.remaining} : {fmtAmt(fromUSD(toUSD(partialModal.item.remaining??partialModal.item.amount,partialModal.item.currency),dc),dc)}
            </div>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8 }}>
              <input type="number" placeholder={t.amount} value={partialAmt} onChange={e=>setPartialAmt(e.target.value)} style={inp}/>
              <select value={partialCur} onChange={e=>setPartialCur(e.target.value)} style={inp}>
                {Object.entries(CURRENCIES).map(([k])=><option key={k} value={k}>{k}</option>)}
              </select>
            </div>
            <input placeholder={t.note} value={partialNote} onChange={e=>setPartialNote(e.target.value)} style={inp}/>
            <div style={{ display:"flex",gap:8 }}>
              <button onClick={()=>setPartialModal(null)} style={{ flex:1,padding:"10px",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:10,color:"#a89ec9",cursor:"pointer",fontFamily:"Georgia,serif" }}>{t.cancel}</button>
              <button onClick={applyPartial} style={{ flex:2,padding:"10px",background:"linear-gradient(135deg,#f7c948,#e87c2f)",border:"none",borderRadius:10,color:"#1a1a2e",fontWeight:"bold",cursor:"pointer",fontFamily:"Georgia,serif" }}>{t.confirm}</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ padding:"18px 16px",maxWidth:620,margin:"0 auto" }}>

        {/* ════ DASHBOARD ════ */}
        {tab==="dashboard"&&(
          <div>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14 }}>
              {[
                {label:t.revenues, v:stats.totalIn,        color:"#4ade80",icon:"↑"},
                {label:t.expenses, v:stats.totalOut,       color:"#f87171",icon:"↓"},
                {label:t.balance,  v:stats.balance,        color:stats.balance>=0?"#4ade80":"#f87171",icon:"="},
                {label:t.netPos,   v:stats.netPosition,    color:stats.netPosition>=0?"#f7c948":"#f87171",icon:"◎"},
              ].map((s,i)=>(
                <div key={i} style={{ background:"rgba(255,255,255,0.05)",borderRadius:14,padding:"14px",border:`1px solid ${s.color}25` }}>
                  <div style={{ fontSize:10,color:"#7c6fa0",marginBottom:5 }}>{s.icon} {s.label}</div>
                  <div style={{ fontSize:16,fontWeight:"bold",color:s.color }}>{fmt(s.v)}</div>
                  <div style={{ fontSize:9,color:"#5c5070",marginTop:2 }}>{dc}</div>
                </div>
              ))}
            </div>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16 }}>
              <div style={{ background:"rgba(248,113,113,0.08)",border:"1px solid rgba(248,113,113,0.25)",borderRadius:14,padding:14 }}>
                <div style={{ fontSize:10,color:"#7c6fa0",marginBottom:5 }}>🔴 {t.iOwe}</div>
                <div style={{ fontSize:16,fontWeight:"bold",color:"#f87171" }}>{fmt(stats.totalDue)}</div>
                <div style={{ fontSize:10,color:"#7c6fa0",marginTop:2 }}>{data.debtors.filter(c=>!c.paid).length} {t.person}</div>
              </div>
              <div style={{ background:"rgba(74,222,128,0.08)",border:"1px solid rgba(74,222,128,0.25)",borderRadius:14,padding:14 }}>
                <div style={{ fontSize:10,color:"#7c6fa0",marginBottom:5 }}>🟢 {t.owesMe}</div>
                <div style={{ fontSize:16,fontWeight:"bold",color:"#4ade80" }}>{fmt(stats.totalToReceive)}</div>
                <div style={{ fontSize:10,color:"#7c6fa0",marginTop:2 }}>{data.creditors.filter(d=>!d.received).length} {t.person}</div>
              </div>
            </div>
            <div style={{ background:"rgba(255,255,255,0.04)",borderRadius:14,padding:16,marginBottom:16,border:"1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ fontSize:13,color:"#f7c948",fontWeight:"bold",marginBottom:4 }}>📊 {t.last6}</div>
              <div style={{ display:"flex",gap:12,marginBottom:8 }}>
                <div style={{ display:"flex",alignItems:"center",gap:4 }}><div style={{ width:10,height:10,borderRadius:2,background:"rgba(74,222,128,0.7)" }}/><span style={{ fontSize:10,color:"#7c6fa0" }}>{t.chart_income}</span></div>
                <div style={{ display:"flex",alignItems:"center",gap:4 }}><div style={{ width:10,height:10,borderRadius:2,background:"rgba(248,113,113,0.7)" }}/><span style={{ fontSize:10,color:"#7c6fa0" }}>{t.chart_expense}</span></div>
              </div>
              <BarChart data={chartData} t={t} lang={lang}/>
            </div>
            {upcoming30.length>0&&(
              <div style={{ background:"rgba(247,201,72,0.06)",borderRadius:14,padding:16,marginBottom:16,border:"1px solid rgba(247,201,72,0.2)" }}>
                <div style={{ fontSize:13,color:"#f7c948",fontWeight:"bold",marginBottom:10 }}>📅 {t.next30}</div>
                {upcoming30.map((item,i)=>(
                  <div key={i} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 0",borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
                    <div>
                      <div style={{ fontSize:13 }}>{item.name}</div>
                      <div style={{ fontSize:10,color:"#7c6fa0" }}>{item.kind==="due"?t.dueLabel:t.receiveLabel} · {t.inDays} {item.daysLeft} {t.day}{item.daysLeft>1&&lang==="fr"?"s":item.daysLeft>1&&lang==="en"?"s":""}</div>
                    </div>
                    <div style={{ fontWeight:"bold",color:item.kind==="due"?"#f87171":"#4ade80",fontSize:13 }}>
                      {fmt(toUSD(item.remaining??item.amount,item.currency))}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div style={{ background:"rgba(255,255,255,0.04)",borderRadius:14,padding:16,border:"1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ fontSize:13,color:"#f7c948",fontWeight:"bold",marginBottom:12 }}>{t.recentTx}</div>
              {data.transactions.length===0&&<div style={{ color:"#7c6fa0",fontSize:13 }}>{t.noTx}</div>}
              {data.transactions.slice(0,5).map(tx=>(
                <div key={tx.id} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
                  <div>
                    <div style={{ fontSize:13 }}>{tx.label}</div>
                    <div style={{ fontSize:10,color:"#7c6fa0" }}>{tx.date} · {tx.category} · {tx.currency}</div>
                  </div>
                  <div style={{ fontWeight:"bold",color:tx.type==="income"?"#4ade80":"#f87171",fontSize:13 }}>
                    {tx.type==="income"?"+":"-"}{fmt(toUSD(tx.amount,tx.currency))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ════ TRANSACTIONS ════ */}
        {tab==="transactions"&&(
          <div>
            <button onClick={()=>setShowTxForm(!showTxForm)} style={mkBtn("linear-gradient(135deg,#f7c948,#e87c2f)")}>
              {showTxForm?t.closeTx:t.addTx}
            </button>
            {showTxForm&&(
              <div style={{ background:"rgba(247,201,72,0.06)",borderRadius:14,padding:16,marginBottom:16,border:"1px solid rgba(247,201,72,0.2)",marginTop:10 }}>
                <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10 }}>
                  {["income","expense"].map(type=>(
                    <button key={type} onClick={()=>setTxForm(f=>({...f,type,category:cats[type][0]}))} style={{
                      padding:"10px",border:`2px solid ${txForm.type===type?(type==="income"?"#4ade80":"#f87171"):"rgba(255,255,255,0.1)"}`,
                      borderRadius:10,background:txForm.type===type?(type==="income"?"rgba(74,222,128,0.12)":"rgba(248,113,113,0.12)"):"transparent",
                      color:type==="income"?"#4ade80":"#f87171",cursor:"pointer",fontFamily:"Georgia,serif",fontSize:13,
                    }}>{type==="income"?t.entry:t.exit}</button>
                  ))}
                </div>
                <input type="text" placeholder={t.desc} value={txForm.label} onChange={e=>setTxForm(p=>({...p,label:e.target.value}))} style={inp}/>
                <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8 }}>
                  <input type="number" placeholder={t.amount} value={txForm.amount} onChange={e=>setTxForm(p=>({...p,amount:e.target.value}))} style={inp}/>
                  <select value={txForm.currency} onChange={e=>setTxForm(p=>({...p,currency:e.target.value}))} style={inp}>
                    {Object.entries(CURRENCIES).map(([k])=><option key={k} value={k}>{k}</option>)}
                  </select>
                </div>
                <input type="date" value={txForm.date} onChange={e=>setTxForm(p=>({...p,date:e.target.value}))} style={inp}/>
                <select value={txForm.category} onChange={e=>setTxForm(p=>({...p,category:e.target.value}))} style={inp}>
                  {cats[txForm.type].map(c=><option key={c} value={c}>{c}</option>)}
                </select>
                <textarea placeholder={t.note} value={txForm.note} onChange={e=>setTxForm(p=>({...p,note:e.target.value}))} rows={2} style={{...inp,resize:"none"}}/>
                <button onClick={addTx} style={mkBtn("linear-gradient(135deg,#f7c948,#e87c2f)")}>{t.save}</button>
              </div>
            )}
            <div style={{ background:"rgba(255,255,255,0.04)",borderRadius:12,padding:"12px 14px",marginBottom:14,border:"1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ fontSize:12,color:"#f7c948",marginBottom:8 }}>{t.filters}</div>
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8 }}>
                <input type="date" value={filterFrom} onChange={e=>setFilterFrom(e.target.value)} style={{...inp,marginBottom:0,fontSize:12}}/>
                <input type="date" value={filterTo}   onChange={e=>setFilterTo(e.target.value)}   style={{...inp,marginBottom:0,fontSize:12}}/>
                <select value={filterType} onChange={e=>setFilterType(e.target.value)} style={{...inp,marginBottom:0,fontSize:12}}>
                  <option value="all">{t.allTypes}</option>
                  <option value="income">{t.entries}</option>
                  <option value="expense">{t.exits}</option>
                </select>
                <select value={filterCat} onChange={e=>setFilterCat(e.target.value)} style={{...inp,marginBottom:0,fontSize:12}}>
                  <option value="all">{t.allCats}</option>
                  {allCats.map(c=><option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              {(filterFrom||filterTo||filterType!=="all"||filterCat!=="all")&&(
                <button onClick={()=>{setFilterFrom("");setFilterTo("");setFilterType("all");setFilterCat("all");}}
                  style={{ marginTop:8,background:"none",border:"1px solid rgba(255,255,255,0.15)",color:"#a89ec9",borderRadius:8,padding:"4px 10px",cursor:"pointer",fontSize:11,fontFamily:"Georgia,serif" }}>
                  {t.reset} ({filteredTx.length} {filteredTx.length!==1?t.results:t.result})
                </button>
              )}
            </div>
            {filteredTx.length===0&&<div style={{ textAlign:"center",color:"#7c6fa0",padding:30,fontSize:13 }}>{t.noResult}</div>}
            {filteredTx.map(tx=>{
              const isExp=expanded===tx.id;
              return (
                <div key={tx.id} style={cardStyle(tx.type==="income"?"rgba(74,222,128,0.2)":"rgba(248,113,113,0.2)")}>
                  <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start" }}>
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:"bold",fontSize:14 }}>{tx.label}</div>
                      <div style={{ fontSize:10,color:"#7c6fa0",marginTop:2 }}>{tx.date} · {tx.category} · <span style={{ color:"#f7c948" }}>{tx.currency}</span></div>
                    </div>
                    <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                      <span style={{ fontWeight:"bold",color:tx.type==="income"?"#4ade80":"#f87171",fontSize:14 }}>
                        {tx.type==="income"?"+":"-"}{fmt(toUSD(tx.amount,tx.currency))}
                      </span>
                      {tx.note&&<button onClick={()=>setExpanded(isExp?null:tx.id)} style={{ background:"none",border:"none",cursor:"pointer",fontSize:14 }}>📝</button>}
                      <button onClick={()=>delTx(tx.id)} style={{ background:"none",border:"none",color:"#4a4060",cursor:"pointer",fontSize:14 }}>🗑</button>
                    </div>
                  </div>
                  {isExp&&tx.note&&<div style={{ marginTop:8,padding:"8px 10px",background:"rgba(255,255,255,0.05)",borderRadius:8,fontSize:12,color:"#c4b8e0",borderLeft:"2px solid #f7c948" }}>{tx.note}</div>}
                  {dc!==tx.currency&&<div style={{ fontSize:10,color:"#5c5070",marginTop:4 }}>{t.original} : {fmtAmt(tx.amount,tx.currency)}</div>}
                </div>
              );
            })}
          </div>
        )}

        {/* ════ JE DOIS ════ */}
        {tab==="debtors"&&(
          <div>
            <div style={{ fontSize:12,color:"#f87171",background:"rgba(248,113,113,0.08)",borderRadius:10,padding:"8px 14px",marginBottom:12,border:"1px solid rgba(248,113,113,0.2)" }}>
              🔴 {t.debtorBanner}
            </div>
            <button onClick={()=>setShowDeForm(!showDeForm)} style={mkBtn("linear-gradient(135deg,#f87171,#dc2626)","#fff")}>
              {showDeForm?t.closeTx:t.addDebtor}
            </button>
            {showDeForm&&(
              <div style={{ background:"rgba(248,113,113,0.06)",borderRadius:14,padding:16,marginBottom:16,border:"1px solid rgba(248,113,113,0.22)",marginTop:10 }}>
                <PersonFields form={deForm} setForm={setDeForm} accent="248,113,113" t={t}/>
                <div style={{ fontSize:11,color:"#a89ec9",marginBottom:8,fontStyle:"italic" }}>{t.debtDetails}</div>
                <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8 }}>
                  <input type="number" placeholder={t.amount} value={deForm.amount} onChange={e=>setDeForm(p=>({...p,amount:e.target.value}))} style={inp}/>
                  <select value={deForm.currency} onChange={e=>setDeForm(p=>({...p,currency:e.target.value}))} style={inp}>
                    {Object.entries(CURRENCIES).map(([k,v])=><option key={k} value={k}>{k} — {v.name}</option>)}
                  </select>
                </div>
                <input type="date" value={deForm.due} onChange={e=>setDeForm(p=>({...p,due:e.target.value}))} style={inp}/>
                <textarea placeholder={t.note} value={deForm.note} onChange={e=>setDeForm(p=>({...p,note:e.target.value}))} rows={2} style={{...inp,resize:"none"}}/>
                <button onClick={addDe} style={mkBtn("linear-gradient(135deg,#f87171,#dc2626)","#fff")}>{t.save}</button>
              </div>
            )}
            {data.debtors.map(c=>{
              const rem=c.remaining??c.amount;
              const pct=Math.round((1-(rem/c.amount))*100);
              const overdue=!c.paid&&new Date(c.due)<new Date();
              const soon=!c.paid&&!overdue&&(new Date(c.due)-new Date())<7*86400000;
              const isExp=expanded===`de-${c.id}`;
              return (
                <div key={c.id} style={cardStyle(c.paid?"rgba(74,222,128,0.25)":overdue?"rgba(248,113,113,0.45)":soon?"rgba(247,201,72,0.3)":"rgba(255,255,255,0.08)")}>
                  <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start" }}>
                    <div style={{ flex:1 }}>
                      <div style={{ display:"flex",alignItems:"center",gap:6,flexWrap:"wrap" }}>
                        <span style={{ fontWeight:"bold",fontSize:14 }}>{c.name}</span>
                        {overdue&&<span style={tagStyle("rgba(248,113,113,0.25)","#f87171")}>{t.late}</span>}
                        {soon   &&<span style={tagStyle("rgba(247,201,72,0.2)","#f7c948")}>{t.soon}</span>}
                        {c.paid &&<span style={tagStyle("rgba(74,222,128,0.2)","#4ade80")}>{t.paid}</span>}
                      </div>
                      <div style={{ fontSize:10,color:"#7c6fa0",marginTop:3 }}>{t.dueDate} : {c.due} · {c.currency}</div>
                      {c.phone  &&<div style={{ fontSize:10,color:"#a89ec9" }}>📞 {c.phone}</div>}
                      {c.address&&<div style={{ fontSize:10,color:"#a89ec9" }}>📍 {c.address}</div>}
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <div style={{ fontWeight:"bold",color:c.paid?"#4ade80":"#f87171",fontSize:15 }}>{fmt(toUSD(rem,c.currency))}</div>
                      {!c.paid&&rem<c.amount&&<div style={{ fontSize:10,color:"#7c6fa0" }}>/ {fmt(toUSD(c.amount,c.currency))}</div>}
                    </div>
                  </div>
                  {!c.paid&&c.payments&&c.payments.length>0&&(
                    <div style={{ marginTop:8 }}>
                      <div style={{ display:"flex",justifyContent:"space-between",marginBottom:3 }}>
                        <span style={{ fontSize:10,color:"#7c6fa0" }}>{t.progress}</span>
                        <span style={{ fontSize:10,color:"#4ade80" }}>{pct}{t.paidPct}</span>
                      </div>
                      <div style={{ height:4,background:"rgba(255,255,255,0.1)",borderRadius:4 }}>
                        <div style={{ height:"100%",width:`${pct}%`,background:"linear-gradient(90deg,#4ade80,#22c55e)",borderRadius:4 }}/>
                      </div>
                    </div>
                  )}
                  {isExp&&<PersonCard item={c} accent="#f87171" t={t}/>}
                  {dc!==c.currency&&<div style={{ fontSize:10,color:"#5c5070",marginTop:4 }}>{t.original} : {fmtAmt(c.amount,c.currency)}</div>}
                  <div style={{ display:"flex",gap:8,marginTop:10 }}>
                    {!c.paid&&<button onClick={()=>setPartialModal({type:"de",id:c.id,item:c})} style={{ flex:1,padding:"8px",border:"1px solid rgba(247,201,72,0.4)",borderRadius:8,background:"rgba(247,201,72,0.1)",color:"#f7c948",cursor:"pointer",fontSize:12,fontFamily:"Georgia,serif" }}>{t.partialBtn}</button>}
                    <button onClick={()=>togglePaid(c.id)} style={{ flex:1,padding:"8px",border:`1px solid ${c.paid?"#4ade80":"rgba(74,222,128,0.35)"}`,borderRadius:8,background:c.paid?"rgba(74,222,128,0.12)":"transparent",color:"#4ade80",cursor:"pointer",fontSize:12,fontFamily:"Georgia,serif" }}>{c.paid?t.markUnpaid:t.markPaid}</button>
                    <button onClick={()=>setExpanded(isExp?null:`de-${c.id}`)} style={{ padding:"8px 10px",background:"none",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,color:"#a89ec9",cursor:"pointer",fontSize:14 }}>👁</button>
                    <button onClick={()=>delDe(c.id)} style={{ padding:"8px 10px",background:"none",border:"none",color:"#4a4060",cursor:"pointer",fontSize:14 }}>🗑</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ════ ON ME DOIT ════ */}
        {tab==="creditors"&&(
          <div>
            <div style={{ fontSize:12,color:"#4ade80",background:"rgba(74,222,128,0.08)",borderRadius:10,padding:"8px 14px",marginBottom:12,border:"1px solid rgba(74,222,128,0.2)" }}>
              🟢 {t.creditorBanner}
            </div>
            <button onClick={()=>setShowCrForm(!showCrForm)} style={mkBtn("linear-gradient(135deg,#4ade80,#16a34a)","#0d1a0d")}>
              {showCrForm?t.closeTx:t.addCreditor}
            </button>
            {showCrForm&&(
              <div style={{ background:"rgba(74,222,128,0.06)",borderRadius:14,padding:16,marginBottom:16,border:"1px solid rgba(74,222,128,0.22)",marginTop:10 }}>
                <PersonFields form={crForm} setForm={setCrForm} accent="74,222,128" t={t}/>
                <div style={{ fontSize:11,color:"#a89ec9",marginBottom:8,fontStyle:"italic" }}>{t.credDetails}</div>
                <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8 }}>
                  <input type="number" placeholder={t.amount} value={crForm.amount} onChange={e=>setCrForm(p=>({...p,amount:e.target.value}))} style={inp}/>
                  <select value={crForm.currency} onChange={e=>setCrForm(p=>({...p,currency:e.target.value}))} style={inp}>
                    {Object.entries(CURRENCIES).map(([k,v])=><option key={k} value={k}>{k} — {v.name}</option>)}
                  </select>
                </div>
                <input type="date" value={crForm.due} onChange={e=>setCrForm(p=>({...p,due:e.target.value}))} style={inp}/>
                <textarea placeholder={t.note} value={crForm.note} onChange={e=>setCrForm(p=>({...p,note:e.target.value}))} rows={2} style={{...inp,resize:"none"}}/>
                <button onClick={addCr} style={mkBtn("linear-gradient(135deg,#4ade80,#16a34a)","#0d1a0d")}>{t.save}</button>
              </div>
            )}
            {data.creditors.map(d=>{
              const rem=d.remaining??d.amount;
              const pct=Math.round((1-(rem/d.amount))*100);
              const overdue=!d.received&&new Date(d.due)<new Date();
              const isExp=expanded===`cr-${d.id}`;
              return (
                <div key={d.id} style={cardStyle(d.received?"rgba(74,222,128,0.25)":overdue?"rgba(247,201,72,0.3)":"rgba(255,255,255,0.08)")}>
                  <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start" }}>
                    <div style={{ flex:1 }}>
                      <div style={{ display:"flex",alignItems:"center",gap:6,flexWrap:"wrap" }}>
                        <span style={{ fontWeight:"bold",fontSize:14 }}>{d.name}</span>
                        {overdue&&!d.received&&<span style={tagStyle("rgba(247,201,72,0.2)","#f7c948")}>{t.lateReceive}</span>}
                        {d.received&&<span style={tagStyle("rgba(74,222,128,0.2)","#4ade80")}>{t.received}</span>}
                      </div>
                      <div style={{ fontSize:10,color:"#7c6fa0",marginTop:3 }}>{t.expected} : {d.due} · {d.currency}</div>
                      {d.phone  &&<div style={{ fontSize:10,color:"#a89ec9" }}>📞 {d.phone}</div>}
                      {d.address&&<div style={{ fontSize:10,color:"#a89ec9" }}>📍 {d.address}</div>}
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <div style={{ fontWeight:"bold",color:d.received?"#4ade80":"#f7c948",fontSize:15 }}>{fmt(toUSD(rem,d.currency))}</div>
                      {!d.received&&rem<d.amount&&<div style={{ fontSize:10,color:"#7c6fa0" }}>/ {fmt(toUSD(d.amount,d.currency))}</div>}
                    </div>
                  </div>
                  {!d.received&&d.payments&&d.payments.length>0&&(
                    <div style={{ marginTop:8 }}>
                      <div style={{ display:"flex",justifyContent:"space-between",marginBottom:3 }}>
                        <span style={{ fontSize:10,color:"#7c6fa0" }}>{t.progress}</span>
                        <span style={{ fontSize:10,color:"#4ade80" }}>{pct}{t.recPct}</span>
                      </div>
                      <div style={{ height:4,background:"rgba(255,255,255,0.1)",borderRadius:4 }}>
                        <div style={{ height:"100%",width:`${pct}%`,background:"linear-gradient(90deg,#4ade80,#22c55e)",borderRadius:4 }}/>
                      </div>
                    </div>
                  )}
                  {isExp&&<PersonCard item={d} accent="#4ade80" t={t}/>}
                  {dc!==d.currency&&<div style={{ fontSize:10,color:"#5c5070",marginTop:4 }}>{t.original} : {fmtAmt(d.amount,d.currency)}</div>}
                  <div style={{ display:"flex",gap:8,marginTop:10 }}>
                    {!d.received&&<button onClick={()=>setPartialModal({type:"cr",id:d.id,item:d})} style={{ flex:1,padding:"8px",border:"1px solid rgba(247,201,72,0.4)",borderRadius:8,background:"rgba(247,201,72,0.1)",color:"#f7c948",cursor:"pointer",fontSize:12,fontFamily:"Georgia,serif" }}>{t.partialReceive}</button>}
                    <button onClick={()=>toggleRec(d.id)} style={{ flex:1,padding:"8px",border:`1px solid ${d.received?"#4ade80":"rgba(74,222,128,0.35)"}`,borderRadius:8,background:d.received?"rgba(74,222,128,0.12)":"transparent",color:"#4ade80",cursor:"pointer",fontSize:12,fontFamily:"Georgia,serif" }}>{d.received?t.markNotReceived:t.markReceived}</button>
                    <button onClick={()=>setExpanded(isExp?null:`cr-${d.id}`)} style={{ padding:"8px 10px",background:"none",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,color:"#a89ec9",cursor:"pointer",fontSize:14 }}>👁</button>
                    <button onClick={()=>delCr(d.id)} style={{ padding:"8px 10px",background:"none",border:"none",color:"#4a4060",cursor:"pointer",fontSize:14 }}>🗑</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ════ RÉGLAGES ════ */}
        {tab==="settings"&&(
          <div>
            {/* LANGUE */}
            <div style={{ background:"rgba(255,255,255,0.04)",borderRadius:14,padding:16,marginBottom:14,border:"1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ fontSize:14,color:"#f7c948",fontWeight:"bold",marginBottom:14 }}>{t.language}</div>
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10 }}>
                {[{code:"fr",label:"🇫🇷 Français"},{code:"en",label:"🇬🇧 English"}].map(l=>(
                  <button key={l.code} onClick={()=>setLang(l.code)} style={{
                    padding:"14px",borderRadius:12,cursor:"pointer",fontFamily:"Georgia,serif",fontSize:14,
                    border:`2px solid ${lang===l.code?"#f7c948":"rgba(255,255,255,0.1)"}`,
                    background:lang===l.code?"rgba(247,201,72,0.15)":"rgba(255,255,255,0.04)",
                    color:lang===l.code?"#f7c948":"#a89ec9",fontWeight:lang===l.code?"bold":"normal",
                  }}>{l.label}</button>
                ))}
              </div>
            </div>

            {/* PIN */}
            <div style={{ background:"rgba(255,255,255,0.04)",borderRadius:14,padding:16,marginBottom:14,border:"1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ fontSize:14,color:"#f7c948",fontWeight:"bold",marginBottom:12 }}>{t.security}</div>
              {data.pinEnabled?(
                <div>
                  <div style={{ fontSize:13,color:"#4ade80",marginBottom:12 }}>{t.pinActive}</div>
                  <button onClick={disablePin} style={{ ...mkBtn("rgba(248,113,113,0.2)","#f87171"),border:"1px solid rgba(248,113,113,0.3)" }}>{t.disablePin}</button>
                  <button onClick={()=>{disablePin();setTimeout(()=>setSettingPin("new1"),100);}} style={{ ...mkBtn("rgba(255,255,255,0.07)","#f0e6d3"),border:"1px solid rgba(255,255,255,0.15)",marginTop:8 }}>{t.changePin}</button>
                </div>
              ):(
                <div>
                  <div style={{ fontSize:13,color:"#7c6fa0",marginBottom:12 }}>{t.noPinMsg}</div>
                  <button onClick={()=>setSettingPin("new1")} style={mkBtn("linear-gradient(135deg,#f7c948,#e87c2f)")}>{t.enablePin}</button>
                </div>
              )}
            </div>

            {/* CATEGORIES */}
            <div style={{ background:"rgba(255,255,255,0.04)",borderRadius:14,padding:16,marginBottom:14,border:"1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ fontSize:14,color:"#f7c948",fontWeight:"bold",marginBottom:12 }}>{t.customCats}</div>
              {["income","expense"].map(type=>(
                <div key={type} style={{ marginBottom:14 }}>
                  <div style={{ fontSize:12,color:type==="income"?"#4ade80":"#f87171",marginBottom:8,fontWeight:"bold" }}>
                    {type==="income"?t.incomeLabel:t.expenseLabel}
                  </div>
                  <div style={{ display:"flex",flexWrap:"wrap",gap:6,marginBottom:8 }}>
                    {cats[type].map(c=>(
                      <div key={c} style={{ display:"flex",alignItems:"center",gap:4,background:"rgba(255,255,255,0.07)",borderRadius:20,padding:"4px 10px" }}>
                        <span style={{ fontSize:12,color:"#f0e6d3" }}>{c}</span>
                        <button onClick={()=>delCat(type,c)} style={{ background:"none",border:"none",color:"#7c6fa0",cursor:"pointer",fontSize:12,padding:0,lineHeight:1 }}>×</button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <div style={{ display:"flex",gap:8,alignItems:"center" }}>
                <select value={newCat.type} onChange={e=>setNewCat(p=>({...p,type:e.target.value}))} style={{...inp,marginBottom:0,flex:"0 0 100px",fontSize:12}}>
                  <option value="income">{t.incomeOpt}</option>
                  <option value="expense">{t.expenseOpt}</option>
                </select>
                <input placeholder={t.newCat} value={newCat.name} onChange={e=>setNewCat(p=>({...p,name:e.target.value}))} style={{...inp,marginBottom:0,flex:1}}/>
                <button onClick={addCatFn} style={{ padding:"11px 12px",background:"linear-gradient(135deg,#f7c948,#e87c2f)",border:"none",borderRadius:10,color:"#1a1a2e",fontWeight:"bold",cursor:"pointer",fontFamily:"Georgia,serif",whiteSpace:"nowrap" }}>{t.addCat}</button>
              </div>
            </div>

            {/* DANGER */}
            <div style={{ background:"rgba(248,113,113,0.06)",borderRadius:14,padding:16,border:"1px solid rgba(248,113,113,0.2)" }}>
              <div style={{ fontSize:14,color:"#f87171",fontWeight:"bold",marginBottom:12 }}>{t.danger}</div>
              <button onClick={()=>{if(window.confirm(t.clearConfirm))setData(EMPTY_DATA());}}
                style={{ ...mkBtn("rgba(248,113,113,0.15)","#f87171"),border:"1px solid rgba(248,113,113,0.3)" }}>
                {t.clearAll}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
