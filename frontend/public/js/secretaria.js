document.addEventListener('DOMContentLoaded', async () => {
  const nombre = sessionStorage.getItem('nombre');
  const cedula = sessionStorage.getItem('cedula');
  document.getElementById('nombreUsuario').textContent = nombre;

  // TOP 3
  try {
    const res = await fetch(`http://localhost:3001/api/estadisticas/${cedula}`);
    const top = await res.json();

    const contenedor = document.getElementById('topAtenciones1');
    contenedor.innerHTML = ''; // Limpiar antes de insertar

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
        }
      },
      r: {
        min: 0,
        max: 5,
        angleLines: {
          color: 'rgba(0, 0, 0, 0.6)', // Líneas desde el centro (puedes usar 'black' o '#000')
          lineWidth: 1.5
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.3)', // Líneas circulares (puedes aumentar opacidad)
          lineWidth: 1.2
        },
        pointLabels: {
          color: '#000', // Letras de 'Puntualidad', 'Trato', etc.
          font: {
            size: 14,
            weight: 'bold'
          }
        },
        ticks: {
          color: '#000', // Números de las escalas (1, 2, 3, ...)
          backdropColor: 'transparent',
          font: {
            size: 12
          }
        }
      }
    });
  } catch (err) {
    console.error(err);
    alert("Error al obtener estadísticas TOP.");
  }

  // DETALLE GENERAL + GRÁFICO DE DONA
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

  // DETALLE DIARIO + GRÁFICO DE RADAR
  function obtenerFechaActual() {
    const hoy = new Date();
    return hoy.toISOString().slice(0, 10); // yyyy-mm-dd
  }

  let graficoPastel = null;

  function mostrarDatosYGrafico(filtrado, fechaMostrada) {
    const container = document.getElementById('estadisticasDiarias');
    container.innerHTML = `
    <strong>${fechaMostrada}:</strong>
    Puntualidad: ${filtrado.promedio_puntualidad} |
    Trato: ${filtrado.promedio_trato} |
    Resolución: ${filtrado.promedio_resolucion}
  `;

    const canvas = document.getElementById('graficoPastel');
    canvas.style.display = 'block';

    if (graficoPastel) {
      graficoPastel.destroy();
      graficoPastel = null;
    }

    const ctx = canvas.getContext('2d');
    graficoPastel = new Chart(ctx, {
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
            'rgba(255, 99, 132, 0.1)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.3)'
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
  }

  async function mostrarEstadisticaPorFecha(fechaSeleccionada) {
    if (!fechaSeleccionada) return;

    try {
      const res = await fetch(`http://localhost:3001/api/estadisticas/detalle/diario/${cedula}`);
      const dias = await res.json();

      const filtrado = dias.find(d => d.fecha.slice(0, 10) === fechaSeleccionada);

      const container = document.getElementById('estadisticasDiarias');
      const canvas = document.getElementById('graficoPastel');
      container.innerHTML = '';

      if (filtrado) {
        mostrarDatosYGrafico(filtrado, fechaSeleccionada);
      } else {
        container.innerHTML = `<p>No hay datos para esta fecha.</p>`;
        if (graficoPastel) {
          graficoPastel.destroy();
          graficoPastel = null;
        }
        canvas.style.display = 'none';
      }
    } catch (err) {
      console.error(err);
      alert("Error al obtener estadísticas filtradas.");
    }
  }

  window.addEventListener('DOMContentLoaded', async () => {
    const hoy = obtenerFechaActual();
    const fechaInput = document.getElementById('fechaFiltro');
    fechaInput.value = hoy;

    try {
      const res = await fetch(`http://localhost:3001/api/estadisticas/detalle/diario/${cedula}`);
      const dias = await res.json();

      // Intenta encontrar datos para hoy
      const deHoy = dias.find(d => new Date(d.fecha).toISOString().slice(0, 10) === hoy);

      if (deHoy) {
        mostrarDatosYGrafico(deHoy, hoy);
      } else if (dias.length > 0) {
        // Si hoy no hay datos, toma el más reciente
        const masReciente = dias[0]; // porque el backend devuelve ORDER BY fecha DESC
        const fechaReciente = new Date(masReciente.fecha).toISOString().slice(0, 10);
        fechaInput.value = fechaReciente;
        mostrarDatosYGrafico(masReciente, fechaReciente);
      } else {
        document.getElementById('estadisticasDiarias').innerHTML = `<p>No hay datos disponibles.</p>`;
      }
    } catch (err) {
      console.error(err);
      alert("Error al cargar estadísticas iniciales.");
    }
  });


  document.getElementById('filtrarBtn').addEventListener('click', () => {
    const fecha = document.getElementById('fechaFiltro').value;
    mostrarEstadisticaPorFecha(fecha);
  });
});


