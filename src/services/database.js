import { ref, set, get, push, remove, update, onValue } from "firebase/database";
import { database } from "../firebase/config";

// Categorías
export const getCategorias = async () => {
  const categoriasRef = ref(database, "categorias");
  const snapshot = await get(categoriasRef);
  if (snapshot.exists()) {
    const data = snapshot.val();
    return Object.keys(data).map(key => ({
      id: key,
      ...data[key]
    }));
  }
  return [];
};

// Listener en tiempo real para categorías
export const subscribeToCategorias = (callback) => {
  const categoriasRef = ref(database, "categorias");
  const unsubscribe = onValue(categoriasRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      const categorias = Object.keys(data).map(key => ({
        id: key,
        ...data[key]
      }));
      callback(categorias);
    } else {
      callback([]);
    }
  }, (error) => {
    console.error("Error al escuchar categorías:", error);
    callback([]);
  });
  
  return unsubscribe;
};

export const addCategoria = async (categoria) => {
  const categoriasRef = ref(database, "categorias");
  const newCategoriaRef = push(categoriasRef);
  await set(newCategoriaRef, {
    nombre: categoria.nombre,
    descripcion: categoria.descripcion || "",
    imagen: categoria.imagen || "",
    seccionId: categoria.seccionId || null,
    createdAt: new Date().toISOString()
  });
  return newCategoriaRef.key;
};

export const updateCategoria = async (id, categoria) => {
  const categoriaRef = ref(database, `categorias/${id}`);
  await update(categoriaRef, {
    nombre: categoria.nombre,
    descripcion: categoria.descripcion || "",
    imagen: categoria.imagen || "",
    seccionId: categoria.seccionId || null,
    updatedAt: new Date().toISOString()
  });
};

export const deleteCategoria = async (id) => {
  const categoriaRef = ref(database, `categorias/${id}`);
  await remove(categoriaRef);
};

// Productos
export const getProductos = async () => {
  const productosRef = ref(database, "productos");
  const snapshot = await get(productosRef);
  if (snapshot.exists()) {
    const data = snapshot.val();
    return Object.keys(data).map(key => ({
      id: key,
      ...data[key]
    }));
  }
  return [];
};

// Listener en tiempo real para productos
export const subscribeToProductos = (callback) => {
  const productosRef = ref(database, "productos");
  const unsubscribe = onValue(productosRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      const productos = Object.keys(data).map(key => ({
        id: key,
        ...data[key]
      }));
      callback(productos);
    } else {
      callback([]);
    }
  }, (error) => {
    console.error("Error al escuchar productos:", error);
    callback([]);
  });
  
  return unsubscribe;
};

export const getProductosByCategoria = async (categoriaId) => {
  const productos = await getProductos();
  return productos.filter(p => p.categoriaId === categoriaId);
};

export const addProducto = async (producto) => {
  const productosRef = ref(database, "productos");
  const newProductoRef = push(productosRef);
  await set(newProductoRef, {
    nombre: producto.nombre,
    descripcion: producto.descripcion || "",
    precio: producto.precio,
    categoriaId: producto.categoriaId,
    imagen: producto.imagen || "",
    disponible: producto.disponible !== undefined ? producto.disponible : true,
    createdAt: new Date().toISOString()
  });
  return newProductoRef.key;
};

export const updateProducto = async (id, producto) => {
  const productoRef = ref(database, `productos/${id}`);
  await update(productoRef, {
    nombre: producto.nombre,
    descripcion: producto.descripcion || "",
    precio: producto.precio,
    categoriaId: producto.categoriaId,
    imagen: producto.imagen || "",
    disponible: producto.disponible !== undefined ? producto.disponible : true,
    updatedAt: new Date().toISOString()
  });
};

export const deleteProducto = async (id) => {
  const productoRef = ref(database, `productos/${id}`);
  await remove(productoRef);
};

// Temporada del menú
export const getTemporada = async () => {
  const temporadaRef = ref(database, "config/temporada");
  const snapshot = await get(temporadaRef);
  if (snapshot.exists()) {
    return snapshot.val();
  }
  return null; // null = sin temporada
};

// Listener en tiempo real para temporada
export const subscribeToTemporada = (callback) => {
  const temporadaRef = ref(database, "config/temporada");
  const unsubscribe = onValue(temporadaRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.val());
    } else {
      callback(null);
    }
  }, (error) => {
    console.error("Error al escuchar temporada:", error);
    callback(null);
  });
  
  return unsubscribe;
};

export const updateTemporada = async (temporada) => {
  const temporadaRef = ref(database, "config/temporada");
  await set(temporadaRef, temporada);
};

// Secciones
export const getSecciones = async () => {
  const seccionesRef = ref(database, "secciones");
  const snapshot = await get(seccionesRef);
  if (snapshot.exists()) {
    const data = snapshot.val();
    return Object.keys(data).map(key => ({
      id: key,
      ...data[key]
    }));
  }
  return [];
};

// Listener en tiempo real para secciones
export const subscribeToSecciones = (callback) => {
  const seccionesRef = ref(database, "secciones");
  const unsubscribe = onValue(seccionesRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      const secciones = Object.keys(data).map(key => ({
        id: key,
        ...data[key]
      }));
      callback(secciones);
    } else {
      callback([]);
    }
  }, (error) => {
    console.error("Error al escuchar secciones:", error);
    callback([]);
  });
  
  return unsubscribe;
};

export const addSeccion = async (seccion) => {
  const seccionesRef = ref(database, "secciones");
  const newSeccionRef = push(seccionesRef);
  await set(newSeccionRef, {
    nombre: seccion.nombre,
    orden: seccion.orden || 0,
    createdAt: new Date().toISOString()
  });
  return newSeccionRef.key;
};

export const updateSeccion = async (id, seccion) => {
  const seccionRef = ref(database, `secciones/${id}`);
  await update(seccionRef, {
    nombre: seccion.nombre,
    orden: seccion.orden || 0,
    updatedAt: new Date().toISOString()
  });
};

export const deleteSeccion = async (id) => {
  const seccionRef = ref(database, `secciones/${id}`);
  await remove(seccionRef);
};

