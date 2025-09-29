class TemperatureConverter {
    constructor() {
        this.currentUnit = 'c';
        this.currentTemperature = 19;
        this.history = this.loadHistory();
        this.isDarkMode = true;
        this.initializeElements();
        this.bindEvents();
        this.updateDisplay();
        this.updateHistoryDisplay();
        this.initializeTheme();
    }

    initializeElements() {
        this.temperatureValue = document.getElementById('temperatureValue');
        this.temperatureUnit = document.getElementById('temperatureUnit');
        this.temperatureInput = document.getElementById('temperatureInput');
        this.unitButtons = document.querySelectorAll('.unit-btn');
        this.convertBtn = document.getElementById('convertBtn');
        this.resultDisplay = document.getElementById('resultDisplay');
        this.resultValue = document.getElementById('resultValue');
        this.resultUnit = document.getElementById('resultUnit');
        this.resultLabel = document.getElementById('resultLabel');
        this.progressCircle = document.getElementById('progressCircle');
        this.temperatureArrow = document.getElementById('temperatureArrow');
        this.historyList = document.getElementById('historyList');
        this.clearHistoryBtn = document.getElementById('clearHistory');
        this.themeToggle = document.getElementById('themeToggle');
    }

    bindEvents() {
        // Event listeners para botones de unidad
        this.unitButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setUnit(e.target.dataset.unit);
            });
        });

        // Event listener para input de temperatura
        this.temperatureInput.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            if (!isNaN(value)) {
                this.setTemperature(value);
            } else if (e.target.value === '') {
                this.setTemperature(0);
            }
        });

        // Event listener para botón de conversión
        this.convertBtn.addEventListener('click', () => {
            this.convertTemperature();
        });

        // Event listener para Enter en el input
        this.temperatureInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.convertTemperature();
            }
        });

        // Event listener para limpiar historial
        this.clearHistoryBtn.addEventListener('click', () => {
            this.clearHistory();
        });

        // Event listener para toggle de tema
        this.themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });

        // Atajos de teclado
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case 'h':
                        e.preventDefault();
                        this.clearHistory();
                        break;
                    case 't':
                        e.preventDefault();
                        this.toggleTheme();
                        break;
                }
            }
        });
    }

    setUnit(unit) {
        this.currentUnit = unit;

        // Actualizar botones activos
        this.unitButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.unit === unit) {
                btn.classList.add('active');
            }
        });

        // Actualizar display
        this.temperatureUnit.textContent = unit === 'c' ? '°C' : '°F';
        this.updateDisplay();
    }

    setTemperature(temperature) {
        this.currentTemperature = temperature;
        // Mostrar la temperatura exacta en el círculo (con decimales si es necesario)
        this.temperatureValue.textContent = temperature % 1 === 0 ? Math.round(temperature) : temperature.toFixed(1);
        this.updateProgressRing();
    }

    updateDisplay() {
        // Mostrar la temperatura exacta en el círculo (con decimales si es necesario)
        this.temperatureValue.textContent = this.currentTemperature % 1 === 0 ? Math.round(this.currentTemperature) : this.currentTemperature.toFixed(1);
        this.temperatureInput.value = this.currentTemperature;
        this.updateProgressRing();
    }

    updateProgressRing() {
        // Calcular el progreso basado en la temperatura
        let progress;
        if (this.currentUnit === 'c') {
            // Para Celsius: 0°C = 0%, 100°C = 100%
            progress = Math.max(0, Math.min(100, this.currentTemperature));
        } else {
            // Para Fahrenheit: 32°F = 0%, 212°F = 100%
            progress = Math.max(0, Math.min(100, (this.currentTemperature - 32) * 100 / 180));
        }

        const circumference = 2 * Math.PI * 90; // r = 90
        const offset = circumference - (progress / 100) * circumference;

        this.progressCircle.style.strokeDashoffset = offset;

        // Actualizar la flecha indicadora
        this.updateTemperatureArrow(progress);
    }

    updateTemperatureArrow(progress) {
        // Calcular el ángulo de rotación (0° = arriba, 180° = abajo)
        const angle = (progress / 100) * 180;

        // Calcular el color basado en la temperatura
        let color;
        if (progress <= 20) {
            // Frío: azul claro
            color = '#60a5fa';
        } else if (progress <= 40) {
            // Fresco: azul
            color = '#3b82f6';
        } else if (progress <= 60) {
            // Templado: verde
            color = '#10b981';
        } else if (progress <= 80) {
            // Cálido: amarillo/naranja
            color = '#f59e0b';
        } else {
            // Caliente: rojo
            color = '#ef4444';
        }

        // Aplicar transformación y color
        this.temperatureArrow.style.transform = `rotate(${angle}deg)`;
        this.temperatureArrow.style.color = color;

        // Agregar efecto de brillo para temperaturas extremas
        if (progress <= 10 || progress >= 90) {
            this.temperatureArrow.style.filter = 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3)) drop-shadow(0 0 8px currentColor)';
        } else {
            this.temperatureArrow.style.filter = 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))';
        }
    }

    async convertTemperature() {
        try {
            const response = await fetch('/api/convert', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    temperature: this.currentTemperature,
                    unit: this.currentUnit
                })
            });

            const data = await response.json();

            if (data.success) {
                this.showResult(data.data);
                this.addToHistory(data.data);
            } else {
                this.showError(data.message);
            }
        } catch (error) {
            this.showError('Error de conexión. Intente nuevamente.');
        }
    }

    showResult(result) {
        this.resultValue.textContent = result.convertida.valor;
        this.resultUnit.textContent = result.convertida.simbolo;
        this.resultLabel.textContent = result.convertida.unidad;
        this.resultDisplay.style.display = 'block';

        // Animación de entrada
        this.resultDisplay.style.opacity = '0';
        this.resultDisplay.style.transform = 'translateY(10px)';

        setTimeout(() => {
            this.resultDisplay.style.transition = 'all 0.3s ease';
            this.resultDisplay.style.opacity = '1';
            this.resultDisplay.style.transform = 'translateY(0)';
        }, 10);
    }

    showError(message) {
        // Crear o actualizar mensaje de error
        let errorDiv = document.querySelector('.error-message');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.style.cssText = `
                background: rgba(220, 38, 38, 0.9);
                backdrop-filter: blur(10px);
                color: white;
                padding: 12px 16px;
                border-radius: 8px;
                margin-top: 16px;
                font-size: 14px;
                text-align: center;
                border: 1px solid rgba(220, 38, 38, 0.3);
            `;
            document.querySelector('.converter-widget').appendChild(errorDiv);
        }

        errorDiv.textContent = message;
        errorDiv.style.display = 'block';

        // Ocultar después de 3 segundos
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 3000);
    }

    // Funciones del historial
    loadHistory() {
        const saved = localStorage.getItem('temperatureHistory');
        return saved ? JSON.parse(saved) : [];
    }

    saveHistory() {
        localStorage.setItem('temperatureHistory', JSON.stringify(this.history));
    }

    addToHistory(conversion) {
        const historyItem = {
            id: Date.now(),
            timestamp: new Date().toLocaleTimeString(),
            original: conversion.original,
            converted: conversion.convertida
        };

        this.history.unshift(historyItem);

        // Mantener solo los últimos 10 elementos
        if (this.history.length > 10) {
            this.history = this.history.slice(0, 10);
        }

        this.saveHistory();
        this.updateHistoryDisplay();
    }

    updateHistoryDisplay() {
        if (this.history.length === 0) {
            this.historyList.innerHTML = '<div class="history-empty">No hay conversiones recientes</div>';
            this.clearHistoryBtn.style.display = 'none';
        } else {
            this.historyList.innerHTML = this.history.map(item => `
                <div class="history-item">
                    <div>${item.original.valor}${item.original.simbolo} → ${item.converted.valor}${item.converted.simbolo}</div>
                    <div style="font-size: 10px; color: #888; margin-top: 2px;">${item.timestamp}</div>
                </div>
            `).join('');
            this.clearHistoryBtn.style.display = 'block';
        }
    }

    clearHistory() {
        this.history = [];
        this.saveHistory();
        this.updateHistoryDisplay();
    }

    // Funciones del tema
    initializeTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            this.isDarkMode = savedTheme === 'dark';
        }
        this.applyTheme();
    }

    toggleTheme() {
        this.isDarkMode = !this.isDarkMode;
        this.applyTheme();
        localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    }

    applyTheme() {
        const body = document.body;
        if (this.isDarkMode) {
            body.classList.remove('light-theme');
            body.classList.add('dark-theme');
        } else {
            body.classList.remove('dark-theme');
            body.classList.add('light-theme');
        }
    }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new TemperatureConverter();
});

// Función para manejar el reconocimiento de voz (opcional)
function startVoiceRecognition() {
    if ('webkitSpeechRecognition' in window) {
        const recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'es-ES';

        recognition.onresult = function(event) {
            const result = event.results[0][0].transcript;
            const temperature = parseFloat(result.match(/\d+/)?.[0]);
            if (temperature) {
                document.getElementById('temperatureInput').value = temperature;
                document.getElementById('temperatureInput').dispatchEvent(new Event('input'));
            }
        };

        recognition.start();
    }
}
