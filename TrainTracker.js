import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TrainTracker.css';

const MOCK_TRAIN = {
  number:'12951', name:'Mumbai Rajdhani Express',
  from:'Mumbai CSMT', to:'New Delhi',
  delay:'+14 min', speed:'118 km/h',
  stations:[
    { name:'Mumbai CSMT',    code:'CSMT', time:'16:00', status:'passed'   },
    { name:'Kalyan Jn',      code:'KYN',  time:'16:52', status:'passed'   },
    { name:'Nasik Road',     code:'NK',   time:'19:42', status:'passed'   },
    { name:'Bhusaval Jn',    code:'BSL',  time:'22:30', status:'passed'   },
    { name:'Itarsi Jn',      code:'ET',   time:'02:10', status:'passed'   },
    { name:'Bhopal Jn',      code:'BPL',  time:'03:30', status:'passed'   },
    { name:'Jhansi Jn',      code:'JHS',  time:'06:20', status:'passed'   },
    { name:'Kota Junction',  code:'KOTA', time:'09:15', status:'current'  },
    { name:'Sawai Madhopur', code:'SWM',  time:'10:42', status:'next'     },
    { name:'Jaipur Jn',      code:'JP',   time:'12:10', status:'upcoming' },
    { name:'New Delhi',      code:'NDLS', time:'15:55', status:'upcoming' },
  ]
};

const MEDICAL_STOPS = [
  { station:'Kota Junction',  hospital:'SMS Hospital',          km:'2.1 km', open:'24hr' },
  { station:'Sawai Madhopur', hospital:'District Hospital',     km:'1.4 km', open:'Till 10PM' },
  { station:'Jaipur Jn',      hospital:'Fortis Escorts',        km:'3.8 km', open:'24hr' },
  { station:'New Delhi',      hospital:'AIIMS Emergency',       km:'6.2 km', open:'24hr' },
];

export default function TrainTracker() {
  const [train, setTrain] = useState(MOCK_TRAIN);

  useEffect(() => {
    axios.get('/api/train/12951/live').then(r => { if (r.data.train) setTrain(r.data.train); }).catch(() => {});
  }, []);

  const currentIdx = train.stations.findIndex(s => s.status === 'current');

  return (
    <div className="page-wrap fade-up">
      {/* Train info card */}
      <div className="track-card">
        <div className="track-header">
          <div>
            <div className="track-name">{train.name}</div>
            <div className="track-num">Train No. {train.number} · {train.from} → {train.to}</div>
          </div>
          <div className="delay-badge">⏱ {train.delay} Late</div>
        </div>
        <div className="track-meta">
          <span>🚀 {train.speed}</span>
          <span>📍 {train.stations[currentIdx]?.name || '—'}</span>
          <span>▶ Next: {train.stations[currentIdx + 1]?.name || 'Final'}</span>
        </div>

        {/* Station progress */}
        <div className="station-track">
          <div className="track-line" />
          <div className="track-line-fill" style={{ height: `${(currentIdx / (train.stations.length - 1)) * 100}%` }} />
          {train.stations.map((s, i) => (
            <div key={s.code} className="stop-row">
              <div className={`stop-dot ${s.status === 'current' ? 'current' : s.status === 'passed' ? 'passed' : ''}`} />
              <div className="stop-info">
                <span className="stop-name">
                  {s.name}
                  {s.status === 'current' && <span className="stop-tag current-tag"> ▶ Current</span>}
                  {s.status === 'next'    && <span className="stop-tag next-tag"> ◉ Next</span>}
                </span>
                <span className="stop-time">{s.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Medical facilities en route */}
      <div className="section-label" style={{ marginTop: 20 }}>Medical Facilities En Route</div>
      <div className="med-stops">
        {MEDICAL_STOPS.map((m, i) => (
          <div key={i} className="med-stop-card">
            <div className="med-stop-icon">🏥</div>
            <div className="med-stop-info">
              <div className="med-stop-name">{m.hospital}</div>
              <div className="med-stop-meta">{m.station} · {m.km} from station · {m.open}</div>
            </div>
            <span className={`tag ${m.open === '24hr' ? 'tag-green' : 'tag-yellow'}`}>{m.open}</span>
          </div>
        ))}
        <div className="med-stop-card onboard">
          <div className="med-stop-icon">🚑</div>
          <div className="med-stop-info">
            <div className="med-stop-name">On-board First Aid</div>
            <div className="med-stop-meta">Contact TTE in Coach B1 · Basic first aid kit available</div>
          </div>
          <span className="tag tag-blue">On Train</span>
        </div>
      </div>
    </div>
  );
}
