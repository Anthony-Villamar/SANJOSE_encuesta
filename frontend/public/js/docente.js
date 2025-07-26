document.addEventListener('DOMContentLoaded', async () => {
  const nombre = sessionStorage.getItem('nombre');
  const cedula = sessionStorage.getItem('cedula');

  document.getElementById('nombreUsuario').textContent = nombre;

  // TOP 3
  try {
    const res = await fetch(`http://localhost:3001/api/estadisticas/${cedula}`);
    const top = await res.json();
    const lista = document.getElementById('topAtenciones');
    top.forEach((entry, index) => {
      const li = document.createElement('li');
      li.textContent = `${index + 1}. ${entry.nombre} - Promedio: ${entry.promedio}`;
      lista.appendChild(li);
    });
  } catch (err) {
    console.error(err);
    alert("Error al obtener estadísticas TOP.");
  }

  // DETALLE PERSONAL
  try {
    const detalleRes = await fetch(`http://localhost:3001/api/estadisticas/detalle/${cedula}`);
    const detalle = await detalleRes.json();

    const detalleDiv = document.getElementById('detalleUsuario');
    detalleDiv.innerHTML = `
      <p><strong>Promedio de Puntualidad:</strong> ${detalle.promedio_puntualidad ?? 'N/A'}</p>
      <p><strong>Promedio de Trato:</strong> ${detalle.promedio_trato ?? 'N/A'}</p>
      <p><strong>Promedio de Resolución:</strong> ${detalle.promedio_resolucion ?? 'N/A'}</p>
    `;
  } catch (err) {
    console.error(err);
    alert("Error al obtener estadísticas personales.");
  }

  // DETALLE POR DÍA
try {
  const diarioRes = await fetch(`http://localhost:3001/api/estadisticas/detalle/diario/${cedula}`);
  const dias = await diarioRes.json();

  const container = document.getElementById('estadisticasDiarias');
  container.innerHTML = '<h3>Estadísticas por Día</h3>';

  dias.forEach(d => {
  const fechaLocal = new Date(d.fecha).toLocaleDateString('es-EC', {
    timeZone: 'America/Guayaquil'
  });

  const p = document.createElement('p');
  p.innerHTML = `
    <strong>${fechaLocal}:</strong>
    Puntualidad: ${d.promedio_puntualidad} |
    Trato: ${d.promedio_trato} |
    Resolución: ${d.promedio_resolucion}
  `;
  container.appendChild(p);
});

} catch (err) {
  console.error(err);
  alert("Error al obtener estadísticas diarias.");
}

});
