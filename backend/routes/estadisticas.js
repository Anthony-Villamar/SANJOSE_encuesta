import express from 'express';
import db from '../db.js';

const router = express.Router();

router.get('/:cedula', async (req, res) => {
  try {
    const sql = `
      SELECT u.nombre, 
             ROUND(AVG((IFNULL(puntualidad,0)+IFNULL(trato,0)+IFNULL(resolucion,0))/3),2) AS promedio
      FROM calificaciones c
      JOIN usuarios u ON c.atendido_por = u.cedula_usuario
      GROUP BY atendido_por
      ORDER BY promedio DESC
      LIMIT 3
    `;
    const [rows] = await db.query(sql);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener estadísticas' });
  }
});

export default router;
