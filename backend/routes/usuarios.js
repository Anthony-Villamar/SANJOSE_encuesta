import express from 'express';
import db from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT cedula_usuario, nombre FROM usuarios');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
});

router.get('/:rol', async (req, res) => {
  const rol = req.params.rol;
  try {
    const [rows] = await db.query(`
      SELECT cedula_usuario, nombre, apellido 
      FROM usuarios 
      WHERE rol = ? 
      AND cedula_usuario NOT IN ('0000000001', '0000000002', '0000000003')
    `, [rol]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener usuarios por rol" });
  }
});




export default router;
