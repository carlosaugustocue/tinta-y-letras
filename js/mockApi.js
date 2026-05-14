// js/mockApi.js

const BOOKS = [
  {
    id: 1,
    title: "Cien años de soledad",
    author: "Gabriel García Márquez",
    genre: "Ficción",
    price: 79000,
    coverUrl: "https://b2clibrerianacional.vteximg.com.br/arquivos/ids/244798/Portada.jpg?v=638644376551230000",
    description: "«Muchos años después, frente al pelotón de fusilamiento, el coronel Aureliano Buendía había de recordar aquella tarde remota en que su padre lo llevó a conocer el hielo.» La historia épica de la familia Buendía a lo largo de siete generaciones en el pueblo ficticio de Macondo.",
    stock: 12,
  },
  {
    id: 2,
    title: "El amor en los tiempos del cólera",
    author: "Gabriel García Márquez",
    genre: "Romance",
    price: 72000,
    coverUrl: "https://b2clibrerianacional.vteximg.com.br/arquivos/ids/355640/9786287824447.jpg?v=638974401393000000",
    description: "«Era inevitable: el olor de las almendras amargas le recordaba siempre el destino de los amores contrariados.» Una de las historias de amor más maravillosas de la literatura universal, donde Florentino Ariza espera más de cincuenta años por Fermina Daza.",
    stock: 8,
  },
  {
    id: 3,
    title: "1984",
    author: "George Orwell",
    genre: "Ciencia Ficción",
    price: 39000,
    coverUrl: "https://b2clibrerianacional.vteximg.com.br/arquivos/ids/359772/1.jpg?v=639070274840070000",
    description: "Winston Smith trabaja para el Ministerio de la Verdad en Londres. El Hermano Mayor observa a todo el mundo desde cada uno de los carteles. Una distopía que explora los peligros del totalitarismo y la vigilancia del estado.",
    stock: 20,
  },
  {
    id: 4,
    title: "Don Quijote de la Mancha",
    author: "Miguel de Cervantes",
    genre: "Clásico",
    price: 89900,
    coverUrl: "https://b2clibrerianacional.vteximg.com.br/arquivos/ids/313167/Portada---DON-QUIJOTE-DE-LA-MANCHA.jpg?v=6386467209999000",
    description: "Cervantes y El Quijote son el buque insignia de las letras españolas. La primera novela moderna narra las aventuras del ingenioso hidalgo Alonso Quijano y su fiel escudero Sancho Panza recorriendo la España del siglo XVII.",
    stock: 5,
  },
  {
    id: 5,
    title: "La sombra del viento",
    author: "Carlos Ruiz Zafón",
    genre: "Misterio",
    price: 59000,
    coverUrl: "https://b2clibrerianacional.vteximg.com.br/arquivos/ids/259442/Portada.jpg?v=638644867112170000",
    description: "Un amanecer de 1945, un muchacho es conducido por su padre a un misterioso lugar oculto en el corazón de la ciudad vieja: el Cementerio de los Libros Olvidados. Allí, Daniel Sempere encuentra un libro que cambiará su vida para siempre.",
    stock: 15,
  },
  {
    id: 6,
    title: "El Principito",
    author: "Antoine de Saint-Exupéry",
    genre: "Fábula",
    price: 25000,
    coverUrl: "https://b2clibrerianacional.vteximg.com.br/arquivos/ids/284396/Portada.jpg?v=638645706839530000",
    description: "Un clásico atemporal sobre la amistad, el amor y la pérdida de la inocencia. El pequeño príncipe viaja de planeta en planeta aprendiendo sobre lo verdaderamente importante en la vida.",
    stock: 30,
  },
  {
    id: 7,
    title: "Ficciones",
    author: "Jorge Luis Borges",
    genre: "Ficción",
    price: 69000,
    coverUrl: "https://b2clibrerianacional.vteximg.com.br/arquivos/ids/279274/Portada.jpg?v=638645574435600000",
    description: "Según Le Monde, uno de los cien mejores libros del siglo XX. Una colección de cuentos que exploran laberintos, bibliotecas infinitas y universos paralelos. La obra cumbre del genio argentino Jorge Luis Borges.",
    stock: 10,
  },
  {
    id: 8,
    title: "Los detectives salvajes",
    author: "Roberto Bolaño",
    genre: "Ficción",
    price: 72000,
    coverUrl: "https://b2clibrerianacional.vteximg.com.br/arquivos/ids/360640/427475.jpg?v=639090268853200000",
    description: "Ganadora de los premios Herralde y Rómulo Gallegos, está considerada unánimemente la obra maestra de Roberto Bolaño. Entre la narrativa detectivesca y la novela de carretera, una búsqueda apasionante por México, Europa y el desierto de Sonora.",
    stock: 7,
  },
  {
    id: 9,
    title: "Pedro Páramo",
    author: "Juan Rulfo",
    genre: "Clásico",
    price: 58000,
    coverUrl: "https://b2clibrerianacional.vteximg.com.br/arquivos/ids/268455/Portada.jpg?v=638645153725030000",
    description: "Juan Preciado viaja a Comala buscando a su padre Pedro Páramo, y encuentra un pueblo habitado por murmullos y muertos. La obra más influyente de la literatura mexicana y una de las novelas fundamentales del siglo XX.",
    stock: 18,
  },
  {
    id: 10,
    title: "La ciudad y los perros",
    author: "Mario Vargas Llosa",
    genre: "Ficción",
    price: 82000,
    coverUrl: "https://b2clibrerianacional.vteximg.com.br/arquivos/ids/349157/Portada---LA-CIUDAD-Y-LOS-PERROS.jpg?v=638821388928070000",
    description: "En 1962 recibía el Premio Biblioteca Breve. La vida brutal dentro de un colegio militar limeño, los secretos que guarda y los códigos de honor que rigen a sus cadetes. La novela que lanzó a Vargas Llosa a la fama internacional.",
    stock: 9,
  },
];

