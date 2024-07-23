import { Router } from "express";
import passport from "passport";

const router = Router();

router.get("/login/failed", (req, res) => {
    res.status(401).json({
        error: true,
        message: 'Log In Failed'
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
    passport.authenticate("google", {
        failureRedirect: "/login/failed"
    }),
    (req, res) => {
        res.redirect('http://localhost:5173');
    }
);

// Start the Google authentication process
router.get("/google", passport.authenticate("google", ["profile", 'email']));


router.get("/logout", (req, res) => {
    console.log('Logout called', req.user);
    req.logout((err) => {
      if (err) {
        console.error('Logout error:', err);
        return res.status(500).json({ error: 'Failed to log out' });
      }
      res.clearCookie('connect.sid'); // Clear session cookie
      res.redirect('http://localhost:5173/login');
    });
  });
  


export default router;
