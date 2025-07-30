// Registro de usuarios
document.getElementById('registroForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const cedula = document.getElementById('cedula').value.trim();
  const nombre = document.getElementById('nombre').value.trim();
  const apellido = document.getElementById('apellido').value.trim();
  const correo = document.getElementById('correo').value.trim();
  const telefono = document.getElementById('telefono').value.trim();
  const usuario = document.getElementById('usuarioNuevo').value.trim();
  const contrasena = document.getElementById('contrasenaNuevo').value.trim();
  const rol = document.getElementById('rol').value;

  if (!cedula || !nombre || !apellido || !correo || !telefono || !usuario || !contrasena || !rol) {
    alert('Por favor completa todos los campos.');
    return;
  }

  try {
    const res = await fetch('https://ue-san-jose.onrender.com/api/usuarios/registrar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cedula_usuario: cedula,
        nombre,
        apellido,
        correo,
        telefono,
        usuario,
        contrasena,
        rol
      })
    });

    const data = await res.json();
    if (res.ok && data.success) {
      alert('Usuario registrado correctamente.');
      document.getElementById('registroForm').reset();
    } else {
      alert(data.message || 'Error al registrar usuario.');
    }
  } catch (error) {
    console.error(error);
    alert('Error en la comunicación con el servidor.');
  }
});


// Actualización parcial de usuarios
document.getElementById('actualizarForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const cedula = document.getElementById('cedulaActualizar').value.trim();
  const nombre = document.getElementById('nombreActualizar').value.trim();
  const apellido = document.getElementById('apellidoActualizar').value.trim();
  const correo = document.getElementById('correoActualizar').value.trim();
  const telefono = document.getElementById('telefonoActualizar').value.trim();
  const rol = document.getElementById('rolActualizar').value;

  if (!cedula) {
    alert('Ingresa la cédula del usuario que deseas actualizar.');
    return;
  }

  const datosActualizar = {};
  if (nombre) datosActualizar.nombre = nombre;
  if (apellido) datosActualizar.apellido = apellido;
  if (correo) datosActualizar.correo = correo;
  if (telefono) datosActualizar.telefono = telefono;
  if (rol) datosActualizar.rol = rol;

  if (Object.keys(datosActualizar).length === 0) {
    alert('No se ingresó ningún campo para actualizar.');
    return;
  }

  try {
    const res = await fetch(`https://ue-san-jose.onrender.com/api/usuarios/${cedula}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datosActualizar)
    });

    const data = await res.json();
    if (res.ok && data.success) {
      alert('Usuario actualizado correctamente.');
      document.getElementById('actualizarForm').reset();
    } else {
      alert(data.message || 'Error al actualizar usuario.');
    }
  } catch (error) {
    console.error(error);
    alert('Error en la comunicación con el servidor.');
  }
});

// Autocompletar campos al escribir la cédula
document.getElementById('cedulaActualizar').addEventListener('input', async (e) => {
  const cedula = e.target.value.trim();

  // Si tiene 10 dígitos (o puedes ajustar a longitud mínima)
  if (cedula.length >= 10) {
    try {
      const res = await fetch(`https://ue-san-jose.onrender.com/api/usuarios/buscar/${cedula}`);
      const data = await res.json();

      if (res.ok) {
        document.getElementById('nombreActualizar').value = data.nombre || '';
        document.getElementById('apellidoActualizar').value = data.apellido || '';
        document.getElementById('correoActualizar').value = data.correo || '';
        document.getElementById('telefonoActualizar').value = data.telefono || '';
        document.getElementById('rolActualizar').value = data.rol || '';
      } else {
        // Si no existe, limpia los campos
        document.getElementById('nombreActualizar').value = '';
        document.getElementById('apellidoActualizar').value = '';
        document.getElementById('correoActualizar').value = '';
        document.getElementById('telefonoActualizar').value = '';
        document.getElementById('rolActualizar').value = '';
      }
    } catch (err) {
      console.error('Error al buscar usuario', err);
    }
  } else {
    // Limpia los campos si aún no hay una cédula válida
    document.getElementById('nombreActualizar').value = '';
    document.getElementById('apellidoActualizar').value = '';
    document.getElementById('correoActualizar').value = '';
    document.getElementById('telefonoActualizar').value = '';
    document.getElementById('rolActualizar').value = '';
  }
});
