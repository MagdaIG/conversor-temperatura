const fs = require('fs');
const path = require('path');

const PRODUCTS_FILE = path.join(__dirname, 'products.json');

/**
 * Lee el archivo products.json y devuelve el contenido en formato JSON
 * @returns {Array} Array de productos
 */
function readProducts() {
    try {
        const data = fs.readFileSync(PRODUCTS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        // Si el archivo no existe o hay error, devolver array vacío
        console.error('Error al leer productos:', error.message);
        return [];
    }
}

/**
 * Escribe los productos actualizados en el archivo products.json
 * @param {Array} products - Array de productos a escribir
 * @returns {boolean} true si se escribió correctamente, false en caso contrario
 */
function writeProducts(products) {
    try {
        fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf8');
        return true;
    } catch (error) {
        console.error('Error al escribir productos:', error.message);
        return false;
    }
}

/**
 * Elimina un producto por su id del archivo
 * @param {number} id - ID del producto a eliminar
 * @returns {boolean} true si se eliminó correctamente, false si no se encontró
 */
function deleteProduct(id) {
    try {
        const products = readProducts();
        const initialLength = products.length;
        const filteredProducts = products.filter(product => product.id !== id);

        if (filteredProducts.length === initialLength) {
            return false; // No se encontró el producto
        }

        return writeProducts(filteredProducts);
    } catch (error) {
        console.error('Error al eliminar producto:', error.message);
        return false;
    }
}

/**
 * Actualiza la información de un producto por su id
 * @param {number} id - ID del producto a actualizar
 * @param {Object} newData - Nuevos datos del producto
 * @returns {boolean} true si se actualizó correctamente, false si no se encontró
 */
function updateProduct(id, newData) {
    try {
        const products = readProducts();
        const productIndex = products.findIndex(product => product.id === id);

        if (productIndex === -1) {
            return false; // No se encontró el producto
        }

        // Actualizar solo los campos proporcionados
        products[productIndex] = { ...products[productIndex], ...newData };

        return writeProducts(products);
    } catch (error) {
        console.error('Error al actualizar producto:', error.message);
        return false;
    }
}

/**
 * Agrega un nuevo producto al archivo
 * @param {Object} product - Producto a agregar
 * @returns {boolean} true si se agregó correctamente, false en caso contrario
 */
function addProduct(product) {
    try {
        const products = readProducts();

        // Verificar que el ID no exista
        const existingProduct = products.find(p => p.id === product.id);
        if (existingProduct) {
            console.error('Error: Ya existe un producto con ese ID');
            return false;
        }

        products.push(product);
        return writeProducts(products);
    } catch (error) {
        console.error('Error al agregar producto:', error.message);
        return false;
    }
}

/**
 * Busca un producto por su ID
 * @param {number} id - ID del producto a buscar
 * @returns {Object|null} El producto encontrado o null si no existe
 */
function findProductById(id) {
    try {
        const products = readProducts();
        return products.find(product => product.id === id) || null;
    } catch (error) {
        console.error('Error al buscar producto:', error.message);
        return null;
    }
}

module.exports = {
    readProducts,
    writeProducts,
    deleteProduct,
    updateProduct,
    addProduct,
    findProductById
};

