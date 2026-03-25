const { User } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  const { email, mot_de_passe } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user || !(await bcrypt.compare(mot_de_passe, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  if (!user.active) {
    return res.status(403).json({ message: "User is deactivated" });
  }
  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET || "secret",
  );
  await user.update({ token });
  res.status(200).json({ token });
};

const logout = async (req, res) => {
  // Assuming token in header
  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    const user = await User.findByPk(decoded.id);
    if (user) await user.update({ token: null });
  }
  res.status(200).json({ message: "Logged out" });
};

const getProfile = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ["password"] },
    });
    res.status(200).json({ user });
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

const forgotPassword = async (req, res) => {
  // Implement email sending logic
  res.status(200).json({ message: "Password reset email sent" });
};

const resetPassword = async (req, res) => {
  const { token, nouveau_mot_de_passe } = req.body;
  // Verify token and update password
  res.status(200).json({ message: "Password reset successfully" });
};

module.exports = {
  login,
  logout,
  getProfile,
  forgotPassword,
  resetPassword,
};
