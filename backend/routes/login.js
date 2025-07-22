import express from 'express';
import db from '../db.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { cedula } = req.body;

  try {
    const [rows] = await db.query('SELECT * FROM usuarios WHERE cedula_usuario = ?', [cedula]);

    if (rows.length > 0) {
      res.json({ success: true, usuario: rows[0] });
    } else {
      res.json({ success: false, message: "Usuario no encontrado." });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error en el servidor." });
  }
});

export default router;
