import express from 'express';
import db from '../db.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const {
    cedula_usuario,
    atendido_por,        // <- AGREGADO
    fecha,
    puntualidad,
    trato,
    resolucion,
    comentario,
    motivo
  } = req.body;

  try {
    const sql = `
      INSERT INTO calificaciones 
      (cedula_usuario, atendido_por, fecha, puntualidad, trato, resolucion, comentario, motivo) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await db.query(sql, [
      cedula_usuario,
      atendido_por,        // <- AGREGADO
      fecha,
      puntualidad,
      trato,
      resolucion,
      comentario,
      motivo
    ]);

    res.json({ success: true, message: "Encuesta registrada con éxito." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error al registrar la encuesta." });
  }
});

export default router;
