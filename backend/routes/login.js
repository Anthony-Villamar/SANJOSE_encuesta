import express from 'express';
import db from '../db.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { usuario, contrasena } = req.body;

  try {
    const [rows] = await db.query('SELECT * FROM usuarios WHERE usuario = ? AND contrasena = ?', [usuario, contrasena]);

    if (rows.length > 0) {
      res.json({ success: true, usuario: rows[0] });
    } else {
      res.json({ success: false, message: "Usuario o contraseña incorrectos." });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error en el servidor." });
  }
});

export default router;
