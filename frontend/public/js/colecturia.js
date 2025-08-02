document.addEventListener('DOMContentLoaded', async () => {
  const nombre = sessionStorage.getItem('nombre');
  const cedula = sessionStorage.getItem('cedula');
  document.getElementById('nombreUsuario').textContent = nombre;

  // TOP 3
  try {
    const res = await fetch(`http://localhost:3001/api/estadisticas/${cedula}`);
    const top = await res.json();

    const contenedor = document.getElementById('topAtenciones1');
    contenedor.innerHTML = '';

    top.forEach((entry, index) => {
      const p = document.createElement('p');
      p.innerHTML = `<strong>${index + 1}. ${entry.nombre}</strong> - Promedio: ${entry.promedio}`;
      contenedor.appendChild(p);
    });

    const radarContainer = document.getElementById('topAtenciones');
    radarContainer.innerHTML = '<canvas id="graficoTop3Radar"></canvas>';

    const radarCtx = document.getElementById('graficoTop3Radar').getContext('2d');

    const colores = [
      { fondo: 'rgba(255, 99, 132, 0.2)', borde: 'rgb(255, 99, 132)' },
      { fondo: 'rgba(54, 162, 235, 0.2)', borde: 'rgb(54, 162, 235)' },
      { fondo: 'rgba(255, 206, 86, 0.2)', borde: 'rgb(255, 206, 86)' }
    ];

    const datasets = top.map((entry, index) => ({
      label: entry.nombre,
      data: [
        entry.promedio_puntualidad || 0,
        entry.promedio_trato || 0,
        entry.promedio_resolucion || 0
      ],
      fill: true,
      backgroundColor: colores[index].fondo,
      borderColor: colores[index].borde,
      pointBackgroundColor: colores[index].borde,
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: colores[index].borde
    }));

    new Chart(radarCtx, {
      type: 'radar',
      data: {
        labels: ['Puntualidad', 'Trato', 'Resolución'],
        datasets: datasets
      },
      options: {
        elements: {
          line: { borderWidth: 1 }
        },
        plugins: {
          title: {
            display: true,
            text: 'Top 3 Mejores Calificados'
          },
          legend: {
            position: 'top'
          }
        },
        scales: {
          r: {
            min: 0,
            max: 5,
            stepSize: 1,
            angleLines: { color: 'rgba(0,0,0,0.6)' },
            grid: { color: 'rgba(0,0,0,0.3)' },
            pointLabels: { color: '#000', font: { size: 14, weight: 'bold' } },
            ticks: { color: '#000', font: { size: 12 } }
          }
        }
      }
    });
  } catch (err) {
    console.error(err);
    alert("Error al obtener estadísticas TOP.");
  }

  // ESTADÍSTICAS GENERALES
  try {
    const detalleRes = await fetch(`http://localhost:3001/api/estadisticas/detalle/${cedula}`);
    const detalle = await detalleRes.json();

    const detalleDiv = document.getElementById('detalleUsuario');
    detalleDiv.innerHTML = `
      <p><strong>Promedio de Puntualidad:</strong> ${detalle.promedio_puntualidad ?? 'N/A'}</p>
      <p><strong>Promedio de Trato:</strong> ${detalle.promedio_trato ?? 'N/A'}</p>
      <p><strong>Promedio de Resolución:</strong> ${detalle.promedio_resolucion ?? 'N/A'}</p>
    `;

    const ctxGeneral = document.getElementById('graficoGeneral').getContext('2d');
    new Chart(ctxGeneral, {
      type: 'doughnut',
      data: {
        labels: ['Puntualidad', 'Trato', 'Resolución'],
        datasets: [{
          data: [
            detalle.promedio_puntualidad || 0,
            detalle.promedio_trato || 0,
            detalle.promedio_resolucion || 0
          ],
          backgroundColor: ['blue', 'green', 'orange']
        }]
      }
    });
  } catch (err) {
    console.error(err);
    alert("Error al obtener estadísticas generales.");
  }

  // ESTADÍSTICAS POR DÍA
  const hoy = new Date().toISOString().slice(0, 10);
  const fechaInput = document.getElementById('fechaFiltro');
  fechaInput.value = hoy;

  let graficoPastel = null;

  async function cargarEstadisticaDiaria(fecha) {
    try {
      const res = await fetch(`http://localhost:3001/api/estadisticas/detalle/diario/${cedula}`);
      const dias = await res.json();

      const filtrado = dias.find(d => d.fecha.slice(0, 10) === fecha);
      const container = document.getElementById('estadisticasDiarias');
      const canvas = document.getElementById('graficoPastel');

      if (graficoPastel) graficoPastel.destroy();
      container.innerHTML = '';

      if (filtrado) {
        container.innerHTML = `
          <strong>${fecha}:</strong>
          Puntualidad: ${filtrado.promedio_puntualidad} |
          Trato: ${filtrado.promedio_trato} |
          Resolución: ${filtrado.promedio_resolucion}
        `;
        canvas.style.display = 'block';

        const ctx = canvas.getContext('2d');
        graficoPastel = new Chart(ctx, {
          type: 'polarArea',
          data: {
            labels: ['Puntualidad', 'Trato', 'Resolución'],
            datasets: [{
              data: [
                filtrado.promedio_puntualidad || 0,
                filtrado.promedio_trato || 0,
                filtrado.promedio_resolucion || 0
              ],
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)'
              ],
              borderColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 206, 86)'
              ],
              borderWidth: 1
            }]
          },
          options: {
            scales: {
              r: {
                min: 0,
                max: 5
              }
            }
          }
        });
      } else {
        container.innerHTML = `<p>No hay datos para esta fecha.</p>`;
        canvas.style.display = 'none';
      }
    } catch (err) {
      console.error(err);
      alert("Error al filtrar por fecha.");
    }
  }

  cargarEstadisticaDiaria(hoy);

  document.getElementById('filtrarBtn').addEventListener('click', () => {
    const fecha = document.getElementById('fechaFiltro').value;
    cargarEstadisticaDiaria(fecha);
  });
});
