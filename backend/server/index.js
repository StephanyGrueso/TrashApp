import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// =========================
// 🔹 Conexión a MongoDB
// =========================
mongoose
  .connect(process.env.MONGO_URI, { dbName: "turabma" })
  .then(() => console.log("✅ MongoDB conectado con éxito"))
  .catch((err) => console.error("❌ Error al conectar MongoDB:", err));

// =========================
// 🔹 Modelo de usuario
// =========================
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["driver", "citizen"], required: true },
});

const User = mongoose.model("User", userSchema);

// =========================
// 🔹 RUTA: Registro
// =========================
app.post("/api/register", async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(400).json({ error: "Usuario ya existe" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword, role });
    await newUser.save();

    res.json({ message: "Usuario creado exitosamente" });
  } catch (err) {
    res.status(500).json({ error: "Error en el servidor" });
  }
});

// =========================
// 🔹 RUTA: Login
// =========================
app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: "Contraseña incorrecta" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "secret_key",
      { expiresIn: "6h" }
    );

    res.json({ token, role: user.role });
  } catch (err) {
    res.status(500).json({ error: "Error en el servidor" });
  }
});

// =========================
// 🔹 RUTA: Ver todos los usuarios (para pruebas)
// =========================
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find({}, "-password");
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No hay usuarios registrados aún" });
    }
    res.json(users);
  } catch (err) {
    console.error("❌ Error en /api/users:", err);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
});

import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = "turaBMA_secret_key"; // 🔒 Cambia esto por algo más seguro en producción

// 🟢 Registrar usuario
app.post("/api/register", async (req, res) => {
  try {
    const { username, password, role } = req.body;
    if (!username || !password || !role) {
      return res.status(400).json({ message: "Todos los campos son requeridos" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashed, role });
    await newUser.save();

    res.json({ message: "Usuario registrado correctamente" });
  } catch (err) {
    console.error("Error al registrar:", err);
    res.status(500).json({ message: "Error interno" });
  }
});

// 🟡 Login usuario
app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Contraseña incorrecta" });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "6h" });

    res.json({ ok: true, token, role: user.role });
  } catch (err) {
    console.error("Error en login:", err);
    res.status(500).json({ message: "Error interno" });
  }
});

// =========================
// 🔹 Iniciar servidor
// =========================
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
