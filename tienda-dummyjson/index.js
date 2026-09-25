// Endpoint base de DummyJSON
const API_URL = 'https://dummyjson.com';

// Encabezados HTTP completos para compatibilidad con GitHub Codespaces, auxiliado con IA
const HEADERS_DEFAULT = {
  'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Accept': 'application/json, text/plain, */*'
};

// Captura de argumentos omitiendo ejecutable y script
const argumentos = process.argv.slice(2);
const [metodo, ruta, ...resto] = argumentos;

async function ejecutar() {
  if (!metodo || !ruta) {
    console.log('\n Uso incorrecto. Ejemplos de comandos:');
    console.log('   npm run start -- GET products');
    console.log('   npm run start -- GET products/15');
    console.log('   npm run start -- POST products "Remera Rex" 300 remeras');
    console.log('   npm run start -- DELETE products/7\n');
    return;
  }

  const metodoUpper = metodo.toUpperCase();
  // Elimina barras diagonales iniciales si se ingresaron por error
  const rutaLimpia = ruta.startsWith('/') ? ruta.slice(1) : ruta;

  try {
    // 1. OBTENER TODOS LOS PRODUCTOS O UNO ESPECÍFICO (GET)
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

    // 2. CREAR UN PRODUCTO NUEVO (POST)
    else if (metodoUpper === 'POST' && rutaLimpia === 'products') {
      const [title, price, category] = resto;

      if (!title || !price || !category) {
        console.log('\n Faltan datos. Uso: npm run start -- POST products <title> <price> <category>');
        return;
       }

      const nuevoProducto = {
        title: title,
        price: parseFloat(price),
        category: category
      };

      // Nota: DummyJSON requiere la ruta '/products/add' para peticiones POST
      const respuesta = await fetch(`${API_URL}/products/add`, {
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