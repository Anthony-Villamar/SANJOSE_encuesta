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
    localStorage.setItem('rol', rol);
    localStorage.setItem('cedula', cedula_usuario);
    localStorage.setItem('nombre', nombre);

    if (rol === 'secretaria') {
      window.location.href = "pages/secretarias.html";
    } else if (rol === 'colector') {
      window.location.href = "pages/colectoras.html";
    } else if (rol === 'docente') {
      window.location.href = "pages/docentes.html";
    } else {
      alert("Rol no reconocido.");
    }
  } else {
    alert("Cédula incorrecta.");
  }
});
