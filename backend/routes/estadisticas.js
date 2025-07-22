import express from 'express';
import db from '../db.js';

const router = express.Router();

router.get('/detalle/:cedula', async (req, res) => {
  const { cedula } = req.params;
  try {
    const sql = `
      SELECT 
        ROUND(AVG(puntualidad), 2) AS promedio_puntualidad,
        ROUND(AVG(trato), 2) AS promedio_trato,
        ROUND(AVG(resolucion), 2) AS promedio_resolucion
      FROM calificaciones
      WHERE atendido_por = ?
        AND HOUR(fecha) < 13 OR (HOUR(fecha) = 13 AND MINUTE(fecha) <= 30)
    `;
    const [rows] = await db.query(sql, [cedula]);
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener estadísticas detalladas' });
  }
});

router.get('/:cedula', async (req, res) => {
  try {
    const sql = `
      SELECT u.nombre, 
             ROUND(AVG((IFNULL(puntualidad,0)+IFNULL(trato,0)+IFNULL(resolucion,0))/3),2) AS promedio
      FROM calificaciones c
      JOIN usuarios u ON c.atendido_por = u.cedula_usuario
      WHERE HOUR(fecha) < 13 OR (HOUR(fecha) = 13 AND MINUTE(fecha) <= 30)
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

router.get('/detalle/diario/:cedula', async (req, res) => {
  const { cedula } = req.params;
  try {
    const sql = `
      SELECT 
        DATE(fecha) AS fecha,
        ROUND(AVG(puntualidad), 2) AS promedio_puntualidad,
        ROUND(AVG(trato), 2) AS promedio_trato,
        ROUND(AVG(resolucion), 2) AS promedio_resolucion
      FROM calificaciones
      WHERE atendido_por = ?
        AND (
          HOUR(fecha) < 13 OR (HOUR(fecha) = 13 AND MINUTE(fecha) <= 30)
        )
      GROUP BY DATE(fecha)
      ORDER BY fecha DESC
      LIMIT 7;
    `;
    const [rows] = await db.query(sql, [cedula]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener estadísticas por día' });
  }
});


export default router;
