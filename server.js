const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { createServer } = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const sequelize = require('./config/db');
const Medicine = require('./models/Medicine');

const app = express();
const httpServer = createServer(app);


// ─────────────────────────────
// 🔌 Socket.IO
// ─────────────────────────────
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

app.set('io', io);


// ─────────────────────────────
// 🧩 Middleware
// ─────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000'
}));

app.use(express.json());
app.use(morgan('dev'));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests'
});
app.use('/api/', limiter);


// ─────────────────────────────
// 🛣️ Routes
// ─────────────────────────────
app.use('/api/auth',      require('./routes/auth'));
app.use('/api/chat',      require('./routes/chat'));
app.use('/api/sos',       require('./routes/sos'));
app.use('/api/hospitals', require('./routes/hospitals'));
app.use('/api/medicines', require('./routes/medicines'));
app.use('/api/firstaid',  require('./routes/firstaid'));
app.use('/api/train',     require('./routes/train'));
app.use('/api/user',      require('./routes/user'));
app.use('/api/tte',       require('./routes/tte'));


// ─────────────────────────────
// ❤️ Health Check
// ─────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    status: 'RailMedic API running ✅',
    time: new Date()
  });
});


// ─────────────────────────────
// ⚡ Socket Events
// ─────────────────────────────
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('join-train', (trainNumber) => {
    socket.join(`train-${trainNumber}`);
    console.log(`Socket joined train-${trainNumber}`);
  });

  socket.on('join-tte', (tteId) => {
    socket.join(`tte-${tteId}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});


// ─────────────────────────────
// 🌱 Seed Medicines
// ─────────────────────────────
async function seedMedicines() {
  try {
    const count = await Medicine.count();

    if (count === 0) {
      await Medicine.bulkCreate([
        {
          name: 'Paracetamol',
          category: 'Tablet',
          description: 'Pain reliever and fever reducer',
          manufacturer: 'Cipla',
          price: 20
        },
        {
          name: 'ORS',
          category: 'Powder',
          description: 'Oral rehydration salts',
          manufacturer: 'Dabur',
          price: 15
        },
        {
          name: 'Crocin',
          category: 'Tablet',
          description: 'Fever and mild pain relief',
          manufacturer: 'GSK',
          price: 30
        }
      ]);

      console.log('✅ Medicines seeded');
    }
  } catch (err) {
    console.error('Seed error:', err.message);
  }
}


// ─────────────────────────────
// 🗄️ DB + Server Start
// ─────────────────────────────
const PORT = process.env.PORT || 5001; // 🔥 changed default port

sequelize.sync()
  .then(async () => {
    console.log('✅ SQLite connected');

    await seedMedicines();

    httpServer.listen(PORT, () => {
      console.log(`🚀 RailMedic server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Database error:', err.message);
    process.exit(1);
  });


// ─────────────────────────────
// ❌ Global Error Handling (NEW)
// ─────────────────────────────
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err.message);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err.message);
});


module.exports = { app, io };