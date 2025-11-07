const editorMessage = 'Invalid JSON. Provide a JSON object, e.g. {"message":"Hello"}';

const weatherCanvas = document.getElementById('weather-chart');
let weatherChart = null;

function toLocaleLabel(value) {
  const date = new Date(value);
  if (!Number.isNaN(date.getTime())) {
    return date.toLocaleString([], { hour: 'numeric', minute: '2-digit', month: 'short', day: 'numeric' });
  }
  return value;
}

function renderWeatherChart(payload) {
  if (!weatherCanvas || typeof Chart === 'undefined') {
    return;
  }

  const temperatures = Array.isArray(payload?.temperatures) ? payload.temperatures.map(Number) : [];
  const rawTimes = payload?.full_data?.hourly?.time || [];
  const labels = rawTimes.slice(0, temperatures.length).map(toLocaleLabel);

  if (!temperatures.length || !labels.length) {
    if (weatherChart) {
      weatherChart.destroy();
      weatherChart = null;
    }
    return;
  }

  const ctx = weatherCanvas.getContext('2d');
  if (!ctx) {
    return;
  }

  if (weatherChart) {
    weatherChart.destroy();
  }

  weatherChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Temperature (°C)',
          data: temperatures,
          borderColor: '#4b79a1',
          backgroundColor: 'rgba(75, 121, 161, 0.25)',
          tension: 0.25,
          fill: true,
          borderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: '#35586b'
        }
      ]
    },
    options: {
      responsive: true,
      interaction: {
        intersect: false,
        mode: 'index'
      },
      scales: {
        y: {
          beginAtZero: false,
          title: {
            display: true,
            text: '°C'
          }
        },
        x: {
          display: true,
          title: {
            display: true,
            text: 'Time'
          }
        }
      },
      plugins: {
        legend: {
          display: true
        },
        tooltip: {
          callbacks: {
            label(context) {
              const value = context.parsed.y;
              const formatted = Number.isFinite(value) ? value.toFixed(1) : value;
              return `${formatted} °C`;
            }
          }
        }
      }
    }
  });
}

function serializeForm(form) {
  const data = {};
  const formData = new FormData(form);
  for (const [key, value] of formData.entries()) {
    if (value !== '') {
      data[key] = value;
    }
  }
  return data;
}

async function handleSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const resultEl = form.nextElementSibling;

  const endpoint = form.dataset.endpoint;
  const method = form.dataset.method || 'GET';
  const pathParam = form.dataset.pathParam;
  const jsonBody = form.dataset.json === 'true';

  const data = serializeForm(form);

  let url = endpoint;
  const options = { method, headers: {} };

  try {
    if (pathParam) {
      const paramValue = data[pathParam];
      if (!paramValue) {
        throw new Error(`Missing required path parameter: ${pathParam}`);
      }
      url += `/${encodeURIComponent(paramValue)}`;
      delete data[pathParam];
    }

    if (method === 'GET') {
      const params = new URLSearchParams(data).toString();
      if (params) {
        url += `?${params}`;
      }
    } else {
      if (jsonBody) {
        let payload;
        const keys = Object.keys(data);
        if (keys.length === 1 && keys[0] === 'body') {
          try {
            payload = JSON.parse(data.body);
          } catch (err) {
            throw new Error(editorMessage);
          }
        } else {
          payload = data;
        }
        options.body = JSON.stringify(payload);
        options.headers['Content-Type'] = 'application/json';
      } else {
        options.body = JSON.stringify(data);
        options.headers['Content-Type'] = 'application/json';
      }
    }

    const response = await fetch(url, options);
    const text = await response.text();
    let payload;
    try {
      payload = JSON.parse(text);
    } catch (_) {
      payload = text;
    }

    resultEl.textContent = JSON.stringify(payload, null, 2);
    resultEl.classList.toggle('error', !response.ok);

    if (endpoint === '/api/weather' && response.ok) {
      renderWeatherChart(payload);
    }
  } catch (error) {
    resultEl.textContent = error.message;
    resultEl.classList.add('error');
    if (endpoint === '/api/weather') {
      renderWeatherChart({ temperatures: [], full_data: { hourly: { time: [] } } });
    }
  }
}

document.querySelectorAll('form[data-endpoint]').forEach((form) => {
  form.addEventListener('submit', handleSubmit);
});

const healthBtn = document.getElementById('health-check');
const healthResult = document.getElementById('health-result');

if (healthBtn) {
  healthBtn.addEventListener('click', async () => {
    try {
      const response = await fetch('/health');
      const data = await response.json();
      healthResult.textContent = JSON.stringify(data, null, 2);
      healthResult.classList.remove('error');
    } catch (error) {
      healthResult.textContent = error.message;
      healthResult.classList.add('error');
    }
  });
}

