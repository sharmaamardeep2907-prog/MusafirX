import { Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { User } from '../config/database';
import { AuthRequest } from '../middleware/auth';

const generateTokens = (userId: string, role: string) => {
  const accessToken = jwt.sign({ userId, role }, config.jwt.secret, {
    expiresIn: config.jwt.accessExpiry as any,
  });
  const refreshToken = jwt.sign({ userId, role }, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiry as any,
  });
  return { accessToken, refreshToken };
};

const safeUser = (u: any) => ({
  id: u._id.toString(),
  name: u.name,
  email: u.email,
  role: u.role,
  avatar: u.avatar,
  bio: u.bio,
  profile: u.profile,
});

export const signup = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) { res.status(409).json({ message: 'Email already registered' }); return; }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password: hashedPassword });
    const tokens = generateTokens(user._id.toString(), user.role);
    user.refreshToken = tokens.refreshToken;
    await user.save();
    res.status(201).json({ message: 'Account created successfully', user: safeUser(user), ...tokens });
  } catch (error) { console.error('Signup error:', error); res.status(500).json({ message: 'Internal server error' }); }
};

export const login = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) { res.status(401).json({ message: 'Invalid email or password' }); return; }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) { res.status(401).json({ message: 'Invalid email or password' }); return; }
    const tokens = generateTokens(user._id.toString(), user.role);
    user.refreshToken = tokens.refreshToken;
    await user.save();
    res.json({ message: 'Login successful', user: safeUser(user), ...tokens });
  } catch (error) { console.error('Login error:', error); res.status(500).json({ message: 'Internal server error' }); }
};

export const refreshToken = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { refreshToken: token } = req.body;
    if (!token) { res.status(400).json({ message: 'Refresh token required' }); return; }
    let decoded: any;
    try { decoded = jwt.verify(token, config.jwt.refreshSecret); }
    catch { res.status(401).json({ message: 'Invalid refresh token' }); return; }
    const user = await User.findById(decoded.userId);
    if (!user || user.refreshToken !== token) { res.status(401).json({ message: 'Invalid refresh token' }); return; }
    const tokens = generateTokens(user._id.toString(), user.role);
    user.refreshToken = tokens.refreshToken;
    await user.save();
    res.json(tokens);
  } catch (error) { console.error('Refresh token error:', error); res.status(500).json({ message: 'Internal server error' }); }
};

export const logout = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.userId) await User.findByIdAndUpdate(req.userId, { refreshToken: null });
    res.json({ message: 'Logged out successfully' });
  } catch (error) { console.error('Logout error:', error); res.status(500).json({ message: 'Internal server error' }); }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.userId).select('-password -refreshToken');
    if (!user) { res.status(404).json({ message: 'User not found' }); return; }
    res.json(safeUser(user));
  } catch (error) { console.error('Get me error:', error); res.status(500).json({ message: 'Internal server error' }); }
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, bio, avatar, phone, location, travelStyle } = req.body;
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (bio !== undefined) updateData.bio = bio;
    if (avatar !== undefined) updateData.avatar = avatar;
    const profileUpdate: any = {};
    if (phone !== undefined) profileUpdate['profile.phone'] = phone;
    if (location !== undefined) profileUpdate['profile.location'] = location;
    if (travelStyle !== undefined) profileUpdate['profile.travelStyle'] = travelStyle;
    const user = await User.findByIdAndUpdate(req.userId, { $set: { ...updateData, ...profileUpdate } }, { new: true });
    if (!user) { res.status(404).json({ message: 'User not found' }); return; }
    res.json(safeUser(user));
  } catch (error) { console.error('Update profile error:', error); res.status(500).json({ message: 'Internal server error' }); }
};