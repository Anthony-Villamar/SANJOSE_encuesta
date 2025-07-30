document.addEventListener('DOMContentLoaded', async () => {
  const form = document.getElementById('encuestaForm');
  const cedula = sessionStorage.getItem('cedula');
  const rol = sessionStorage.getItem('rol');
  const atendidoSelect = document.getElementById('atendido_por');

  if (!cedula || !rol) {
    alert("No ha iniciado sesión correctamente.");
    window.location.href = "../index.html";
    return;
  }

  // Cargar usuarios filtrados por rol (excluyendo evaluadores)
  try {
    const res = await fetch(`https://san-jose.onrender.com/api/usuarios/${rol}`);
    const usuarios = await res.json();

    // Opción por defecto
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.text = 'Seleccione una opción';
    defaultOption.disabled = true;
    defaultOption.selected = true;
    atendidoSelect.appendChild(defaultOption);

    usuarios.forEach(u => {
      const opt = document.createElement('option');
      opt.value = u.cedula_usuario;
      opt.text = `${u.nombre} ${u.apellido}`;
      atendidoSelect.appendChild(opt);
    });
  } catch (error) {
    console.error("Error cargando usuarios:", error);
    alert("Error al cargar lista de personal que atiende.");
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = {
      cedula_usuario: cedula,
      atendido_por: atendidoSelect.value,
fecha: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 19).replace('T', ' '),
      puntualidad: parseInt(document.querySelector('input[name="puntualidad"]:checked')?.value),
      trato: parseInt(document.querySelector('input[name="trato"]:checked')?.value),
      resolucion: parseInt(document.querySelector('input[name="resolucion"]:checked')?.value),
      motivo: document.getElementById('motivo').value,
      comentario: document.getElementById('comentario').value.trim() || "Sin comentarios"
    };

    if (!data.atendido_por || !data.puntualidad || !data.trato || !data.resolucion || !data.motivo) {
      alert("Por favor, complete todas las preguntas.");
      return;
    }

    try {
      const res = await fetch('https://san-jose.onrender.com/api/encuestas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await res.json();
      if (result.success) {
        alert("Encuesta enviada correctamente.");
        form.reset();
        atendidoSelect.selectedIndex = 0;
      } else {
        alert("Error al guardar la encuesta.");
      }
    } catch (err) {
      console.error("Error al enviar:", err);
      alert("Error al conectar con el servidor.");
    }
  });
});
