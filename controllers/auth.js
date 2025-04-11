import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import users from '../models/auth.js';

export const signup = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await users.findOne({ email });
        if (existingUser) {
            return res.status(404).json({ success: false, message: "User already exists" });
        }
        
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = await users.create({ name, email, password: hashedPassword });
        const token = jwt.sign({ email: newUser.email, id: newUser._id }, "deargshvdnj", { expiresIn: '1h' });
        res.status(200).json({ success: true, result: newUser, token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Something went wrong..." });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await users.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({ success: false, message: "User doesn't exist" });
        }
        
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }
        const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, "deargshvdnj", { expiresIn: '1h' });
        res.status(200).json({ success: true, result: existingUser, token, name: existingUser.name,user_id:existingUser._id});
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Something went wrong..." });
    }
};