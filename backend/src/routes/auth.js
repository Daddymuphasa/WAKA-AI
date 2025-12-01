const router = require('express').Router();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Passport Configuration
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await User.findOne({ googleId: profile.id });

            if (user) {
                return done(null, user);
            }

            user = await User.create({
                googleId: profile.id,
                email: profile.emails[0].value,
                displayName: profile.displayName,
                avatar: profile.photos[0].value
            });

            done(null, user);
        } catch (err) {
            done(err, null);
        }
    }
));

// Serialize/Deserialize User (if using sessions, but we'll use JWT mainly)
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

// Routes

// Initiate Google Login
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Callback
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login', session: false }),
    (req, res) => {
        // Create JWT
        const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        // Redirect to frontend with token
        // Assuming frontend is on port 5173 (Vite default)
        res.redirect(`http://localhost:5173/login?token=${token}`);
    }
);

// Get Current User
router.get('/current_user', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ error: 'No token provided' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) return res.status(404).json({ error: 'User not found' });

        res.json(user);
    } catch (err) {
        res.status(401).json({ error: 'Invalid token' });
    }
});

// Register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Create user
        user = await User.create({
            displayName: name,
            email,
            password
        });

        // Create token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(201).json({
            token,
            user: {
                id: user._id,
                displayName: user.displayName,
                email: user.email,
                avatar: user.avatar
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Check password
        if (!user.password) {
            return res.status(400).json({ error: 'Please login with Google' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Create token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.json({
            token,
            user: {
                id: user._id,
                displayName: user.displayName,
                email: user.email,
                avatar: user.avatar
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
