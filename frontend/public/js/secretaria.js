document.addEventListener('DOMContentLoaded', async () => {
  const nombre = localStorage.getItem('nombre');
  const cedula = localStorage.getItem('cedula');

  document.getElementById('nombreUsuario').textContent = nombre;

  try {
    const res = await fetch(`http://localhost:3000/api/estadisticas/${cedula}`);
    const top = await res.json();

    const lista = document.getElementById('topAtenciones');
    top.forEach((entry, index) => {
      const li = document.createElement('li');
      li.textContent = `${index + 1}. ${entry.nombre} - Promedio: ${entry.promedio}`;
      lista.appendChild(li);
    });
  } catch (err) {
    console.error(err);
    alert("Error al obtener estadísticas.");
  }
});
