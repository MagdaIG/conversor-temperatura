#!/usr/bin/env node

const yargs = require('yargs');
const chalk = require('chalk');
const { convertirTemperatura } = require('./helpers/convert');

// Configuración de yargs
const argv = yargs
    .usage(chalk.cyan('Uso: $0 --temp <temperatura> --unidad <c|f>'))
    .example('$0 --temp 25 --unidad c', 'Convierte 25°C a Fahrenheit')
    .example('$0 --temp 77 --unidad f', 'Convierte 77°F a Celsius')
    .option('temp', {
        alias: 't',
        describe: 'Valor numérico de la temperatura a convertir',
        type: 'number',
        demandOption: true
    })
    .option('unidad', {
        alias: 'u',
        describe: 'Unidad de temperatura (c para Celsius, f para Fahrenheit)',
        type: 'string',
        choices: ['c', 'f', 'C', 'F', 'celsius', 'fahrenheit'],
        demandOption: true
    })
    .help('h')
    .alias('h', 'help')
    .version('1.0.0')
    .epilogue(chalk.gray('Ejemplos de uso:\n') +
        chalk.gray('  node app.js --temp 25 --unidad c\n') +
        chalk.gray('  node app.js --temp 77 --unidad f\n') +
        chalk.gray('  node app.js -t 0 -u c'))
    .argv;

// Función principal
function main() {
    try {
        console.log(chalk.blue.bold('\n🌡️  CONVERSOR DE TEMPERATURAS 🌡️\n'));

        // Validar que la temperatura sea un número válido
        if (isNaN(argv.temp)) {
            console.error(chalk.red.bold('❌ Error: La temperatura debe ser un número válido'));
            console.error(chalk.red('   Ejemplo: --temp 25'));
            process.exit(1);
        }

        // Validar la unidad
        const unidadValida = ['c', 'f', 'C', 'F', 'celsius', 'fahrenheit'].includes(argv.unidad);
        if (!unidadValida) {
            console.error(chalk.red.bold('❌ Error: Unidad no válida'));
            console.error(chalk.red('   Use "c" para Celsius o "f" para Fahrenheit'));
            console.error(chalk.yellow('   Ejemplo: --unidad c'));
            process.exit(1);
        }

        // Realizar la conversión
        const resultado = convertirTemperatura(argv.temp, argv.unidad);

        // Mostrar el resultado
        console.log(chalk.green.bold('✅ Conversión exitosa:'));
        console.log(chalk.white(`   ${resultado.original.valor}${resultado.original.simbolo} = ${resultado.convertida.valor}${resultado.convertida.simbolo}`));
        console.log(chalk.gray(`   ${resultado.original.valor} ${resultado.original.unidad} → ${resultado.convertida.valor} ${resultado.convertida.unidad}`));

        // Mostrar información adicional
        console.log(chalk.blue('\n📊 Información adicional:'));
        if (resultado.original.unidad === 'Celsius') {
            if (resultado.original.valor === 0) {
                console.log(chalk.cyan('   💧 Punto de congelación del agua'));
            } else if (resultado.original.valor === 100) {
                console.log(chalk.cyan('   🔥 Punto de ebullición del agua'));
            } else if (resultado.original.valor === 37) {
                console.log(chalk.cyan('   🏥 Temperatura corporal normal'));
            }
        } else {
            if (resultado.original.valor === 32) {
                console.log(chalk.cyan('   💧 Punto de congelación del agua'));
            } else if (resultado.original.valor === 212) {
                console.log(chalk.cyan('   🔥 Punto de ebullición del agua'));
            } else if (resultado.original.valor === 98.6) {
                console.log(chalk.cyan('   🏥 Temperatura corporal normal'));
            }
        }

        console.log(chalk.green.bold('\n🎉 ¡Conversión completada exitosamente!\n'));

    } catch (error) {
        console.error(chalk.red.bold('❌ Error:'), chalk.red(error.message));
        console.error(chalk.yellow('\n💡 Sugerencias:'));
        console.error(chalk.yellow('   - Verifique que la temperatura sea un número válido'));
        console.error(chalk.yellow('   - Use "c" para Celsius o "f" para Fahrenheit'));
        console.error(chalk.yellow('   - Ejemplo: node app.js --temp 25 --unidad c'));
        process.exit(1);
    }
}

// Ejecutar la aplicación
if (require.main === module) {
    main();
}

module.exports = { main };
