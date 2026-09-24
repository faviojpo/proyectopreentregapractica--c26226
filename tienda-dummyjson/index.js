// Usamos la URL completa con protocolo explícito
const API_URL = 'https://dummyjson.com';

// Encabezados completos para emular una petición de navegador web desde GitHub Codespaces
const HEADERS_DEFAULT = {
  'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Accept': 'application/json, text/plain, */*',
  'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
  'Cache-Control': 'no-cache',
  'Pragma': 'no-cache'
};

// Captura de argumentos pasando los 2 primeros del sistema
const argumentos = process.argv.slice(2);
const [metodo, ruta, ...resto] = argumentos;

async function ejecutar() {
  if (!metodo || !ruta) {
    console.log('\n Uso incorrecto. Ejemplos:');
    console.log('   npm run start -- GET products');
    console.log('   npm run start -- GET products/15');
    console.log('   npm run start -- POST products "Remera Rex" 300 remeras');
    console.log('   npm run start -- DELETE products/7\n');
    return;
  }

  const metodoUpper = metodo.toUpperCase();
  // Limpiamos la ruta para asegurar el formato correcto
  const rutaLimpia = ruta.startsWith('/') ? ruta.slice(1) : ruta;

  try {
    // 1. OBTENER PRODUCTOS (GET)
    if (metodoUpper === 'GET' && rutaLimpia.startsWith('products')) {
      const respuesta = await fetch(`${API_URL}/${rutaLimpia}`, {
        method: 'GET',
        headers: HEADERS_DEFAULT
      });

      if (!respuesta.ok) {
        throw new Error(`La API respondió con estado ${respuesta.status}: ${respuesta.statusText}`);
      }

      const datos = await respuesta.json();
      console.log('\n--- Resultado GET ---');
      console.log(datos);
    }

    // 2. CREAR UN PRODUCTO (POST)
    else if (metodoUpper === 'POST' && rutaLimpia === 'products') {
      const [title, price, category] = resto;

      if (!title || !price || !category) {
        console.log('\n Faltan datos. Uso: npm run start -- POST products <title> <price> <category>');
        return;
      }

      const nuevoProducto = {
        title,
        price: parseFloat(price),
        category,
        description: 'Producto creado desde CLI en Codespaces',
        image: 'https://i.pravatar.cc'
      };

      const respuesta = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: {
          ...HEADERS_DEFAULT,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevoProducto)
      });

      if (!respuesta.ok) {
        throw new Error(`La API respondió con estado ${respuesta.status}: ${respuesta.statusText}`);
      }

      const datos = await respuesta.json();
      console.log('\n--- Producto Creado Exitosamente ---');
      console.log(datos);
    }

    // 3. ELIMINAR UN PRODUCTO (DELETE)
    else if (metodoUpper === 'DELETE' && rutaLimpia.startsWith('products/')) {
      const respuesta = await fetch(`${API_URL}/${rutaLimpia}`, {
        method: 'DELETE',
        headers: HEADERS_DEFAULT
      });

      if (!respuesta.ok) {
        throw new Error(`La API respondió con estado ${respuesta.status}: ${respuesta.statusText}`);
      }

      const datos = await respuesta.json();
      console.log('\n--- Producto Eliminado ---');
      console.log(datos);
    } 
    
    else {
      console.log(`\n Comando o ruta no válidos: ${metodoUpper} ${rutaLimpia}`);
    }

  } catch (error) {
    console.error('\n Hubo un error en la petición:', error.message);
  }
}

ejecutar();