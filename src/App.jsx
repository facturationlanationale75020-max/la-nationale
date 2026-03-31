import { useState, useMemo } from "react";

const INITIAL_SALARIES = [
  { id: 1, nom: "Dupont", prenom: "Marie", dob: "1988-03-12", contrat: "CDI", finCDD: "", typeCarte: "Carte nationale", finCarte: "", chantierId: 1, logementId: 1, actif: true },
  { id: 2, nom: "Martin", prenom: "Jean", dob: "1992-07-24", contrat: "CDI", finCDD: "", typeCarte: "Carte nationale", finCarte: "", chantierId: 1, logementId: 1, actif: true },
  { id: 3, nom: "Benali", prenom: "Karim", dob: "1995-11-05", contrat: "CDD", finCDD: "2026-04-30", typeCarte: "Carte de séjour", finCarte: "2026-04-15", chantierId: 2, logementId: 2, actif: true },
  { id: 4, nom: "Leroy", prenom: "Sophie", dob: "1990-01-30", contrat: "CDI", finCDD: "", typeCarte: "Carte nationale", finCarte: "", chantierId: 2, logementId: 2, actif: true },
  { id: 5, nom: "Diallo", prenom: "Ibrahim", dob: "1987-06-18", contrat: "CDI", finCDD: "", typeCarte: "Carte de séjour", finCarte: "2026-08-20", chantierId: 3, logementId: 3, actif: true },
  { id: 6, nom: "Nguyen", prenom: "Linh", dob: "1993-09-22", contrat: "CDD", finCDD: "2026-05-15", typeCarte: "Carte de séjour", finCarte: "2025-12-01", chantierId: 3, logementId: 3, actif: true },
  { id: 7, nom: "Garcia", prenom: "Carlos", dob: "1991-04-14", contrat: "CDI", finCDD: "", typeCarte: "Passeport", finCarte: "", chantierId: 4, logementId: 4, actif: true },
  { id: 8, nom: "Petit", prenom: "Isabelle", dob: "1986-12-03", contrat: "CDI", finCDD: "", typeCarte: "Carte nationale", finCarte: "", chantierId: 4, logementId: 4, actif: true },
];
const INITIAL_CHANTIERS = [
  { id: 1, client: "Carrefour Market", adresse: "15 Rue du Commerce, 75015 Paris", frequence: "Journalier", actif: true },
  { id: 2, client: "Immeuble Haussmann", adresse: "42 Blvd Haussmann, 75009 Paris", frequence: "Hebdomadaire", actif: true },
  { id: 3, client: "Lycee Jean Moulin", adresse: "8 Rue des Ecoles, 69007 Lyon", frequence: "Journalier", actif: true },
  { id: 4, client: "Centre Commercial Odysseum", adresse: "1 Rue Henri Germain, 34000 Montpellier", frequence: "Journalier", actif: true },
  { id: 5, client: "Clinique Saint-Louis", adresse: "23 Av. de la Sante, 31000 Toulouse", frequence: "Journalier", actif: false },
];
const INITIAL_CONTRATS = [
  { id: 1, chantierId: 1, client: "Carrefour Market", debut: "2024-01-01", fin: "2026-12-31", montant: 3200, statut: "Actif" },
  { id: 2, chantierId: 2, client: "Immeuble Haussmann", debut: "2024-06-01", fin: "2025-05-31", montant: 1800, statut: "Actif" },
  { id: 3, chantierId: 3, client: "Lycee Jean Moulin", debut: "2023-09-01", fin: "2026-06-30", montant: 2600, statut: "Actif" },
  { id: 4, chantierId: 4, client: "Centre Commercial Odysseum", debut: "2025-01-15", fin: "2025-12-15", montant: 4100, statut: "Actif" },
  { id: 5, chantierId: 5, client: "Clinique Saint-Louis", debut: "2023-03-01", fin: "2025-02-28", montant: 5500, statut: "Expire" },
];
const INITIAL_LOGEMENTS = [
  { id: 1, adresse: "3 Impasse des Lilas, 75020 Paris", occupants: [1,2], loyer: 1200, assurance: "2026-03-15", etat: "Bon" },
  { id: 2, adresse: "17 Rue Voltaire, 75011 Paris", occupants: [3,4], loyer: 980, assurance: "2025-06-01", etat: "Moyen" },
  { id: 3, adresse: "5 Allee des Roses, 69003 Lyon", occupants: [5,6], loyer: 850, assurance: "2026-09-30", etat: "Bon" },
  { id: 4, adresse: "12 Rue du Soleil, 34000 Montpellier", occupants: [7,8], loyer: 760, assurance: "2025-04-10", etat: "Bon" },
];
const today = new Date().toISOString().split("T")[0];
const INITIAL_PRESENCES = INITIAL_SALARIES.map(s => ({ salaryId: s.id, date: today, statut: "Present" }));
const INITIAL_INTERVENTIONS = [
  { id: 1, chantierId: 1, type: "Reguliere", date: today, heure: "06:00", fait: true, note: "" },
  { id: 2, chantierId: 2, type: "Reguliere", date: today, heure: "08:00", fait: false, note: "" },
  { id: 3, chantierId: 3, type: "Reguliere", date: today, heure: "07:00", fait: true, note: "" },
  { id: 4, chantierId: 4, type: "Reguliere", date: today, heure: "05:30", fait: true, note: "" },
  { id: 5, chantierId: 1, type: "Ponctuelle", date: "2026-03-30", heure: "10:00", fait: false, note: "Remise en etat" },
];

const sColor = (s) => ({"Present":"#10b981","Absent":"#ef4444","Conge":"#f59e0b","Maladie":"#8b5cf6"}[s]||"#6b7280");
const sBg = (s) => ({"Present":"#d1fae5","Absent":"#fee2e2","Conge":"#fef3c7","Maladie":"#ede9fe"}[s]||"#f3f4f6");
const fmtDate = (d) => d ? new Date(d).toLocaleDateString("fr-FR") : "--";
const expSoon = (d,days=60) => { if(!d) return false; const diff=(new Date(d)-new Date())/(864e5); return diff>=0&&diff<=days; };
const expired = (d) => d && new Date(d)<new Date();

