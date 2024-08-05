import { Router } from "express";
import passport from "passport";
import bcrypt from 'bcrypt';
import User from '../models/user.js'

const router = Router();


router.get("/login/failed", (req, res) => {
    res.status(401).json({
        error: true,
        message: 'Log In has Failed'
    });
});

router.get("/login/success", (req, res) => {
    if (req.user) {
        res.status(200).json({
            error: false,
            message: 'Success',
            user: req.user
        });
    } else {
        res.status(403).json({
            error: true,
            message: 'Not Authenticated'
        });
    }
});

// Handle Google callback
router.get("/google/callback", 
    passport.authenticate("google", { failureRedirect: "/login/failed" }),
    async (req, res) => {
        try {
            // Access Google profile data from req.user
            const profile = req.user._json;
            let user = await User.findOne({ googleId: profile.sub });

            if (user) {
                // If user exists, redirect to the front-end
                res.redirect(process.env.REACT_APP_CLIENT_URL);
            } else {
                // Check if username already exists
                const existingUserByUsername = await User.findOne({ username: profile.name });
                if (existingUserByUsername) {
                    return res.status(400).json({ error: 'Username already taken' });
                }

                // If user does not exist, create a new user
                user = new User({
                    googleId: profile.sub,
                    username: profile.name,
                    email: profile.email,
                    profilePicture: profile.picture
                });

                await user.save();
                res.redirect(process.env.REACT_APP_CLIENT_URL);
            }
        } catch (err) {
            console.error('Error during Google authentication:', err);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

// Start the Google authentication process
router.get("/google", passport.authenticate("google", ["profile", 'email']));

router.get("/logout", (req, res) => {
    // console.log('Logout called');
    req.logout((err) => {
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).json({ error: 'Failed to log out' });
        }
        res.clearCookie('connect.sid'); // Clear session cookie
        res.redirect(process.env.REACT_APP_CLIENT_URL);
    });
});


export default router;
