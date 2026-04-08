import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Header from './components/Header';
import Sidebar from './components/Sidebar';
import SOSButton from './components/SOSButton';
import SOSModal from './components/SOSModal';

import Home from './pages/Home';
import ChatBot from './pages/ChatBot';
import FirstAid from './pages/FirstAid';
import Hospitals from './pages/Hospitals';
import Medicines from './pages/Medicines';
import TrainTracker from './pages/TrainTracker';
import EmergencyContacts from './pages/EmergencyContacts';

import './App.css';

export default function App() {
  const [sosOpen, setSosOpen] = useState(false);
  const [dark, setDark] = useState(false);

  const trainInfo = {
    number: '12951',
    name: 'Rajdhani Express',
    currentStation: 'Kota Jn',
    nextStation: 'Sawai Madhopur',
    eta: '42 min',
    speed: '118 km/h',
    delay: '+14 min',
    coach: 'B4 · Seat 32',
  };

  return (
    <div className={dark ? 'app dark' : 'app'}>
      <Toaster position="top-center" />

      <Header
        trainInfo={trainInfo}
        onSOS={() => setSosOpen(true)}
        dark={dark}
        setDark={setDark}
      />

      <div className="layout">
        <Sidebar />
        <main className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chatbot" element={<ChatBot />} />
            <Route path="/firstaid" element={<FirstAid />} />
            <Route path="/hospitals" element={<Hospitals />} />
            <Route path="/medicines" element={<Medicines />} />
            <Route path="/tracker" element={<TrainTracker />} />
            <Route path="/contacts" element={<EmergencyContacts />} />
          </Routes>
        </main>
      </div>

      <SOSButton onClick={() => setSosOpen(true)} />

      {sosOpen && (
        <SOSModal
          trainInfo={trainInfo}
          onClose={() => setSosOpen(false)}
        />
      )}
    </div>
  );
}