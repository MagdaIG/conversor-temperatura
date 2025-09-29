# Conversor de Temperaturas

Una aplicación completa para convertir temperaturas entre Celsius y Fahrenheit, disponible tanto como interfaz web moderna como herramienta de línea de comandos.

## Características

- **Interfaz Web Moderna**: Diseño elegante con indicador circular de temperatura
- **API REST**: Endpoint para conversiones programáticas
- **Herramienta CLI**: Aplicación de línea de comandos con validaciones
- **Validaciones Robustas**: Manejo de errores y validación de entrada
- **Responsive Design**: Compatible con dispositivos móviles y desktop

## Instalación

1. Clonar el repositorio:
```bash
git clone <url-del-repositorio>
cd conversor-temperaturas
```

2. Instalar dependencias:
```bash
npm install
```

## Uso

### Aplicación Web

1. Iniciar el servidor:
```bash
npm start
```

2. Abrir en el navegador:
```
http://localhost:3000
```

3. Para desarrollo con recarga automática:
```bash
npm run dev
```

### Herramienta de Línea de Comandos

```bash
# Conversión básica
node app.js --temp 25 --unidad c

# Usando alias cortos
node app.js -t 77 -u f

# Con npm script
npm run cli -- --temp 0 --unidad c
```

### API REST

#### POST /api/convert

Convierte una temperatura entre unidades.

**Parámetros:**
- `temperature` (number): Valor de la temperatura
- `unit` (string): Unidad de origen ("c" o "f")

**Ejemplo:**
```bash
curl -X POST http://localhost:3000/api/convert \
  -H "Content-Type: application/json" \
  -d '{"temperature": 25, "unit": "c"}'
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "original": {
      "valor": 25,
      "unidad": "Celsius",
      "simbolo": "°C"
    },
    "convertida": {
      "valor": 77,
      "unidad": "Fahrenheit",
      "simbolo": "°F"
    }
  }
}
```

#### GET /api/info

Obtiene información sobre la API.

## Estructura del Proyecto

```
conversor-temperaturas/
├── app.js                 # Aplicación CLI
├── server.js              # Servidor web Express
├── helpers/
│   └── convert.js         # Funciones de conversión
├── public/                # Archivos estáticos
│   ├── index.html         # Interfaz web
│   ├── css/
│   │   └── styles.css     # Estilos
│   └── js/
│       └── app.js         # JavaScript frontend
├── package.json           # Configuración del proyecto
└── README.md             # Documentación
```

## Tecnologías Utilizadas

### Backend
- **Node.js**: Runtime de JavaScript
- **Express.js**: Framework web
- **Yargs**: Parser de argumentos CLI
- **Chalk**: Colores en terminal

### Frontend
- **HTML5**: Estructura semántica
- **CSS3**: Estilos modernos con gradientes y animaciones
- **JavaScript ES6+**: Funcionalidad interactiva
- **Fetch API**: Comunicación con el servidor

## Funciones de Conversión

### Celsius a Fahrenheit
```
F = (C × 9/5) + 32
```

### Fahrenheit a Celsius
```
C = (F - 32) × 5/9
```

## Puntos de Referencia

- **Punto de congelación del agua**: 0°C = 32°F
- **Punto de ebullición del agua**: 100°C = 212°F
- **Temperatura corporal normal**: 37°C = 98.6°F

## Scripts Disponibles

- `npm start`: Inicia el servidor web
- `npm run dev`: Inicia el servidor en modo desarrollo
- `npm run cli`: Ejecuta la herramienta CLI

## Validaciones

### CLI
- Temperatura debe ser un número válido
- Unidad debe ser "c" o "f"
- Parámetros obligatorios validados con yargs

### Web
- Validación de entrada en tiempo real
- Manejo de errores de red
- Feedback visual para el usuario

## Contribución

1. Fork el proyecto
2. Crear una rama para la nueva característica
3. Commit los cambios
4. Push a la rama
5. Abrir un Pull Request

## Licencia

Este proyecto está bajo la Licencia ISC.

## Autor

Desarrollado como proyecto educativo para demostrar el manejo de aplicaciones Node.js, interfaces web modernas y herramientas CLI.
# conversor-temperatura
