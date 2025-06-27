import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const ADMIN_EMAIL = 'admin@loopr.ai';
const ADMIN_PASSWORD = 'admin123';

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const token = jwt.sign({ email }, process.env.JWT_SECRET!, { expiresIn: '1h' });
    res.status(200).json({ token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
};
