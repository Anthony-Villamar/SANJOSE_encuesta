document.addEventListener('DOMContentLoaded', async () => {
  const nombre = sessionStorage.getItem('nombre');
  const cedula = sessionStorage.getItem('cedula');
  document.getElementById('nombreUsuario').textContent = nombre;

  // TOP 3
  try {
    const res = await fetch(`http://localhost:3001/api/estadisticas/${cedula}`);
    const top = await res.json();
    const radarContainer = document.getElementById('topAtenciones');
    const lista = document.getElementById('topAtenciones1');
    top.forEach((entry, index) => {
      const li = document.createElement('li');
      li.textContent = `${index + 1}. ${entry.nombre} - Promedio: ${entry.promedio}`;
      lista.appendChild(li);
    });

    radarContainer.innerHTML = '<canvas id="graficoTop3Radar"></canvas>';

    const radarCtx = document.getElementById('graficoTop3Radar').getContext('2d');

    const colores = [
      { fondo: 'rgba(255, 99, 132, 0.2)', borde: 'rgb(255, 99, 132)' },
      { fondo: 'rgba(54, 162, 235, 0.2)', borde: 'rgb(54, 162, 235)' },
      { fondo: 'rgba(255, 206, 86, 0.2)', borde: 'rgb(255, 206, 86)' }
    ];

    const datasets = top.map((entry, index) => ({
      label: `${entry.nombre}`,
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
          line: { borderWidth: 3 }
        },
        plugins: {
          title: {
            display: true,
            text: 'Top 3 Mejores Calificados'
          },
          legend: {
            position: 'top'
          }
        }
      }
    });
  } catch (err) {
    console.error(err);
    alert("Error al obtener estadísticas TOP.");
  }

  // DETALLE GENERAL + GRÁFICO DE BARRAS
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
        animations: {
          tension: {
            duration: 5000,
            easing: 'easeInSine',
            from: 1.5,
            to: 0,
            loop: true
          }
        }
      }
    });
  } catch (err) {
    console.error(err);
    alert("Error al obtener estadísticas generales.");
  }

  // DETALLE DIARIO + GRÁFICO DE PASTEL
  document.getElementById('filtrarBtn').addEventListener('click', async () => {
  const fechaSeleccionada = document.getElementById('fechaFiltro').value;
  if (!fechaSeleccionada) return alert("Selecciona una fecha");

  try {
    const res = await fetch(`http://localhost:3001/api/estadisticas/detalle/diario/${cedula}`);
    const dias = await res.json();

    const filtrado = dias.find(d => new Date(d.fecha).toISOString().slice(0, 10) === fechaSeleccionada);

    const container = document.getElementById('estadisticasDiarias');
    container.innerHTML = '';

    if (filtrado) {
      const p = document.createElement('p');
      p.innerHTML = `
        <strong>${fechaSeleccionada}:</strong>
        Puntualidad: ${filtrado.promedio_puntualidad} |
        Trato: ${filtrado.promedio_trato} |
        Resolución: ${filtrado.promedio_resolucion}
      `;
      container.appendChild(p);

      const ctxPastel = document.getElementById('graficoPastel').getContext('2d');
      // Actualiza gráfico
      new Chart(ctxPastel, {
        type: 'polarArea',
        data: {
          labels: ['Puntualidad', 'Trato', 'Resolución'],
          datasets: [{
            label: 'Promedio diario',
            data: [
              filtrado.promedio_puntualidad || 0,
              filtrado.promedio_trato || 0,
              filtrado.promedio_resolucion || 0
            ],
            backgroundColor: [
              'rgba(255, 99, 132, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(255, 206, 86, 0.6)'
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
              suggestedMin: 0,
              suggestedMax: 5
            }
          }
        }
      });
    } else {
      container.innerHTML = `<p>No hay datos para esa fecha.</p>`;
    }
  } catch (err) {
    console.error(err);
    alert("Error al obtener estadísticas filtradas.");
  }
});

  // try {
  //   const diarioRes = await fetch(`http://localhost:3001/api/estadisticas/detalle/diario/${cedula}`);
  //   const dias = await diarioRes.json();

  //   const container = document.getElementById('estadisticasDiarias');
  //   container.innerHTML = '';

  //   if (dias.length > 0) {
  //     const ultimoDia = dias[0];
  //     const fechaLocal = new Date(ultimoDia.fecha).toLocaleDateString('es-EC', { timeZone: 'America/Guayaquil' });

  //     const p = document.createElement('p');
  //     p.innerHTML = `
  //       <strong>${fechaLocal}:</strong>
  //       Puntualidad: ${ultimoDia.promedio_puntualidad} |
  //       Trato: ${ultimoDia.promedio_trato} |
  //       Resolución: ${ultimoDia.promedio_resolucion}
  //     `;
  //     container.appendChild(p);

  //     const ctxPastel = document.getElementById('graficoPastel').getContext('2d');

  //     new Chart(ctxPastel, {
  //       type: 'polarArea',
  //       data: {
  //         labels: ['Puntualidad', 'Trato', 'Resolución'],
  //         datasets: [{
  //           label: 'Promedio diario',
  //           data: [
  //             ultimoDia.promedio_puntualidad || 0,
  //             ultimoDia.promedio_trato || 0,
  //             ultimoDia.promedio_resolucion || 0
  //           ],
  //           backgroundColor: [
  //             'rgba(255, 99, 132, 0.6)',
  //             'rgba(54, 162, 235, 0.6)',
  //             'rgba(255, 206, 86, 0.6)'
  //           ],
  //           borderColor: [
  //             'rgb(255, 99, 132)',
  //             'rgb(54, 162, 235)',
  //             'rgb(255, 206, 86)'
  //           ],
  //           borderWidth: 1
  //         }]
  //       },
  //       options: {
          
  //         plugins: {
  //           legend: {
  //             position: 'top'
  //           }
  //         }
  //       }
  //     });
  //   } else {
  //     container.innerHTML = `<p>No hay datos de hoy.</p>`;
  //   }
  // } catch (err) {
  //   console.error(err);
  //   alert("Error al obtener estadísticas diarias.");
  // }
});


