/**
 * Funciones para convertir temperaturas entre Celsius y Fahrenheit
 */

/**
 * Convierte Celsius a Fahrenheit
 * @param {number} celsius - Temperatura en Celsius
 * @returns {number} Temperatura en Fahrenheit
 */
function celsiusToFahrenheit(celsius) {
    if (typeof celsius !== 'number' || isNaN(celsius)) {
        throw new Error('La temperatura debe ser un número válido');
    }

    return (celsius * 9/5) + 32;
}

/**
 * Convierte Fahrenheit a Celsius
 * @param {number} fahrenheit - Temperatura en Fahrenheit
 * @returns {number} Temperatura en Celsius
 */
function fahrenheitToCelsius(fahrenheit) {
    if (typeof fahrenheit !== 'number' || isNaN(fahrenheit)) {
        throw new Error('La temperatura debe ser un número válido');
    }

    return (fahrenheit - 32) * 5/9;
}

/**
 * Convierte temperatura según la unidad especificada
 * @param {number} temp - Temperatura a convertir
 * @param {string} unidad - Unidad de origen ('c' para Celsius, 'f' para Fahrenheit)
 * @returns {Object} Objeto con la temperatura convertida y la unidad de destino
 */
function convertirTemperatura(temp, unidad) {
    // Validar que la temperatura sea un número
    if (typeof temp !== 'number' || isNaN(temp)) {
        throw new Error('La temperatura debe ser un número válido');
    }

    // Validar y normalizar la unidad
    const unidadNormalizada = unidad.toLowerCase().trim();

    if (unidadNormalizada === 'c' || unidadNormalizada === 'celsius') {
        const fahrenheit = celsiusToFahrenheit(temp);
        return {
            original: {
                valor: temp,
                unidad: 'Celsius',
                simbolo: '°C'
            },
            convertida: {
                valor: Math.round(fahrenheit * 100) / 100, // Redondear a 2 decimales
                unidad: 'Fahrenheit',
                simbolo: '°F'
            }
        };
    } else if (unidadNormalizada === 'f' || unidadNormalizada === 'fahrenheit') {
        const celsius = fahrenheitToCelsius(temp);
        return {
            original: {
                valor: temp,
                unidad: 'Fahrenheit',
                simbolo: '°F'
            },
            convertida: {
                valor: Math.round(celsius * 100) / 100, // Redondear a 2 decimales
                unidad: 'Celsius',
                simbolo: '°C'
            }
        };
    } else {
        throw new Error('Unidad no válida. Use "c" para Celsius o "f" para Fahrenheit');
    }
}

module.exports = {
    celsiusToFahrenheit,
    fahrenheitToCelsius,
    convertirTemperatura
};
