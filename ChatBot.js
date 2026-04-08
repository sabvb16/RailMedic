import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './ChatBot.css';

const QUICK_REPLIES = ['Chest pain ho raha hai', 'Mujhe bukhar hai', 'Chakkar aa rahe hain', 'Bleeding ho rahi hai', 'Nearest hospital'];

const FALLBACK = {
  'chest':       { text: '⚠️ CHEST PAIN — CRITICAL\n\n1. Immediately make patient sit upright\n2. Loosen all tight clothing\n3. Give Aspirin 325mg if not allergic\n4. Call TTE — dial 139\n5. Monitor breathing every 2 minutes\n\nThis could be a heart attack. Do NOT delay.', severity: 'critical' },
  'heart':       { text: '⚠️ CARDIAC EMERGENCY\n\nCall 139 immediately. Give Aspirin 325mg. Keep patient calm and still. Ask TTE to stop at nearest station.', severity: 'critical' },
  'bukhar':      { text: '🌡️ FEVER\n\n1. Paracetamol 500mg (available at pantry)\n2. Cool wet cloth on forehead\n3. Plenty of water or ORS\n4. If >103°F — seek medical help', severity: 'medium' },
  'fever':       { text: '🌡️ FEVER GUIDANCE\n\n1. Paracetamol 500mg every 6 hours\n2. Cool compress on forehead\n3. Hydrate with ORS\n4. Rest and avoid cold water bath', severity: 'medium' },
  'bleed':       { text: '🩸 BLEEDING\n\n1. Apply firm direct pressure\n2. Do NOT remove cloth — add more if soaked\n3. Elevate injured part\n4. Severe bleeding — call 139', severity: 'high' },
  'chakkar':     { text: '😵 DIZZINESS\n\n1. Lie down, legs slightly elevated\n2. Open window for fresh air\n3. Sip water slowly\n4. If with chest pain — call 139 immediately', severity: 'medium' },
  'unconscious': { text: '🚨 UNCONSCIOUS — EMERGENCY\n\n1. Check breathing for 10 seconds\n2. Recovery position if breathing\n3. CPR if not breathing\n4. CALL 139 NOW', severity: 'critical' },
  'hospital':    { text: '🏥 Nearest Hospitals:\n\nKota Jn (current):\n• SMS Hospital — 2.1 km, 24hr, ☎ 0744-2470081\n\nNext: Sawai Madhopur:\n• District Hospital — 1.4 km, Govt, Free OPD', severity: 'low' },
};

function getOfflineResponse(msg) {
  const l = msg.toLowerCase();
  for (const [key, val] of Object.entries(FALLBACK)) {
    if (l.includes(key)) return val;
  }
  return { text: 'Please describe your symptoms in more detail.\n\nOr press 🆘 SOS for immediate help and call 139.', severity: 'low' };
}

export default function ChatBot() {
  const [messages, setMessages] = useState([{
    role: 'bot',
    text: 'Namaste! 🙏 Main Dr. RailBot hoon — aapka on-train medical assistant.\n\nSymptoms batayein ya neeche se select karein:',
    replies: QUICK_REPLIES,
  }]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const endRef = useRef(null);

  useEffect(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), [messages, typing]);

  const sendMsg = async (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: msg }]);
    setTyping(true);

    try {
      const history = messages.slice(-6).map(m => ({ role: m.role === 'bot' ? 'assistant' : 'user', content: m.text }));
      const { data } = await axios.post('/api/chat', { message: msg, history });
      setTimeout(() => {
        setTyping(false);
        setMessages(prev => [...prev, {
          role: 'bot',
          text: data.response,
          severity: data.severity,
          replies: data.severity === 'critical' ? ['Call 139 now', 'Nearest hospital', 'SOS kaise bhejein'] : QUICK_REPLIES,
        }]);
      }, 800);
    } catch {
      const fb = getOfflineResponse(msg);
      setTimeout(() => {
        setTyping(false);
        setMessages(prev => [...prev, { role: 'bot', text: fb.text, severity: fb.severity, replies: QUICK_REPLIES }]);
      }, 800);
    }
  };

  const severityColor = { critical:'#fee2e2', high:'#fff7ed', medium:'#f0fdf4', low:'#f8fafc' };

  return (
    <div className="chat-page">
      <div className="chat-wrap">
        <div className="chat-header">
          <div className="bot-avatar">🤖</div>
          <div>
            <div className="bot-name">Dr. RailBot</div>
            <div className="bot-status"><span className="online-dot"/>Online — Offline AI Mode</div>
          </div>
        </div>

        <div className="chat-messages">
          {messages.map((m, i) => (
            <div key={i} className={`msg-wrap ${m.role}`}>
              <div className="msg-avatar">{m.role === 'bot' ? '🤖' : '👤'}</div>
              <div>
                <div className="msg-bubble" style={m.role === 'bot' && m.severity ? { background: severityColor[m.severity] } : {}}>
                  {m.text.split('\n').map((line, j) => <span key={j}>{line}<br/></span>)}
                </div>
                {m.replies && (
                  <div className="quick-replies">
                    {m.replies.map(r => (
                      <button key={r} className="qr-btn" onClick={() => sendMsg(r)}>{r}</button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {typing && (
            <div className="msg-wrap bot">
              <div className="msg-avatar">🤖</div>
              <div className="typing-bubble">
                <span/><span/><span/>
              </div>
            </div>
          )}
          <div ref={endRef}/>
        </div>

        <div className="chat-input-wrap">
          <input
            className="chat-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMsg()}
            placeholder="Apna symptom likhein…"
          />
          <button className="chat-send" onClick={() => sendMsg()}>Send ➤</button>
        </div>
      </div>
    </div>
  );
}