const Badge = ({children,color="#10b981",bg="#d1fae5"}) => <span style={{background:bg,color,borderRadius:20,padding:"2px 10px",fontSize:11,fontWeight:700,display:"inline-block"}}>{children}</span>;
const Card = ({children,style={}}) => <div style={{background:"#fff",borderRadius:16,padding:"20px 24px",boxShadow:"0 1px 4px rgba(0,0,0,0.06)",...style}}>{children}</div>;
const iS = {width:"100%",padding:"9px 12px",borderRadius:8,border:"1.5px solid #e5e7eb",fontSize:13,fontFamily:"inherit",color:"#1f2937",outline:"none",boxSizing:"border-box",background:"#f9fafb"};
const Btn = ({children,onClick,variant="primary",small,style={}}) => {
  const v={primary:{background:"#1a3c5e",color:"#fff"},success:{background:"#10b981",color:"#fff"},danger:{background:"#ef4444",color:"#fff"},ghost:{background:"transparent",color:"#1a3c5e",border:"1.5px solid #1a3c5e"},warning:{background:"#f59e0b",color:"#fff"}};
  return <button onClick={onClick} style={{...v[variant],border:"none",borderRadius:8,cursor:"pointer",padding:small?"6px 14px":"10px 20px",fontWeight:600,fontSize:small?12:13,fontFamily:"inherit",...style}}>{children}</button>;
};
const Inp = ({label,value,onChange,type="text",options}) => (
  <div style={{marginBottom:14}}>
    {label&&<label style={{display:"block",fontSize:12,fontWeight:600,color:"#6b7280",marginBottom:4}}>{label}</label>}
    {options?<select value={value} onChange={e=>onChange(e.target.value)} style={iS}>{options.map(o=><option key={o}>{o}</option>)}</select>:<input type={type} value={value} onChange={e=>onChange(e.target.value)} style={iS}/>}
  </div>
);
const Modal = ({title,onClose,children}) => (
  <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.45)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={onClose}>
    <div style={{background:"#fff",borderRadius:20,padding:32,width:480,maxWidth:"95vw",maxHeight:"85vh",overflowY:"auto",boxShadow:"0 20px 60px rgba(0,0,0,0.2)"}} onClick={e=>e.stopPropagation()}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <h3 style={{margin:0,fontSize:18,color:"#1a3c5e"}}>{title}</h3>
        <button onClick={onClose} style={{background:"none",border:"none",fontSize:22,cursor:"pointer",color:"#9ca3af"}}>x</button>
      </div>
      {children}
    </div>
  </div>
);

const USERS = [
  { email: "admin@lanationale.fr", password: "Admin2024!", role: "Admin" },
  { email: "manager@lanationale.fr", password: "Manager2024!", role: "Manager" },
];

function Login({ onLogin }) {
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");
  const handleLogin = () => {
    setLoading(true); setError("");
    setTimeout(() => {
      const user = USERS.find(u=>u.email===email&&u.password===password);
      if(user){onLogin(user);}else{setError("Email ou mot de passe incorrect");}
      setLoading(false);
    },800);
  };
  return (
    <div style={{minHeight:"100vh",background:"#1a3c5e",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'DM Sans','Segoe UI',system-ui,sans-serif"}}>
      <div style={{background:"#fff",borderRadius:24,padding:"48px 40px",width:400,maxWidth:"90vw",boxShadow:"0 20px 60px rgba(0,0,0,0.3)"}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{fontSize:48,marginBottom:12}}>🧹</div>
          <div style={{fontWeight:800,fontSize:24,color:"#1a3c5e"}}>La Nationale</div>
          <div style={{fontSize:13,color:"#9ca3af",marginTop:4}}>Gestion multi-sites</div>
        </div>
        <div style={{marginBottom:16}}>
          <label style={{display:"block",fontSize:12,fontWeight:700,color:"#6b7280",marginBottom:6}}>EMAIL</label>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="votre@email.com" onKeyDown={e=>e.key==="Enter"&&handleLogin()} style={{width:"100%",padding:"12px 16px",borderRadius:10,border:"1.5px solid #e5e7eb",fontSize:14,fontFamily:"inherit",outline:"none",boxSizing:"border-box"}}/>
        </div>
        <div style={{marginBottom:24}}>
          <label style={{display:"block",fontSize:12,fontWeight:700,color:"#6b7280",marginBottom:6}}>MOT DE PASSE</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" onKeyDown={e=>e.key==="Enter"&&handleLogin()} style={{width:"100%",padding:"12px 16px",borderRadius:10,border:"1.5px solid #e5e7eb",fontSize:14,fontFamily:"inherit",outline:"none",boxSizing:"border-box"}}/>
        </div>
        {error&&<div style={{background:"#fee2e2",color:"#ef4444",borderRadius:8,padding:"10px 14px",fontSize:13,marginBottom:16,textAlign:"center"}}>🔴 {error}</div>}
        <button onClick={handleLogin} disabled={loading} style={{width:"100%",padding:"14px",borderRadius:10,border:"none",background:"#1a3c5e",color:"#fff",fontSize:15,fontWeight:700,fontFamily:"inherit",cursor:"pointer",opacity:loading?0.7:1}}>
          {loading?"Connexion en cours...":"Se connecter"}
        </button>
        <div style={{textAlign:"center",marginTop:20,fontSize:12,color:"#9ca3af"}}>Acces reserve aux administrateurs et managers</div>
        <div style={{marginTop:24,padding:16,background:"#f8fafc",borderRadius:10,fontSize:12,color:"#6b7280"}}>
          <div style={{fontWeight:700,marginBottom:6}}>Comptes de test :</div>
          <div>Admin : admin@lanationale.fr / Admin2024!</div>
          <div>Manager : manager@lanationale.fr / Manager2024!</div>
        </div>
      </div>
    </div>
  );
}

function Dashboard({salaries,chantiers,presences,interventions,contrats,logements}) {
  const tp=presences.filter(p=>p.date===today);
  const presents=tp.filter(p=>p.statut==="Present").length;
  const absents=tp.filter(p=>p.statut==="Absent").length;
  const conges=tp.filter(p=>p.statut==="Conge"||p.statut==="Maladie").length;
  const iJ=interventions.filter(i=>i.date===today);
  const iNF=iJ.filter(i=>!i.fait);
  const cA=chantiers.filter(c=>c.actif).length;
  const alerts=[];
  contrats.forEach(c=>{if(expired(c.fin))alerts.push({type:"danger",msg:"Contrat expire : "+c.client});else if(expSoon(c.fin))alerts.push({type:"warning",msg:"Contrat bientot expire : "+c.client});});
  logements.forEach(l=>{if(expired(l.assurance))alerts.push({type:"danger",msg:"Assurance expiree : "+l.adresse});else if(expSoon(l.assurance))alerts.push({type:"warning",msg:"Assurance bientot expiree"});});
  salaries.forEach(s=>{
    const n=s.prenom+" "+s.nom;
    if(s.contrat==="CDD"&&s.finCDD){if(expired(s.finCDD))alerts.push({type:"danger",msg:"CDD expire : "+n});else if(expSoon(s.finCDD))alerts.push({type:"warning",msg:"CDD bientot expire : "+n});}
    if(s.typeCarte==="Carte de sejour"&&s.finCarte){if(expired(s.finCarte))alerts.push({type:"danger",msg:"Carte sejour expiree : "+n});else if(expSoon(s.finCarte,30))alerts.push({type:"warning",msg:"Carte sejour bientot expiree : "+n});}
  });
  if(iNF.length>0)alerts.push({type:"warning",msg:iNF.length+" intervention(s) non effectuee(s) aujourd'hui"});
  if(absents>0)alerts.push({type:"warning",msg:absents+" salarie(s) absent(s)"});
  const sc=[{label:"Chantiers actifs",value:cA,icon:"🏗️",color:"#1a3c5e",bg:"#e8eef5"},{label:"Presents",value:presents,icon:"✅",color:"#10b981",bg:"#d1fae5"},{label:"Absents/Conges",value:absents+conges,icon:"🔴",color:"#ef4444",bg:"#fee2e2"},{label:"Interventions",value:iJ.length,icon:"🧹",color:"#f59e0b",bg:"#fef3c7"}];
  return (
    <div>
      <h2 style={{margin:"0 0 24px",fontSize:24,color:"#1a3c5e"}}>Tableau de bord</h2>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:16,marginBottom:28}}>
        {sc.map(c=><Card key={c.label} style={{background:c.bg,borderLeft:"4px solid "+c.color}}><div style={{fontSize:28,marginBottom:6}}>{c.icon}</div><div style={{fontSize:32,fontWeight:800,color:c.color}}>{c.value}</div><div style={{fontSize:13,color:"#6b7280"}}>{c.label}</div></Card>)}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
        <Card>
          <h3 style={{margin:"0 0 16px",fontSize:15,color:"#1a3c5e"}}>🔔 Alertes ({alerts.length})</h3>
          {alerts.length===0?<p style={{color:"#10b981",fontSize:13}}>✅ Aucune alerte</p>:alerts.map((a,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 12px",borderRadius:8,marginBottom:6,background:a.type==="danger"?"#fee2e2":"#fef3c7",borderLeft:"3px solid "+(a.type==="danger"?"#ef4444":"#f59e0b")}}>
              <span>{a.type==="danger"?"🔴":"🟠"}</span><span style={{fontSize:12,color:"#374151"}}>{a.msg}</span>
            </div>
          ))}
        </Card>
        <Card>
          <h3 style={{margin:"0 0 16px",fontSize:15,color:"#1a3c5e"}}>🧹 Interventions du jour</h3>
          {iJ.length===0?<p style={{color:"#6b7280",fontSize:13}}>Aucune</p>:iJ.map(i=>{const ch=chantiers.find(c=>c.id===i.chantierId);return(
            <div key={i.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:"1px solid #f3f4f6"}}>
              <div><div style={{fontSize:13,fontWeight:600}}>{ch?.client}</div><div style={{fontSize:11,color:"#9ca3af"}}>{i.heure}</div></div>
              <Badge color={i.fait?"#10b981":"#ef4444"} bg={i.fait?"#d1fae5":"#fee2e2"}>{i.fait?"Faite":"En attente"}</Badge>
            </div>
          );})}
        </Card>
        <Card style={{gridColumn:"1 / -1"}}>
          <h3 style={{margin:"0 0 16px",fontSize:15,color:"#1a3c5e"}}>👥 Presences du jour</h3>
          <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
            {salaries.map(s=>{const p=tp.find(pp=>pp.salaryId===s.id);const st=p?.statut||"--";return(<div key={s.id} style={{background:sBg(st),border:"1.5px solid "+sColor(st)+"20",borderRadius:10,padding:"8px 14px",minWidth:130}}><div style={{fontSize:12,fontWeight:700}}>{s.prenom} {s.nom}</div><div style={{fontSize:11,color:sColor(st),fontWeight:600}}>{st}</div></div>);})}
          </div>
        </Card>
      </div>
    </div>
  );
}

