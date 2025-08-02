

// Función para mostrar/ocultar contraseña
document.getElementById('togglePassword').addEventListener('click', function() {
  const passwordInput = document.getElementById('contrasena');
  const eyeIcon = document.getElementById('eyeIcon');
  
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    eyeIcon.classList.remove('fa-eye');
    eyeIcon.classList.add('fa-eye-slash');
  } else {
    passwordInput.type = 'password';
    eyeIcon.classList.remove('fa-eye-slash');
    eyeIcon.classList.add('fa-eye');
  }
});

document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const usuario = document.getElementById('usuario').value.trim();
  const contrasena = document.getElementById('contrasena').value.trim();

  const res = await fetch('http://localhost:3001/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ usuario, contrasena })
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
    } else if (rol === 'administrador') {
      window.location.href = 'pages/administrador.html';
    }else {
      alert("Rol no reconocido.");
    }
  } else {
    alert("Usuario o contraseña incorrectos.");
  }
});