/**
 * GET /api/books
 * Retorna el catálogo de libros disponibles.
 * Parámetros: { genre?: string, search?: string }
 * Éxito: { ok: true, data: Book[] }
 * Error: { ok: false, message: string }
 */
export async function getBooks(filters = {}) {
  await new Promise((resolve) => setTimeout(resolve, 800));

  if (Math.random() < 0.2) {
    console.log("500 Internal Server Error", { endpoint: "GET /api/books", filters });
    return {
      ok: false,
      message: "Error al cargar el catálogo. Intenta nuevamente.",
    };
  }

  let result = [...BOOKS];

  if (filters.genre && filters.genre !== "") {
    result = result.filter(
      (b) => b.genre.toLowerCase() === filters.genre.toLowerCase()
    );
  }

  if (filters.search && filters.search.trim() !== "") {
    const term = filters.search.trim().toLowerCase();
    result = result.filter(
      (b) =>
        b.title.toLowerCase().includes(term) ||
        b.author.toLowerCase().includes(term)
    );
  }

  return { ok: true, data: result };
}

/**
 * POST /api/orders
 * Registra una nueva orden de compra.
 * Parámetros: { customer: CustomerData, items: CartItem[], total: number }
 * Éxito: { ok: true, data: { orderId: string, estimatedDelivery: string } }
 * Error: { ok: false, message: string }
 */
export async function createOrder(orderData) {
  await new Promise((resolve) => setTimeout(resolve, 800));

  if (Math.random() < 0.2) {
    console.log("500 Internal Server Error", { endpoint: "POST /api/orders", orderData });
    return {
      ok: false,
      message: "No fue posible procesar tu pedido. Verifica tu conexión e intenta de nuevo.",
    };
  }

  const orderId = "ORD-" + Math.random().toString(36).substring(2, 8).toUpperCase();
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 7);
  const estimatedDelivery = deliveryDate.toISOString().split("T")[0];

  return {
    ok: true,
    data: { orderId, estimatedDelivery },
  };
}
