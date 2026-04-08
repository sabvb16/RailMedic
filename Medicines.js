import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Medicines.css';

const LOCAL_MEDS = [
  { name:'Paracetamol',    generic:'Acetaminophen 500mg',         uses:'Fever, headache, body pain',           availability:'on-train',        dosage:'1 tablet every 6 hrs. Max 4/day.', prescriptionRequired:false },
  { name:'Aspirin',        generic:'Acetylsalicylic Acid 325mg',  uses:'Heart attack first aid, fever, pain',  availability:'on-train',        dosage:'1 tablet for cardiac emergency (chew). Not for children <16.', prescriptionRequired:false },
  { name:'Antacid (Digene)',generic:'Aluminium + Magnesium Hydroxide', uses:'Acidity, indigestion, heartburn', availability:'on-train',        dosage:'2 tablets after meals. Chew slowly.', prescriptionRequired:false },
  { name:'ORS (Electral)', generic:'Oral Rehydration Salts',      uses:'Dehydration, diarrhea, vomiting',      availability:'on-train',        dosage:'1 packet in 1 litre water. Sip over 2 hours.', prescriptionRequired:false },
  { name:'Cetirizine',     generic:'Cetirizine HCl 10mg',         uses:'Allergy, rash, cold, runny nose',      availability:'on-train',        dosage:'1 tablet at night. May cause drowsiness.', prescriptionRequired:false },
  { name:'Loperamide',     generic:'Loperamide HCl 2mg',          uses:'Diarrhea, loose motions',              availability:'on-train',        dosage:'2 tablets initially, then 1 after each stool. Max 8/day.', prescriptionRequired:false },
  { name:'Domperidone',    generic:'Domperidone 10mg',             uses:'Nausea, vomiting, motion sickness',    availability:'station-pharmacy',dosage:'1 tablet 30 min before meals. Not in pregnancy.', prescriptionRequired:false },
  { name:'Ibuprofen',      generic:'Ibuprofen 400mg',              uses:'Pain, inflammation, fever, muscle ache',availability:'station-pharmacy',dosage:'1 tablet after food. Not on empty stomach.', prescriptionRequired:false },
  { name:'Metformin',      generic:'Metformin HCl 500mg',          uses:'Diabetes Type 2, blood sugar control',  availability:'not-available',  dosage:'Prescription only. Take with meals.', prescriptionRequired:true },
  { name:'Amlodipine',     generic:'Amlodipine Besylate 5mg',      uses:'High blood pressure, chest pain',       availability:'not-available',  dosage:'Prescription only. Once daily.', prescriptionRequired:true },
];

const AVAIL_MAP = {
  'on-train':        { label:'Available on train',  cls:'tag-green',  dot:'#22c55e' },
  'station-pharmacy':{ label:'Station pharmacy',    cls:'tag-yellow', dot:'#f59e0b' },
  'not-available':   { label:'Not available',       cls:'tag-red',    dot:'#ef4444' },
};

export default function Medicines() {
  const [meds, setMeds] = useState(LOCAL_MEDS);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    axios.get('/api/medicines').then(r => { if (r.data.medicines?.length) setMeds(r.data.medicines); }).catch(() => {});
  }, []);

  const filtered = meds.filter(m => {
    const q = query.toLowerCase();
    const match = !q || m.name.toLowerCase().includes(q) || m.generic?.toLowerCase().includes(q) || m.uses?.toLowerCase().includes(q);
    const avail = filter === 'all' || m.availability === filter;
    return match && avail;
  });

  return (
    <div className="page-wrap fade-up">
      <div className="section-label">Medicine Availability Checker</div>

      <div className="med-search-wrap">
        <span className="med-search-icon">💊</span>
        <input
          className="med-search"
          type="text"
          placeholder="Search medicine, symptom, or generic name…"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </div>

      <div className="med-filters">
        {[['all','All'],['on-train','On Train'],['station-pharmacy','Station'],['not-available','Not Available']].map(([val, lbl]) => (
          <button key={val} className={`filter-pill ${filter === val ? 'active' : ''}`} onClick={() => setFilter(val)}>{lbl}</button>
        ))}
      </div>

      <div className="med-grid">
        {filtered.map((m, i) => {
          const av = AVAIL_MAP[m.availability] || AVAIL_MAP['not-available'];
          return (
            <div key={i} className="med-card">
              <div className="med-name">{m.name}</div>
              <div className="med-generic">{m.generic || m.genericName}</div>
              <div className="med-uses">{Array.isArray(m.uses) ? m.uses.join(', ') : m.uses}</div>
              <div className="med-avail">
                <span className="avail-dot" style={{ background: av.dot }} />
                <span className={`tag ${av.cls}`}>{av.label}</span>
                {m.prescriptionRequired && <span className="tag tag-red">Rx Required</span>}
              </div>
              <div className="med-dosage">💊 {m.dosage}</div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div style={{ gridColumn:'1/-1', textAlign:'center', padding:'40px', color:'var(--muted)' }}>
            No medicines found for "{query}"
          </div>
        )}
      </div>
    </div>
  );
}
