document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const cedula = document.getElementById('cedula').value.trim();

  const res = await fetch('http://localhost:3000/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cedula })
  });

  const result = await res.json();

  if (result.success) {
    const { rol, cedula_usuario, nombre } = result.usuario;
    sessionStorage.setItem('rol', rol);
    sessionStorage.setItem('cedula', cedula_usuario);
    sessionStorage.setItem('nombre', nombre);

    if (cedula_usuario === '0000000001' || cedula_usuario === '0000000002' || cedula_usuario === '0000000003') {
      window.location.href = 'encuestas.html';
    } else if (rol === 'secretaria') {
      window.location.href = 'pages/secretarias.html';
    } else if (rol === 'docente') {
      window.location.href = 'pages/docentes.html';
    } else if (rol === 'colector') {
      window.location.href = 'pages/colectoras.html';
    } else {
      alert("Rol no reconocido.");
    }
  } else {
    alert("Cédula incorrecta.");
  }
});
