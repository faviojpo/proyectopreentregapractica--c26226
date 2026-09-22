// index.js
const API_URL = 'https://fakestoreapi.com';

// Capturamos los argumentos a partir de la posición 2
const [, , metodo, ruta, ...restoArgumentos] = process.argv;

async function ejecutarComando() {
  try {
    if (!metodo || !ruta) {
      console.log(' Por favor, ingresa un método y una ruta.');
      return;
    }

    // 1. GET /products o GET /products/:id
    if (metodo.toUpperCase() === 'GET' && ruta.startsWith('products')) {
      const respuesta = await fetch(`${API_URL}/${ruta}`);
      const datos = await respuesta.json();
      console.log(' Resultado GET:');
      console.log(datos);
    } 
    
    // 2. POST /products <title> <price> <category>
    else if (metodo.toUpperCase() === 'POST' && ruta === 'products') {
      const [title, price, category] = restoArgumentos;

      if (!title || !price || !category) {
        console.log(' Faltan datos para crear el producto (title, price, category).');
        return;
      }

      const nuevoProducto = {
        title,
        price: parseFloat(price),
        category,
        description: 'Producto agregado desde CLI',
        image: 'https://i.pravatar.cc'
      };

      const respuesta = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoProducto)
      });

      const datos = await respuesta.json();
      console.log(' Producto creado con éxito:');
      console.log(datos);
    }

    // 3. DELETE /products/:id
    else if (metodo.toUpperCase() === 'DELETE' && ruta.startsWith('products/')) {
      const respuesta = await fetch(`${API_URL}/${ruta}`, {
        method: 'DELETE'
      });

      const datos = await respuesta.json();
      console.log(' Producto eliminado:');
      console.log(datos);
    } 
    
    else {
      console.log(' Comando no reconocido. Revisa el método o la ruta.');
    }

  } catch (error) {
    console.error(' Hubo un error en la petición:', error.message);
  }
}

ejecutarComando();