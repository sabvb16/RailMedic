import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FirstAid.css';

const LOCAL_DATA = [
  { condition:'heart_attack',  icon:'❤️',  color:'#fee2e2', title:'Heart Attack',       sub:'Chest pain, breathlessness',   severity:'critical',
    steps:['Make patient sit upright — do NOT lay flat','Loosen all tight clothing around chest and neck','Give 1 Aspirin 325mg if not allergic — chew slowly','Call 139 and alert TTE urgently','Monitor pulse every 2 minutes','Do NOT give food or water'],
    warnings:['May lead to cardiac arrest — be ready for CPR','Do not leave patient alone'] },
  { condition:'stroke',        icon:'🧠',  color:'#ede9fe', title:'Stroke',              sub:'Slurred speech, face drooping', severity:'critical',
    steps:['FAST: Face drooping? Arm weak? Speech unclear? Time to call!','Lay on their side — do NOT give water','Note exact time symptoms started — critical for treatment','Loosen clothing, keep head slightly elevated','Call 139 immediately — stroke needs hospital within 4.5 hours'],
    warnings:['Do NOT give any medication','Time is brain — every minute counts'] },
  { condition:'choking',       icon:'🫁',  color:'#fce7f3', title:'Choking',             sub:'Food stuck, cannot breathe',    severity:'critical',
    steps:['Ask "Are you choking?" — if they speak, encourage coughing','5 firm back blows between shoulder blades','If not resolved: 5 abdominal thrusts (Heimlich maneuver)','Alternate back blows + abdominal thrusts','If unconscious: start CPR, call 139'],
    warnings:['Do not put fingers in mouth blindly'] },
  { condition:'heavy_bleeding',icon:'🩸',  color:'#fef3c7', title:'Heavy Bleeding',      sub:'Cuts, wounds, injuries',        severity:'high',
    steps:['Apply firm direct pressure with clean cloth','Do NOT remove cloth if soaked — add more on top','Elevate injured body part above heart level','Pressure band 2 inches above wound for limb injury','Maintain pressure for minimum 10 minutes'],
    warnings:['For internal bleeding (vomiting blood) — emergency only'] },
  { condition:'burns',         icon:'🔥',  color:'#fff7ed', title:'Burns',               sub:'Hot tea, steam, fire',          severity:'high',
    steps:['Cool under running water for 10 minutes','Do NOT use ice, butter, oil, or toothpaste','Remove jewelry and watches near burn area carefully','Cover loosely with clean cloth — do not wrap tightly','Do NOT burst any blisters'],
    warnings:['Large or face burns are medical emergencies'] },
  { condition:'fever',         icon:'🌡️', color:'#dcfce7', title:'High Fever',          sub:'Temperature above 103°F',       severity:'medium',
    steps:['Remove excess clothing and blankets immediately','Cool (not cold) wet cloth on forehead and armpits','Give Paracetamol 500mg — available at pantry car','Hydrate every 15 minutes with water or ORS','Do NOT give Aspirin to children under 16'],
    warnings:['Fever above 104°F needs medical attention urgently'] },
  { condition:'fainting',      icon:'😵',  color:'#e0f2fe', title:'Fainting / Unconscious', sub:'Collapsed, unresponsive',   severity:'high',
    steps:['Check responsiveness — tap shoulder, call their name','Check breathing — look for chest rise for 10 seconds','If breathing: recovery position (on side, knee bent forward)','If NOT breathing: CPR — 30 compressions + 2 breaths','Call 139 and get TTE immediately'],
    warnings:['Do NOT give water or food to unconscious person'] },
  { condition:'snake_bite',    icon:'🐍',  color:'#f0fdf4', title:'Snake / Insect Bite', sub:'Venom, allergic reaction',     severity:'critical',
    steps:['Keep patient CALM and completely still — movement spreads venom','Remove watches, rings near bite area gently','Mark bite area with pen and note exact time of bite','Do NOT suck venom, apply tourniquet, or cut the wound','Keep bitten limb below heart level','Rush to nearest hospital — anti-venom required urgently'],
    warnings:['Do NOT apply tourniquet — it can cause gangrene'] },
];

const SEV_COLORS = { critical:'#dc2626', high:'#ea580c', medium:'#ca8a04', low:'#16a34a' };

export default function FirstAid() {
  const [data, setData] = useState(LOCAL_DATA);
  const [open, setOpen] = useState(null);

  useEffect(() => {
    axios.get('/api/firstaid').then(r => { if (r.data.data?.length) setData(r.data.data); }).catch(() => {});
  }, []);

  return (
    <div className="page-wrap fade-up">
      <div className="section-label">First Aid Guides</div>
      <div className="aid-grid">
        {data.map((item, i) => (
          <div key={item.condition} className="aid-card">
            <div className="aid-card-top" onClick={() => setOpen(open === i ? null : i)}>
              <div className="aid-icon" style={{ background: item.color }}>{item.icon}</div>
              <div className="aid-info">
                <div className="aid-title">{item.title}</div>
                <div className="aid-sub">{item.sub}</div>
              </div>
              <div className="aid-sev" style={{ color: SEV_COLORS[item.severity || 'medium'] }}>
                {item.severity?.toUpperCase()}
              </div>
              <div className="aid-toggle">{open === i ? '▲' : '▼'}</div>
            </div>
            {open === i && (
              <div className="aid-steps fade-up">
                {item.steps.map((step, j) => (
                  <div key={j} className="aid-step">
                    <div className="step-num">{j + 1}</div>
                    <div className="step-text">{step}</div>
                  </div>
                ))}
                {item.warnings?.map((w, j) => (
                  <div key={j} className="aid-warn">⚠️ {w}</div>
                ))}
                <div className="aid-disclaimer">
                  ℹ️ This is basic first aid guidance only. Always seek professional medical help as soon as possible.
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
