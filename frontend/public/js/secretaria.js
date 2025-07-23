document.addEventListener('DOMContentLoaded', async () => {
  const nombre = sessionStorage.getItem('nombre');
  const cedula = sessionStorage.getItem('cedula');
  document.getElementById('nombreUsuario').textContent = nombre;

  // TOP 3
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
    alert("Error al obtener estadísticas TOP.");
  }

  // DETALLE GENERAL + GRÁFICO DE BARRAS
  try {
    const detalleRes = await fetch(`http://localhost:3000/api/estadisticas/detalle/${cedula}`);
    const detalle = await detalleRes.json();

    const detalleDiv = document.getElementById('detalleUsuario');
    detalleDiv.innerHTML = `
      <p><strong>Promedio de Puntualidad:</strong> ${detalle.promedio_puntualidad ?? 'N/A'}</p>
      <p><strong>Promedio de Trato:</strong> ${detalle.promedio_trato ?? 'N/A'}</p>
      <p><strong>Promedio de Resolución:</strong> ${detalle.promedio_resolucion ?? 'N/A'}</p>
    `;

    const ctxGeneral = document.getElementById('graficoGeneral').getContext('2d');
    new Chart(ctxGeneral, {
      type: 'bar',
      data: {
        labels: ['Puntualidad', 'Trato', 'Resolución'],
        datasets: [{
          label: 'Promedio',
          data: [
            detalle.promedio_puntualidad || 0,
            detalle.promedio_trato || 0,
            detalle.promedio_resolucion || 0
          ],
          backgroundColor: ['blue', 'green', 'orange']
        }]
      },
      options: {
        scales: {
          y: { beginAtZero: true, max: 5 }
        }
      }
    });
  } catch (err) {
    console.error(err);
    alert("Error al obtener estadísticas generales.");
  }

  // DETALLE DIARIO + GRÁFICO DE PASTEL
  try {
    const diarioRes = await fetch(`http://localhost:3000/api/estadisticas/detalle/diario/${cedula}`);
    const dias = await diarioRes.json();

    const container = document.getElementById('estadisticasDiarias');
    container.innerHTML = '';

    if (dias.length > 0) {
      const ultimoDia = dias[dias.length - 1];
      const fechaLocal = new Date(ultimoDia.fecha).toLocaleDateString('es-EC', { timeZone: 'America/Guayaquil' });

      const p = document.createElement('p');
      p.innerHTML = `
        <strong>${fechaLocal}:</strong>
        Puntualidad: ${ultimoDia.promedio_puntualidad} |
        Trato: ${ultimoDia.promedio_trato} |
        Resolución: ${ultimoDia.promedio_resolucion}
      `;
      container.appendChild(p);

      const ctxPastel = document.getElementById('graficoPastel').getContext('2d');
      new Chart(ctxPastel, {
        type: 'pie',
        data: {
          labels: ['Puntualidad', 'Trato', 'Resolución'],
          datasets: [{
            label: 'Promedio del día',
            data: [
              ultimoDia.promedio_puntualidad || 0,
              ultimoDia.promedio_trato || 0,
              ultimoDia.promedio_resolucion || 0
            ],
            backgroundColor: ['#0d6efd', '#198754', '#ffc107']
          }]
        }
      });
    } else {
      container.innerHTML = `<p>No hay datos de hoy.</p>`;
    }
  } catch (err) {
    console.error(err);
    alert("Error al obtener estadísticas diarias.");
  }
});
