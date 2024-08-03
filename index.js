import express from 'express';
import cors from 'cors';
import session from 'express-session';
import passport from './passport.js'; // Ensure this path is correct
import router from './routes/auth.js';
import mongoose from 'mongoose';

const mongoURI = 'mongodb+srv://gokulanandhu1571:MUXPFCo4hkBtdc11@weatherzone.rcrl4db.mongodb.net/'


mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error', err));

const app = express();

app.use(cors({
    origin: 'http://localhost:5173', // Allow requests from this origin
    methods: 'GET,POST,PUT,DELETE',
    credentials: true
}));

app.use(session({
    secret: 'cyberwolve', // Replace with a strong secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using https
}));

app.use(passport.initialize());
app.use(passport.session());
app.use("/auth", router);

app.use(express.urlencoded({ extended: true }));

app.listen(3001, () => {
    console.log('Server is running on port 3001');
});
