import React from 'react';
import './EmergencyContacts.css';

const CONTACTS = [
  { icon:'🚨', name:'Railway Emergency',      num:'139',          desc:'24/7 · Train emergencies, TTE alert, railway helpline',    color:'red'    },
  { icon:'🚑', name:'Ambulance',               num:'108',          desc:'Free ambulance service · Available at major stations',      color:'red'    },
  { icon:'🏥', name:'Medical Helpline',        num:'104',          desc:'Free health advice · 24 hours · Govt of India',            color:'blue'   },
  { icon:'👮', name:'Police',                  num:'100',          desc:'Law & order, crime, safety emergencies',                   color:'blue'   },
  { icon:'🔥', name:'Fire Brigade',            num:'101',          desc:'Fire emergencies, rescue operations',                      color:'orange' },
  { icon:'🆘', name:'National Emergency',      num:'112',          desc:'Single number for ALL emergencies in India',               color:'red'    },
  { icon:'💊', name:'Poison Control',          num:'1800-116-117', desc:'Drug overdose, poisoning, accidental ingestion',           color:'orange' },
  { icon:'🧠', name:'Mental Health (iCall)',   num:'9152987821',   desc:'Anxiety, panic attacks, stress, emotional support',        color:'blue'   },
  { icon:'👶', name:'Child Helpline',          num:'1098',         desc:'Child safety and emergency · 24/7',                        color:'green'  },
  { icon:'👩', name:'Women Helpline',          num:'1091',         desc:'Women safety, harassment, emergencies',                    color:'green'  },
];

const COLOR_MAP = {
  red:    { bg:'#fff5f5', border:'#fecaca', btn:'#dc2626' },
  blue:   { bg:'#eff6ff', border:'#bfdbfe', btn:'#1d4ed8' },
  orange: { bg:'#fff7ed', border:'#fed7aa', btn:'#ea580c' },
  green:  { bg:'#f0fdf4', border:'#bbf7d0', btn:'#16a34a' },
};

export default function EmergencyContacts() {
  return (
    <div className="page-wrap fade-up">
      <div className="section-label">Emergency Contacts</div>
      <div className="contacts-grid">
        {CONTACTS.map(c => {
          const col = COLOR_MAP[c.color] || COLOR_MAP.blue;
          return (
            <div key={c.num} className="ec-card" style={{ background: col.bg, borderColor: col.border }}>
              <div className="ec-icon">{c.icon}</div>
              <div className="ec-info">
                <div className="ec-name">{c.name}</div>
                <div className="ec-num">{c.num}</div>
                <div className="ec-desc">{c.desc}</div>
              </div>
              <a href={`tel:${c.num}`} className="ec-call-btn" style={{ background: col.btn }}>
                📞 Call
              </a>
            </div>
          );
        })}
      </div>

      <div className="section-label" style={{ marginTop: 28 }}>Railway Zone Helplines</div>
      <div className="zone-list">
        {[
          ['Western Railway',  '22001'],
          ['Central Railway',  '22005'],
          ['Northern Railway', '23017'],
          ['Southern Railway', '25316'],
          ['Eastern Railway',  '22000'],
        ].map(([zone, num]) => (
          <div key={num} className="zone-card">
            <span>🚂 {zone}</span>
            <span className="zone-num">{num}</span>
            <a href={`tel:${num}`} className="btn btn-outline" style={{ padding:'6px 12px', fontSize:'12px', textDecoration:'none' }}>Call</a>
          </div>
        ))}
      </div>
    </div>
  );
}
