import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { register, login, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);

// ---------- Google OAuth ----------
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', (req, res, next) => {
  passport.authenticate('google', { session: false }, (err, user, info) => {
    if (err) {
      console.error('❌ Google OAuth error:', err);
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
    }
    if (!user) {
      console.error('❌ No user returned from Google');
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=no_user`);
    }
    try {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
      return res.redirect(`${process.env.FRONTEND_URL}/oauth-redirect?token=${token}`);
    } catch (jwtErr) {
      console.error('❌ JWT signing error:', jwtErr);
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=jwt_error`);
    }
  })(req, res, next);
});

// ---------- GitHub OAuth ----------
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/github/callback', (req, res, next) => {
  passport.authenticate('github', { session: false }, (err, user, info) => {
    if (err) {
      console.error('❌ GitHub OAuth error:', err);
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
    }
    if (!user) {
      console.error('❌ No user returned from GitHub');
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=no_user`);
    }
    try {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
      return res.redirect(`${process.env.FRONTEND_URL}/oauth-redirect?token=${token}`);
    } catch (jwtErr) {
      console.error('❌ JWT signing error:', jwtErr);
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=jwt_error`);
    }
  })(req, res, next);
});

export default router;