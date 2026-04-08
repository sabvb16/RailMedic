import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const QUICK_CARDS = [
  { icon:'🆘', label:'Emergency SOS',  sub:'Alert TTE + Railways',    color:'red',    action:'sos'         },
  { icon:'🤖', label:'AI Doctor',       sub:'Symptom checker',         color:'orange', path:'/chatbot'      },
  { icon:'🩹', label:'First Aid',       sub:'Step-by-step guide',      color:'blue',   path:'/firstaid'     },
  { icon:'🏥', label:'Hospitals',       sub:'Near next station',        color:'green',  path:'/hospitals'    },
  { icon:'💊', label:'Medicines',       sub:'Availability check',       color:'teal',   path:'/medicines'    },
  { icon:'📍', label:'Live Train',      sub:'Location & ETA',           color:'yellow', path:'/tracker'      },
];

const CONTACTS = [
  { icon:'🚨', name:'Railway Emergency', num:'139' },
  { icon:'🏥', name:'Medical Helpline',  num:'104' },
  { icon:'🚑', name:'Ambulance',         num:'108' },
];

const STATS = [
  { val:'1400+', lbl:'Trains Covered' },
  { val:'8200+', lbl:'Hospitals Listed' },
  { val:'500+',  lbl:'Medicines DB' },
  { val:'24/7',  lbl:'AI Available' },
];

export default function Home({ onSOS }) {
  const navigate = useNavigate();

  return (
    <div className="home-wrap">
      {/* Hero */}
      <div className="home-hero">
        <div className="hero-tag">🚂 On-Train Medical Assistant</div>
        <h1>Your Health,<br/><em>Every Station</em></h1>
        <p>AI-powered emergency medical assistance on every Indian Railways train — 24/7, offline-ready.</p>
      </div>

      <div className="page-wrap">
        {/* Quick Actions */}
        <div className="section-label">Quick Actions</div>
        <div className="quick-grid">
          {QUICK_CARDS.map(c => (
            <div
              key={c.label}
              className={`quick-card qc-${c.color}`}
              onClick={() => c.action === 'sos' ? onSOS() : navigate(c.path)}
            >
              <span className="qc-icon">{c.icon}</span>
              <div className="qc-title">{c.label}</div>
              <div className="qc-sub">{c.sub}</div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="section-label">Platform Stats</div>
        <div className="stats-grid">
          {STATS.map(s => (
            <div key={s.lbl} className="stat-card">
              <div className="stat-num">{s.val}</div>
              <div className="stat-lbl">{s.lbl}</div>
            </div>
          ))}
        </div>

        {/* Emergency Helplines */}
        <div className="section-label">Emergency Helplines</div>
        <div className="contact-list">
          {CONTACTS.map(c => (
            <div key={c.num} className="contact-card">
              <div className="contact-icon">{c.icon}</div>
              <div className="contact-info">
                <div className="contact-name">{c.name}</div>
                <div className="contact-num">{c.num}</div>
              </div>
              <a href={`tel:${c.num}`} className="btn btn-red" style={{ textDecoration:'none', padding:'8px 14px', fontSize:'12px' }}>
                📞 Call
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
