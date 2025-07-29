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

router.post('/registrar', async (req, res) => {
  const { cedula_usuario, nombre, apellido, usuario, contrasena, rol, correo, telefono } = req.body;

  if (!cedula_usuario || !nombre || !apellido || !usuario || !contrasena || !rol) {
    return res.status(400).json({ error: "Faltan datos obligatorios." });
  }

  try {
    const sql = `
      INSERT INTO usuarios (cedula_usuario, nombre, apellido, usuario, contrasena, rol, correo, telefono)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await db.query(sql, [cedula_usuario, nombre, apellido, usuario, contrasena, rol, correo || null, telefono || null]);
    res.status(201).json({ success: true, message: "Usuario registrado correctamente." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al registrar usuario." });
  }
});

// Actualizar datos de un usuario específico
router.patch('/:cedula', async (req, res) => {
  const { cedula } = req.params;
  const camposActualizados = req.body;

  if (!cedula || Object.keys(camposActualizados).length === 0) {
    return res.status(400).json({ error: "Cédula o campos a actualizar faltantes." });
  }

  const campos = [];
  const valores = [];

  for (const campo in camposActualizados) {
    campos.push(`${campo} = ?`);
    valores.push(camposActualizados[campo]);
  }

  try {
    const sql = `UPDATE usuarios SET ${campos.join(', ')} WHERE cedula_usuario = ?`;
    valores.push(cedula);

    await db.query(sql, valores);
    res.json({ success: true, message: "Usuario actualizado correctamente." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al actualizar usuario." });
  }
});

router.get('/buscar/:cedula', async (req, res) => {
  const cedula = req.params.cedula;
  try {
    const [rows] = await db.query('SELECT nombre, apellido, correo, telefono, rol FROM usuarios WHERE cedula_usuario = ?', [cedula]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error al buscar usuario' });
  }
})
export default router;