function Presences({salaries,chantiers,presences,setPresences}) {
  const [selDate,setSelDate]=useState(today);
  const [search,setSearch]=useState("");
  const [filterCh,setFilterCh]=useState("Tous");
  const dp=presences.filter(p=>p.date===selDate);
  const getSt=(id)=>{const p=dp.find(p=>p.salaryId===id);return p?.statut||"Present";};
  const setSt=(id,st)=>setPresences(prev=>{const ex=prev.find(p=>p.salaryId===id&&p.date===selDate);if(ex)return prev.map(p=>p.salaryId===id&&p.date===selDate?{...p,statut:st}:p);return[...prev,{salaryId:id,date:selDate,statut:st}];});
  const fil=salaries.filter(s=>{const m=(s.prenom+" "+s.nom).toLowerCase().includes(search.toLowerCase());const ch=chantiers.find(c=>c.id===s.chantierId);const mc=filterCh==="Tous"||ch?.client===filterCh;return m&&mc;});
  const stats=["Present","Absent","Conge","Maladie"].map(s=>({label:s,count:fil.filter(sal=>getSt(sal.id)===s).length}));
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
        <h2 style={{margin:0,fontSize:24,color:"#1a3c5e"}}>Presences</h2>
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          <input type="date" value={selDate} onChange={e=>setSelDate(e.target.value)} style={{...iS,width:"auto"}}/>
          <Btn small variant="success" onClick={()=>alert("Export CSV!")}>📥 Exporter</Btn>
        </div>
      </div>
      <div style={{display:"flex",gap:12,marginBottom:20}}>
        {stats.map(s=><div key={s.label} style={{background:sBg(s.label),borderRadius:10,padding:"10px 20px",textAlign:"center",flex:1}}><div style={{fontSize:24,fontWeight:800,color:sColor(s.label)}}>{s.count}</div><div style={{fontSize:11,color:"#6b7280"}}>{s.label}</div></div>)}
      </div>
      <div style={{display:"flex",gap:12,marginBottom:20}}>
        <input placeholder="Rechercher..." value={search} onChange={e=>setSearch(e.target.value)} style={{...iS,flex:1}}/>
        <select value={filterCh} onChange={e=>setFilterCh(e.target.value)} style={{...iS,width:200}}><option>Tous</option>{chantiers.map(c=><option key={c.id}>{c.client}</option>)}</select>
      </div>
      <Card>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr style={{borderBottom:"2px solid #f3f4f6"}}>{["Salarie","Contrat","Chantier","Statut","Action"].map(h=><th key={h} style={{padding:"10px 12px",textAlign:"left",fontSize:11,fontWeight:700,color:"#9ca3af",textTransform:"uppercase"}}>{h}</th>)}</tr></thead>
          <tbody>
            {fil.map(s=>{const ch=chantiers.find(c=>c.id===s.chantierId);const st=getSt(s.id);return(
              <tr key={s.id} style={{borderBottom:"1px solid #f9fafb"}}>
                <td style={{padding:"12px"}}><div style={{fontWeight:600}}>{s.prenom} {s.nom}</div></td>
                <td style={{padding:"12px"}}><Badge color={s.contrat==="CDI"?"#1a3c5e":"#8b5cf6"} bg={s.contrat==="CDI"?"#e8eef5":"#ede9fe"}>{s.contrat}</Badge></td>
                <td style={{padding:"12px",fontSize:13,color:"#6b7280"}}>{ch?.client||"--"}</td>
                <td style={{padding:"12px"}}><Badge color={sColor(st)} bg={sBg(st)}>{st}</Badge></td>
                <td style={{padding:"12px"}}><div style={{display:"flex",gap:6}}>{["Present","Absent","Conge","Maladie"].map(x=><button key={x} onClick={()=>setSt(s.id,x)} style={{padding:"4px 8px",borderRadius:6,border:"1.5px solid "+sColor(x),background:st===x?sColor(x):"transparent",color:st===x?"#fff":sColor(x),fontSize:10,fontWeight:700,cursor:"pointer"}}>{x}</button>)}</div></td>
              </tr>
            );})}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function Salaries({salaries,setSalaries,chantiers,logements}) {
  const [search,setSearch]=useState("");
  const [modal,setModal]=useState(null);
  const [form,setForm]=useState({nom:"",prenom:"",dob:"",contrat:"CDI",finCDD:"",typeCarte:"Carte nationale",finCarte:"",chantierId:1,logementId:1});
  const fil=salaries.filter(s=>(s.prenom+" "+s.nom).toLowerCase().includes(search.toLowerCase()));
  const openNew=()=>{setForm({nom:"",prenom:"",dob:"",contrat:"CDI",finCDD:"",typeCarte:"Carte nationale",finCarte:"",chantierId:1,logementId:1});setModal("new");};
  const openEdit=(s)=>{setForm({...s});setModal(s.id);};
  const save=()=>{if(modal==="new")setSalaries(prev=>[...prev,{...form,id:Date.now(),actif:true,chantierId:Number(form.chantierId),logementId:Number(form.logementId)}]);else setSalaries(prev=>prev.map(s=>s.id===modal?{...form,id:modal,actif:true,chantierId:Number(form.chantierId),logementId:Number(form.logementId)}:s));setModal(null);};
  const del=(id)=>{if(confirm("Supprimer ?"))setSalaries(prev=>prev.filter(s=>s.id!==id));};
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
        <h2 style={{margin:0,fontSize:24,color:"#1a3c5e"}}>Salaries ({salaries.length})</h2>
        <Btn onClick={openNew}>+ Nouveau</Btn>
      </div>
      <input placeholder="Rechercher..." value={search} onChange={e=>setSearch(e.target.value)} style={{...iS,marginBottom:16}}/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:16}}>
        {fil.map(s=>{
          const ch=chantiers.find(c=>c.id===s.chantierId);
          const lo=logements.find(l=>l.id===s.logementId);
          const cE=s.contrat==="CDD"&&s.finCDD&&expired(s.finCDD);
          const cS=s.contrat==="CDD"&&s.finCDD&&expSoon(s.finCDD)&&!cE;
          const kE=s.typeCarte==="Carte de séjour"&&s.finCarte&&expired(s.finCarte);
          const kS=s.typeCarte==="Carte de séjour"&&s.finCarte&&expSoon(s.finCarte,30)&&!kE;
          return(
            <Card key={s.id} style={{borderTop:"3px solid "+((cE||kE)?"#ef4444":(cS||kS)?"#f59e0b":"#e5e7eb")}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                <div>
                  <div style={{width:40,height:40,borderRadius:"50%",background:"#1a3c5e",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:16,marginBottom:8}}>{s.prenom[0]}{s.nom[0]}</div>
                  <div style={{fontWeight:700,fontSize:16}}>{s.prenom} {s.nom}</div>
                  <div style={{fontSize:12,color:"#9ca3af"}}>Ne(e) le {fmtDate(s.dob)}</div>
                </div>
                <Badge color={s.contrat==="CDI"?"#1a3c5e":"#8b5cf6"} bg={s.contrat==="CDI"?"#e8eef5":"#ede9fe"}>{s.contrat}</Badge>
              </div>
              {s.contrat==="CDD"&&s.finCDD&&<div style={{fontSize:12,marginBottom:4,color:cE?"#ef4444":cS?"#f59e0b":"#6b7280",fontWeight:cE||cS?700:400}}>📅 Fin CDD : {fmtDate(s.finCDD)} {cE?"⚠️ EXPIRE":cS?"⚠️ Bientot":""}</div>}
              <div style={{fontSize:12,color:"#6b7280",marginBottom:2}}>🪪 {s.typeCarte||"--"}</div>
              {s.typeCarte==="Carte de séjour"&&s.finCarte&&<div style={{fontSize:12,marginBottom:4,color:kE?"#ef4444":kS?"#f59e0b":"#6b7280",fontWeight:kE||kS?700:400}}>Validite : {fmtDate(s.finCarte)} {kE?"⚠️ EXPIREE":kS?"⚠️ Bientot":"✅"}</div>}
              <div style={{fontSize:12,color:"#6b7280",marginBottom:4}}>🏗️ {ch?.client||"Non affecte"}</div>
              <div style={{fontSize:12,color:"#6b7280",marginBottom:12}}>🏠 {lo?.adresse?.split(",")[0]||"--"}</div>
              <div style={{display:"flex",gap:8}}>
                <Btn small variant="ghost" onClick={()=>openEdit(s)}>✏️ Modifier</Btn>
                <Btn small variant="danger" onClick={()=>del(s.id)}>🗑️</Btn>
              </div>
            </Card>
          );
        })}
      </div>
      {modal&&(
        <Modal title={modal==="new"?"Nouveau salarie":"Modifier salarie"} onClose={()=>setModal(null)}>
          <Inp label="Prenom" value={form.prenom} onChange={v=>setForm({...form,prenom:v})}/>
          <Inp label="Nom" value={form.nom} onChange={v=>setForm({...form,nom:v})}/>
          <Inp label="Date de naissance" type="date" value={form.dob} onChange={v=>setForm({...form,dob:v})}/>
          <div style={{background:"#f8fafc",borderRadius:10,padding:"12px 14px",marginBottom:14,border:"1px solid #e5e7eb"}}>
            <div style={{fontSize:11,fontWeight:700,color:"#9ca3af",textTransform:"uppercase",marginBottom:10}}>Contrat</div>
            <Inp label="Type" value={form.contrat} onChange={v=>setForm({...form,contrat:v,finCDD:v==="CDI"?"":form.finCDD})} options={["CDI","CDD"]}/>
            {form.contrat==="CDD"&&<Inp label="Date de fin CDD" type="date" value={form.finCDD} onChange={v=>setForm({...form,finCDD:v})}/>}
          </div>
          <div style={{background:"#f8fafc",borderRadius:10,padding:"12px 14px",marginBottom:14,border:"1px solid #e5e7eb"}}>
            <div style={{fontSize:11,fontWeight:700,color:"#9ca3af",textTransform:"uppercase",marginBottom:10}}>Piece d'identite</div>
            <Inp label="Type de carte" value={form.typeCarte} onChange={v=>setForm({...form,typeCarte:v,finCarte:v!=="Carte de séjour"?"":form.finCarte})} options={["Carte nationale","Carte de séjour","Passeport","Autre"]}/>
            {form.typeCarte==="Carte de séjour"&&<Inp label="Date de fin validite" type="date" value={form.finCarte} onChange={v=>setForm({...form,finCarte:v})}/>}
          </div>
          <div style={{marginBottom:14}}><label style={{display:"block",fontSize:12,fontWeight:600,color:"#6b7280",marginBottom:4}}>Chantier</label><select value={form.chantierId} onChange={e=>setForm({...form,chantierId:e.target.value})} style={iS}>{chantiers.map(c=><option key={c.id} value={c.id}>{c.client}</option>)}</select></div>
          <div style={{marginBottom:14}}><label style={{display:"block",fontSize:12,fontWeight:600,color:"#6b7280",marginBottom:4}}>Logement</label><select value={form.logementId} onChange={e=>setForm({...form,logementId:e.target.value})} style={iS}>{logements.map(l=><option key={l.id} value={l.id}>{l.adresse.split(",")[0]}</option>)}</select></div>
          <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:8}}>
            <Btn variant="ghost" onClick={()=>setModal(null)}>Annuler</Btn>
            <Btn onClick={save}>Enregistrer</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Chantiers({chantiers,setChantiers,salaries}) {
  const [modal,setModal]=useState(null);
  const [form,setForm]=useState({client:"",adresse:"",frequence:"Journalier",actif:true});
  const openNew=()=>{setForm({client:"",adresse:"",frequence:"Journalier",actif:true});setModal("new");};
  const openEdit=(c)=>{setForm({...c});setModal(c.id);};
  const save=()=>{if(modal==="new")setChantiers(prev=>[...prev,{...form,id:Date.now()}]);else setChantiers(prev=>prev.map(c=>c.id===modal?{...form,id:modal}:c));setModal(null);};
  const del=(id)=>{if(confirm("Supprimer ?"))setChantiers(prev=>prev.filter(c=>c.id!==id));};
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
        <h2 style={{margin:0,fontSize:24,color:"#1a3c5e"}}>Chantiers ({chantiers.length})</h2>
        <Btn onClick={openNew}>+ Nouveau</Btn>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))",gap:16}}>
        {chantiers.map(c=>{const aff=salaries.filter(s=>s.chantierId===c.id);return(
          <Card key={c.id} style={{borderTop:"4px solid "+(c.actif?"#10b981":"#9ca3af")}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
              <Badge color={c.actif?"#10b981":"#6b7280"} bg={c.actif?"#d1fae5":"#f3f4f6"}>{c.actif?"Actif":"Inactif"}</Badge>
              <Badge color="#1a3c5e" bg="#e8eef5">{c.frequence}</Badge>
            </div>
            <div style={{fontWeight:700,fontSize:16,marginBottom:6}}>🏢 {c.client}</div>
            <div style={{fontSize:12,color:"#6b7280",marginBottom:10}}>📍 {c.adresse}</div>
            <div style={{fontSize:12,color:"#374151",marginBottom:14}}>👥 {aff.length} salarie(s) : {aff.map(s=>s.prenom+" "+s.nom).join(", ")||"Aucun"}</div>
            <div style={{display:"flex",gap:8}}>
              <Btn small variant="ghost" onClick={()=>openEdit(c)}>✏️ Modifier</Btn>
              <Btn small variant={c.actif?"warning":"success"} onClick={()=>setChantiers(prev=>prev.map(x=>x.id===c.id?{...x,actif:!x.actif}:x))}>{c.actif?"Desactiver":"Activer"}</Btn>
              <Btn small variant="danger" onClick={()=>del(c.id)}>🗑️</Btn>
            </div>
          </Card>
        );})}
      </div>
      {modal&&(
        <Modal title={modal==="new"?"Nouveau chantier":"Modifier chantier"} onClose={()=>setModal(null)}>
          <Inp label="Client" value={form.client} onChange={v=>setForm({...form,client:v})}/>
          <Inp label="Adresse" value={form.adresse} onChange={v=>setForm({...form,adresse:v})}/>
          <Inp label="Frequence" value={form.frequence} onChange={v=>setForm({...form,frequence:v})} options={["Journalier","Hebdomadaire","Mensuel","Ponctuel"]}/>
          <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:8}}>
            <Btn variant="ghost" onClick={()=>setModal(null)}>Annuler</Btn>
            <Btn onClick={save}>Enregistrer</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Logements({logements,setLogements,salaries}) {
  const [modal,setModal]=useState(null);
  const [form,setForm]=useState({adresse:"",loyer:"",assurance:"",etat:"Bon"});
  const openNew=()=>{setForm({adresse:"",loyer:"",assurance:"",etat:"Bon"});setModal("new");};
  const openEdit=(l)=>{setForm({...l});setModal(l.id);};
  const save=()=>{if(modal==="new")setLogements(prev=>[...prev,{...form,id:Date.now(),occupants:[],loyer:Number(form.loyer)}]);else setLogements(prev=>prev.map(l=>l.id===modal?{...form,id:modal,loyer:Number(form.loyer)}:l));setModal(null);};
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
        <h2 style={{margin:0,fontSize:24,color:"#1a3c5e"}}>Logements ({logements.length})</h2>
        <Btn onClick={openNew}>+ Nouveau</Btn>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))",gap:16}}>
        {logements.map(l=>{
          const occ=salaries.filter(s=>l.occupants?.includes(s.id));
          const aA=expired(l.assurance)?"danger":expSoon(l.assurance)?"warning":"ok";
          return(
            <Card key={l.id} style={{borderLeft:"4px solid "+(aA==="danger"?"#ef4444":aA==="warning"?"#f59e0b":"#10b981")}}>
              <div style={{fontWeight:700,fontSize:15,marginBottom:6}}>🏠 {l.adresse}</div>
              <div style={{fontSize:13,color:"#6b7280",marginBottom:4}}>💶 {l.loyer} euro/mois</div>
              <div style={{fontSize:13,color:aA==="danger"?"#ef4444":aA==="warning"?"#f59e0b":"#10b981",marginBottom:4}}>🛡️ Assurance : {fmtDate(l.assurance)} {aA!=="ok"?(aA==="danger"?"⚠️ EXPIREE":"⚠️ Bientot"):"✅"}</div>
              <div style={{fontSize:13,color:"#6b7280",marginBottom:4}}>Etat : {l.etat}</div>
              <div style={{fontSize:12,color:"#374151",marginBottom:14}}>👥 {occ.length>0?occ.map(s=>s.prenom+" "+s.nom).join(", "):"Inoccupe"}</div>
              <Btn small variant="ghost" onClick={()=>openEdit(l)}>✏️ Modifier</Btn>
            </Card>
          );
        })}
      </div>
      {modal&&(
        <Modal title={modal==="new"?"Nouveau logement":"Modifier logement"} onClose={()=>setModal(null)}>
          <Inp label="Adresse" value={form.adresse} onChange={v=>setForm({...form,adresse:v})}/>
          <Inp label="Loyer (euro)" type="number" value={form.loyer} onChange={v=>setForm({...form,loyer:v})}/>
          <Inp label="Expiration assurance" type="date" value={form.assurance} onChange={v=>setForm({...form,assurance:v})}/>
          <Inp label="Etat" value={form.etat} onChange={v=>setForm({...form,etat:v})} options={["Bon","Moyen","Mauvais"]}/>
          <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:8}}>
            <Btn variant="ghost" onClick={()=>setModal(null)}>Annuler</Btn>
            <Btn onClick={save}>Enregistrer</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Contrats({contrats,setContrats,chantiers}) {
  const [modal,setModal]=useState(null);
  const [form,setForm]=useState({client:"",chantierId:"",debut:"",fin:"",montant:"",statut:"Actif"});
  const openNew=()=>{setForm({client:"",chantierId:"",debut:"",fin:"",montant:"",statut:"Actif"});setModal("new");};
  const openEdit=(c)=>{setForm({...c});setModal(c.id);};
  const save=()=>{if(modal==="new")setContrats(prev=>[...prev,{...form,id:Date.now(),montant:Number(form.montant),chantierId:Number(form.chantierId)}]);else setContrats(prev=>prev.map(c=>c.id===modal?{...form,id:modal,montant:Number(form.montant)}:c));setModal(null);};
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
        <h2 style={{margin:0,fontSize:24,color:"#1a3c5e"}}>Contrats ({contrats.length})</h2>
        <Btn onClick={openNew}>+ Nouveau</Btn>
      </div>
      <Card>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr style={{borderBottom:"2px solid #f3f4f6"}}>{["Client","Chantier","Debut","Fin","Montant","Statut","Action"].map(h=><th key={h} style={{padding:"10px 12px",textAlign:"left",fontSize:11,fontWeight:700,color:"#9ca3af",textTransform:"uppercase"}}>{h}</th>)}</tr></thead>
          <tbody>
            {contrats.map(c=>{const ch=chantiers.find(x=>x.id===c.chantierId);const al=expired(c.fin)?"danger":expSoon(c.fin)?"warning":"ok";return(
              <tr key={c.id} style={{borderBottom:"1px solid #f9fafb",background:al==="danger"?"#fff5f5":al==="warning"?"#fffbeb":"transparent"}}>
                <td style={{padding:"12px",fontWeight:600}}>{c.client}</td>
                <td style={{padding:"12px",fontSize:13,color:"#6b7280"}}>{ch?.client||"--"}</td>
                <td style={{padding:"12px",fontSize:13}}>{fmtDate(c.debut)}</td>
                <td style={{padding:"12px",fontSize:13}}>{fmtDate(c.fin)}{al!=="ok"&&<span style={{marginLeft:6,fontSize:11,color:al==="danger"?"#ef4444":"#f59e0b"}}>⚠️</span>}</td>
                <td style={{padding:"12px",fontWeight:700,color:"#1a3c5e"}}>{c.montant?.toLocaleString()} euro</td>
                <td style={{padding:"12px"}}><Badge color={c.statut==="Actif"?"#10b981":"#ef4444"} bg={c.statut==="Actif"?"#d1fae5":"#fee2e2"}>{c.statut}</Badge></td>
                <td style={{padding:"12px"}}><Btn small variant="ghost" onClick={()=>openEdit(c)}>✏️</Btn></td>
              </tr>
            );})}
          </tbody>
        </table>
      </Card>
      {modal&&(
        <Modal title={modal==="new"?"Nouveau contrat":"Modifier contrat"} onClose={()=>setModal(null)}>
          <Inp label="Client" value={form.client} onChange={v=>setForm({...form,client:v})}/>
          <div style={{marginBottom:14}}><label style={{display:"block",fontSize:12,fontWeight:600,color:"#6b7280",marginBottom:4}}>Chantier</label><select value={form.chantierId} onChange={e=>setForm({...form,chantierId:e.target.value})} style={iS}><option value="">-- Choisir --</option>{chantiers.map(c=><option key={c.id} value={c.id}>{c.client}</option>)}</select></div>
          <Inp label="Debut" type="date" value={form.debut} onChange={v=>setForm({...form,debut:v})}/>
          <Inp label="Fin" type="date" value={form.fin} onChange={v=>setForm({...form,fin:v})}/>
          <Inp label="Montant mensuel" type="number" value={form.montant} onChange={v=>setForm({...form,montant:v})}/>
          <Inp label="Statut" value={form.statut} onChange={v=>setForm({...form,statut:v})} options={["Actif","Expire","Suspendu"]}/>
          <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:8}}>
            <Btn variant="ghost" onClick={()=>setModal(null)}>Annuler</Btn>
            <Btn onClick={save}>Enregistrer</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Interventions({interventions,setInterventions,chantiers}) {
  const [modal,setModal]=useState(null);
  const [form,setForm]=useState({chantierId:1,type:"Reguliere",date:today,heure:"08:00",fait:false,note:""});
  const [filter,setFilter]=useState("Toutes");
  const openNew=()=>{setForm({chantierId:1,type:"Reguliere",date:today,heure:"08:00",fait:false,note:""});setModal("new");};
  const save=()=>{if(modal==="new")setInterventions(prev=>[...prev,{...form,id:Date.now(),chantierId:Number(form.chantierId)}]);else setInterventions(prev=>prev.map(i=>i.id===modal?{...form,id:modal}:i));setModal(null);};
  const toggle=(id)=>setInterventions(prev=>prev.map(i=>i.id===id?{...i,fait:!i.fait}:i));
  const fil=interventions.filter(i=>filter==="Toutes"||i.type===filter);
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
        <h2 style={{margin:0,fontSize:24,color:"#1a3c5e"}}>Interventions</h2>
        <Btn onClick={openNew}>+ Planifier</Btn>
      </div>
      <div style={{display:"flex",gap:10,marginBottom:20}}>
        {["Toutes","Reguliere","Ponctuelle"].map(f=><Btn key={f} small variant={filter===f?"primary":"ghost"} onClick={()=>setFilter(f)}>{f}</Btn>)}
      </div>
      <Card>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr style={{borderBottom:"2px solid #f3f4f6"}}>{["Chantier","Type","Date","Heure","Statut","Note","Action"].map(h=><th key={h} style={{padding:"10px 12px",textAlign:"left",fontSize:11,fontWeight:700,color:"#9ca3af",textTransform:"uppercase"}}>{h}</th>)}</tr></thead>
          <tbody>
            {fil.sort((a,b)=>b.date.localeCompare(a.date)).map(i=>{const ch=chantiers.find(c=>c.id===i.chantierId);return(
              <tr key={i.id} style={{borderBottom:"1px solid #f9fafb"}}>
                <td style={{padding:"12px",fontWeight:600}}>{ch?.client||"--"}</td>
                <td style={{padding:"12px"}}><Badge color={i.type==="Reguliere"?"#1a3c5e":"#8b5cf6"} bg={i.type==="Reguliere"?"#e8eef5":"#ede9fe"}>{i.type}</Badge></td>
                <td style={{padding:"12px",fontSize:13}}>{fmtDate(i.date)}</td>
                <td style={{padding:"12px",fontSize:13}}>{i.heure}</td>
                <td style={{padding:"12px"}}><Badge color={i.fait?"#10b981":"#f59e0b"} bg={i.fait?"#d1fae5":"#fef3c7"}>{i.fait?"Effectuee":"En attente"}</Badge></td>
                <td style={{padding:"12px",fontSize:12,color:"#6b7280"}}>{i.note||"--"}</td>
                <td style={{padding:"12px"}}><Btn small variant={i.fait?"warning":"success"} onClick={()=>toggle(i.id)}>{i.fait?"Annuler":"Valider"}</Btn></td>
              </tr>
            );})}
          </tbody>
        </table>
      </Card>
      {modal&&(
        <Modal title="Planifier" onClose={()=>setModal(null)}>
          <div style={{marginBottom:14}}><label style={{display:"block",fontSize:12,fontWeight:600,color:"#6b7280",marginBottom:4}}>Chantier</label><select value={form.chantierId} onChange={e=>setForm({...form,chantierId:e.target.value})} style={iS}>{chantiers.map(c=><option key={c.id} value={c.id}>{c.client}</option>)}</select></div>
          <Inp label="Type" value={form.type} onChange={v=>setForm({...form,type:v})} options={["Reguliere","Ponctuelle"]}/>
          <Inp label="Date" type="date" value={form.date} onChange={v=>setForm({...form,date:v})}/>
          <Inp label="Heure" type="time" value={form.heure} onChange={v=>setForm({...form,heure:v})}/>
          <Inp label="Note" value={form.note} onChange={v=>setForm({...form,note:v})}/>
          <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:8}}>
            <Btn variant="ghost" onClick={()=>setModal(null)}>Annuler</Btn>
            <Btn onClick={save}>Enregistrer</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Rapports({salaries,presences,chantiers}) {
  const [month,setMonth]=useState(new Date().toISOString().slice(0,7));
  const getSt=(id)=>{const ps=presences.filter(p=>p.salaryId===id&&p.date.startsWith(month));return{present:ps.filter(p=>p.statut==="Present").length,absent:ps.filter(p=>p.statut==="Absent").length,conge:ps.filter(p=>p.statut==="Conge").length,maladie:ps.filter(p=>p.statut==="Maladie").length};};
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
        <h2 style={{margin:0,fontSize:24,color:"#1a3c5e"}}>Rapports</h2>
        <div style={{display:"flex",gap:10}}>
          <input type="month" value={month} onChange={e=>setMonth(e.target.value)} style={{...iS,width:"auto"}}/>
          <Btn small variant="success" onClick={()=>alert("Export Excel!")}>📊 Excel</Btn>
          <Btn small variant="warning" onClick={()=>alert("Export PDF!")}>📄 PDF</Btn>
        </div>
      </div>
      <Card>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr style={{borderBottom:"2px solid #f3f4f6"}}>{["Salarie","Chantier","Presents","Absents","Conges","Maladie","Total"].map(h=><th key={h} style={{padding:"10px 12px",textAlign:"left",fontSize:11,fontWeight:700,color:"#9ca3af",textTransform:"uppercase"}}>{h}</th>)}</tr></thead>
          <tbody>
            {salaries.map(s=>{const st=getSt(s.id);const ch=chantiers.find(c=>c.id===s.chantierId);const tot=st.present+st.absent+st.conge+st.maladie;return(
              <tr key={s.id} style={{borderBottom:"1px solid #f9fafb"}}>
                <td style={{padding:"12px",fontWeight:600}}>{s.prenom} {s.nom}</td>
                <td style={{padding:"12px",fontSize:13,color:"#6b7280"}}>{ch?.client||"--"}</td>
                <td style={{padding:"12px"}}><Badge color="#10b981" bg="#d1fae5">{st.present}</Badge></td>
                <td style={{padding:"12px"}}><Badge color="#ef4444" bg="#fee2e2">{st.absent}</Badge></td>
                <td style={{padding:"12px"}}><Badge color="#f59e0b" bg="#fef3c7">{st.conge}</Badge></td>
                <td style={{padding:"12px"}}><Badge color="#8b5cf6" bg="#ede9fe">{st.maladie}</Badge></td>
                <td style={{padding:"12px",fontWeight:700}}>{tot}</td>
              </tr>
            );})}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

const MENU=[{id:"dashboard",label:"Tableau de bord",icon:"📊"},{id:"presences",label:"Presences",icon:"✅"},{id:"salaries",label:"Salaries",icon:"👥"},{id:"chantiers",label:"Chantiers",icon:"🏗️"},{id:"logements",label:"Logements",icon:"🏠"},{id:"contrats",label:"Contrats",icon:"📄"},{id:"interventions",label:"Interventions",icon:"🧹"},{id:"rapports",label:"Rapports",icon:"📈"}];

export default function App() {
  const [user,setUser]=useState(null);
  const [page,setPage]=useState("dashboard");
  const [salaries,setSalaries]=useState(INITIAL_SALARIES);
  const [chantiers,setChantiers]=useState(INITIAL_CHANTIERS);
  const [contrats,setContrats]=useState(INITIAL_CONTRATS);
  const [logements,setLogements]=useState(INITIAL_LOGEMENTS);
  const [presences,setPresences]=useState(INITIAL_PRESENCES);
  const [interventions,setInterventions]=useState(INITIAL_INTERVENTIONS);
  const [sidebarOpen,setSidebarOpen]=useState(true);

  if(!user) return <Login onLogin={setUser}/>;

  const alertCount=useMemo(()=>{let n=0;contrats.forEach(c=>{if(expired(c.fin)||expSoon(c.fin))n++;});logements.forEach(l=>{if(expired(l.assurance)||expSoon(l.assurance))n++;});salaries.forEach(s=>{if(s.contrat==="CDD"&&s.finCDD&&(expired(s.finCDD)||expSoon(s.finCDD)))n++;if(s.typeCarte==="Carte de séjour"&&s.finCarte&&(expired(s.finCarte)||expSoon(s.finCarte,30)))n++;});return n;},[contrats,logements,salaries]);
  const cur=MENU.find(m=>m.id===page);

  return (
    <div style={{display:"flex",height:"100vh",fontFamily:"'DM Sans','Segoe UI',system-ui,sans-serif",background:"#f8fafc",color:"#1f2937"}}>
      <aside style={{width:sidebarOpen?240:68,minWidth:sidebarOpen?240:68,background:"#1a3c5e",color:"#fff",display:"flex",flexDirection:"column",transition:"width .2s,min-width .2s",overflow:"hidden"}}>
        <div style={{padding:"24px 18px 20px",borderBottom:"1px solid rgba(255,255,255,0.1)",display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:36,height:36,borderRadius:10,background:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>🧹</div>
          {sidebarOpen&&<div><div style={{fontWeight:800,fontSize:15}}>La Nationale</div><div style={{fontSize:10,color:"rgba(255,255,255,0.5)"}}>Gestion multi-sites</div></div>}
        </div>
        <nav style={{flex:1,padding:"12px 10px",overflowY:"auto"}}>
          {MENU.map(m=>{const active=page===m.id;return(
            <button key={m.id} onClick={()=>setPage(m.id)} style={{display:"flex",alignItems:"center",gap:12,width:"100%",padding:"10px 12px",borderRadius:10,marginBottom:2,background:active?"rgba(255,255,255,0.15)":"transparent",border:active?"1px solid rgba(255,255,255,0.2)":"1px solid transparent",color:active?"#fff":"rgba(255,255,255,0.65)",cursor:"pointer",textAlign:"left",fontSize:13,fontWeight:active?700:500,fontFamily:"inherit"}}>
              <span style={{fontSize:16,flexShrink:0}}>{m.icon}</span>
              {sidebarOpen&&<span>{m.label}</span>}
              {sidebarOpen&&m.id==="dashboard"&&alertCount>0&&<span style={{marginLeft:"auto",background:"#ef4444",color:"#fff",borderRadius:12,padding:"1px 7px",fontSize:10,fontWeight:700}}>{alertCount}</span>}
            </button>
          );})}
        </nav>
        <button onClick={()=>setSidebarOpen(v=>!v)} style={{margin:"12px 10px",padding:"8px",borderRadius:8,background:"rgba(255,255,255,0.1)",border:"none",color:"#fff",cursor:"pointer",fontSize:14,fontFamily:"inherit"}}>{sidebarOpen?"◀ Reduire":"▶"}</button>
      </aside>
      <main style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <header style={{background:"#fff",borderBottom:"1px solid #e5e7eb",padding:"0 32px",height:64,display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:20}}>{cur?.icon}</span>
            <h1 style={{margin:0,fontSize:18,fontWeight:700,color:"#1a3c5e"}}>{cur?.label}</h1>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <span style={{fontSize:13,color:"#9ca3af"}}>{new Date().toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}</span>
            {alertCount>0&&<div style={{display:"flex",alignItems:"center",gap:6,background:"#fee2e2",padding:"5px 12px",borderRadius:20}}><span>🔔</span><span style={{fontSize:12,fontWeight:700,color:"#ef4444"}}>{alertCount} alerte(s)</span></div>}
            <div style={{fontSize:12,fontWeight:600,color:"#6b7280"}}>{user.role}</div>
            <div style={{width:36,height:36,borderRadius:"50%",background:"#1a3c5e",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:14}}>{user.email[0].toUpperCase()}</div>
            <button onClick={()=>setUser(null)} style={{padding:"6px 12px",borderRadius:8,border:"1.5px solid #e5e7eb",background:"#fff",fontSize:12,color:"#6b7280",cursor:"pointer",fontFamily:"inherit"}}>Deconnexion</button>
          </div>
        </header>
        <div style={{flex:1,overflowY:"auto",padding:32}}>
          {page==="dashboard"&&<Dashboard salaries={salaries} chantiers={chantiers} presences={presences} interventions={interventions} contrats={contrats} logements={logements}/>}
          {page==="presences"&&<Presences salaries={salaries} chantiers={chantiers} presences={presences} setPresences={setPresences}/>}
          {page==="salaries"&&<Salaries salaries={salaries} setSalaries={setSalaries} chantiers={chantiers} logements={logements}/>}
          {page==="chantiers"&&<Chantiers chantiers={chantiers} setChantiers={setChantiers} salaries={salaries}/>}
          {page==="logements"&&<Logements logements={logements} setLogements={setLogements} salaries={salaries}/>}
          {page==="contrats"&&<Contrats contrats={contrats} setContrats={setContrats} chantiers={chantiers}/>}
          {page==="interventions"&&<Interventions interventions={interventions} setInterventions={setInterventions} chantiers={chantiers}/>}
          {page==="rapports"&&<Rapports salaries={salaries} presences={presences} chantiers={chantiers}/>}
        </div>
      </main>
    </div>
  );
}
