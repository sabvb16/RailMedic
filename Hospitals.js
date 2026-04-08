import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Hospitals.css';

const STATIONS = [
  { code:'KOTA', name:'Kota Junction' },
  { code:'SWM',  name:'Sawai Madhopur' },
  { code:'JP',   name:'Jaipur Junction' },
  { code:'NDLS', name:'New Delhi' },
];

const LOCAL_HOSPITALS = {
  KOTA: [
    { name:'SMS Hospital Kota',          meta:'Government · 2.1 km', phone:'0744-2470081', tags:['24hr Open','ICU','Blood Bank'], isOpen24hrs:true, hasICU:true },
    { name:'New Medical College Kota',   meta:'Government · 3.4 km', phone:'0744-2325221', tags:['Open','Emergency'],            isOpen24hrs:true, hasICU:false },
    { name:'Fortis Hospital Kota',       meta:'Private · 4.2 km',    phone:'0744-3999000', tags:['24hr Open','ICU','Cardiac'],   isOpen24hrs:true, hasICU:true },
  ],
  SWM: [
    { name:'District Hospital Sawai Madhopur', meta:'Govt · 1.4 km', phone:'07462-220302', tags:['Open till 10PM','Free OPD'], isOpen24hrs:false, hasICU:false },
    { name:'Community Health Centre',          meta:'Govt · 2.8 km', phone:'07462-221010', tags:['Open','Basic Care'],         isOpen24hrs:false, hasICU:false },
  ],
  JP: [
    { name:'Fortis Escorts Jaipur', meta:'Private · 3.8 km', phone:'0141-2547000', tags:['24hr Open','ICU','Cardiac'],   isOpen24hrs:true, hasICU:true },
    { name:'SMS Medical College',   meta:'Govt · 2.1 km',    phone:'0141-2518501', tags:['24hr Open','Trauma','ICU'],    isOpen24hrs:true, hasICU:true },
  ],
  NDLS: [
    { name:'AIIMS Emergency', meta:'Govt · 6.2 km', phone:'011-26588500', tags:['24hr Open','Best Care'],     isOpen24hrs:true, hasICU:true },
    { name:'RML Hospital',    meta:'Govt · 2.1 km', phone:'011-23365525', tags:['24hr Open','Trauma','ICU'], isOpen24hrs:true, hasICU:true },
    { name:'Apollo Hospital', meta:'Pvt · 8.3 km',  phone:'011-26925858', tags:['24hr Open','Super Spec'],  isOpen24hrs:true, hasICU:true },
  ],
};

export default function Hospitals() {
  const [station, setStation] = useState('KOTA');
  const [hospitals, setHospitals] = useState(LOCAL_HOSPITALS.KOTA);
  const [loading, setLoading] = useState(false);

  const loadHospitals = async (code) => {
    setStation(code);
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/hospitals/${code}`);
      setHospitals(data.hospitals?.length ? data.hospitals : LOCAL_HOSPITALS[code] || []);
    } catch {
      setHospitals(LOCAL_HOSPITALS[code] || []);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrap fade-up">
      <div className="section-label">Hospitals Near Station</div>

      <div className="station-selector">
        <label>Select Upcoming Station</label>
        <select value={station} onChange={e => loadHospitals(e.target.value)}>
          {STATIONS.map(s => <option key={s.code} value={s.code}>{s.name}</option>)}
        </select>
      </div>

      {loading ? (
        <div style={{ textAlign:'center', padding:'40px', color:'var(--muted)' }}>Loading hospitals…</div>
      ) : (
        <div className="hospital-list">
          {hospitals.map((h, i) => (
            <div key={i} className="hospital-card">
              <div className="hosp-icon">🏥</div>
              <div className="hosp-info">
                <div className="hosp-name">{h.name}</div>
                <div className="hosp-meta">{h.meta || h.address} · ☎ {h.phone || h.emergencyPhone}</div>
                <div className="hosp-tags">
                  {(h.tags || []).map(t => (
                    <span key={t} className={`tag ${t.includes('Open') || t.includes('24') ? 'tag-green' : t.includes('km') ? 'tag-blue' : 'tag-orange'}`}>{t}</span>
                  ))}
                </div>
              </div>
              <a href={`tel:${h.phone || h.emergencyPhone}`} className="btn btn-green hosp-call">📞 Call</a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
