import React, { useState, useEffect } from "react";
import {
  getCategorias,
  getProductos,
  addCategoria,
  updateCategoria,
  deleteCategoria,
  addProducto,
  updateProducto,
  deleteProducto,
  getTemporada,
  updateTemporada
} from "../services/database";
import { uploadImage } from "../services/storage";
import "./Admin.css";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("productos");
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);

  // Estados para formularios
  const [formCategoria, setFormCategoria] = useState({
    nombre: "",
    descripcion: "",
    imagen: ""
  });
  const [formProducto, setFormProducto] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    categoriaId: "",
    imagen: "",
    disponible: true
  });
  const [editingCategoria, setEditingCategoria] = useState(null);
  const [editingProducto, setEditingProducto] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [temporadaActual, setTemporadaActual] = useState(null);

  useEffect(() => {
    cargarDatos();
    cargarTemporada();
  }, []);

  const cargarTemporada = async () => {
    try {
      const temp = await getTemporada();
      setTemporadaActual(temp);
    } catch (error) {
      console.error("Error al cargar temporada:", error);
    }
  };

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [categoriasData, productosData] = await Promise.all([
        getCategorias(),
        getProductos()
      ]);
      setCategorias(categoriasData);
      setProductos(productosData);
    } catch (error) {
      console.error("Error al cargar datos:", error);
      alert("Error al cargar datos: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Manejo de imágenes
  const handleImageUpload = async (file) => {
    if (!file) return null;
    try {
      setUploadingImage(true);
      const url = await uploadImage(file);
      return url;
    } catch (error) {
      console.error("Error al subir imagen:", error);
      alert("Error al subir imagen: " + error.message);
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleImageFileChange = async (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const url = await handleImageUpload(file);
      if (url) {
        if (type === "categoria") {
          setFormCategoria({ ...formCategoria, imagen: url });
        } else {
          setFormProducto({ ...formProducto, imagen: url });
        }
      }
    }
  };

  // Categorías
  const handleSubmitCategoria = async (e) => {
    e.preventDefault();
    if (!formCategoria.nombre.trim()) {
      alert("El nombre de la categoría es requerido");
      return;
    }

    try {
      setLoading(true);
      if (editingCategoria) {
        await updateCategoria(editingCategoria.id, formCategoria);
      } else {
        await addCategoria(formCategoria);
      }
      resetFormCategoria();
      await cargarDatos();
      alert(editingCategoria ? "Categoría actualizada" : "Categoría agregada");
    } catch (error) {
      console.error("Error al guardar categoría:", error);
      alert("Error al guardar categoría: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditCategoria = (categoria) => {
    setEditingCategoria(categoria);
    setFormCategoria({
      nombre: categoria.nombre || "",
      descripcion: categoria.descripcion || "",
      imagen: categoria.imagen || ""
    });
  };

  const handleDeleteCategoria = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar esta categoría?")) return;
    try {
      setLoading(true);
      await deleteCategoria(id);
      await cargarDatos();
      alert("Categoría eliminada");
    } catch (error) {
      console.error("Error al eliminar categoría:", error);
      alert("Error al eliminar categoría: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetFormCategoria = () => {
    setFormCategoria({ nombre: "", descripcion: "", imagen: "" });
    setEditingCategoria(null);
  };

  // Productos
  const handleSubmitProducto = async (e) => {
    e.preventDefault();
    if (!formProducto.nombre.trim() || !formProducto.precio || !formProducto.categoriaId) {
      alert("Nombre, precio y categoría son requeridos");
      return;
    }

    try {
      setLoading(true);
      const productoData = {
        ...formProducto,
        precio: parseFloat(formProducto.precio)
      };
      if (editingProducto) {
        await updateProducto(editingProducto.id, productoData);
      } else {
        await addProducto(productoData);
      }
      resetFormProducto();
      await cargarDatos();
      alert(editingProducto ? "Producto actualizado" : "Producto agregado");
    } catch (error) {
      console.error("Error al guardar producto:", error);
      alert("Error al guardar producto: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditProducto = (producto) => {
    setEditingProducto(producto);
    setFormProducto({
      nombre: producto.nombre || "",
      descripcion: producto.descripcion || "",
      precio: producto.precio?.toString() || "",
      categoriaId: producto.categoriaId || "",
      imagen: producto.imagen || "",
      disponible: producto.disponible !== false
    });
  };

  const handleDeleteProducto = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este producto?")) return;
    try {
      setLoading(true);
      await deleteProducto(id);
      await cargarDatos();
      alert("Producto eliminado");
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      alert("Error al eliminar producto: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetFormProducto = () => {
    setFormProducto({
      nombre: "",
      descripcion: "",
      precio: "",
      categoriaId: "",
      imagen: "",
      disponible: true
    });
    setEditingProducto(null);
  };

  // Temporada
  const handleCambiarTemporada = async (temporada) => {
    try {
      setLoading(true);
      await updateTemporada(temporada);
      setTemporadaActual(temporada);
      alert(`Temporada cambiada a: ${temporada}`);
    } catch (error) {
      console.error("Error al cambiar temporada:", error);
      alert("Error al cambiar temporada: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Panel de Administración</h1>
        <p>Gestiona categorías, productos y precios</p>
      </div>

      <div className="admin-tabs">
        <button
          className={activeTab === "productos" ? "tab-btn active" : "tab-btn"}
          onClick={() => setActiveTab("productos")}
        >
          Productos
        </button>
        <button
          className={activeTab === "categorias" ? "tab-btn active" : "tab-btn"}
          onClick={() => setActiveTab("categorias")}
        >
          Categorías
        </button>
        <button
          className={activeTab === "temporada" ? "tab-btn active" : "tab-btn"}
          onClick={() => setActiveTab("temporada")}
        >
          Temporada del Menú
        </button>
      </div>

      {loading && !uploadingImage && (
        <div className="loading-overlay">
          <div className="loading-spinner">Cargando...</div>
        </div>
      )}

      {activeTab === "categorias" && (
        <div className="admin-section">
          <div className="admin-form-container">
            <h2>{editingCategoria ? "Editar Categoría" : "Nueva Categoría"}</h2>
            <form onSubmit={handleSubmitCategoria} className="admin-form">
              <div className="form-group">
                <label>Nombre *</label>
                <input
                  type="text"
                  value={formCategoria.nombre}
                  onChange={(e) => setFormCategoria({ ...formCategoria, nombre: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Descripción</label>
                <textarea
                  value={formCategoria.descripcion}
                  onChange={(e) => setFormCategoria({ ...formCategoria, descripcion: e.target.value })}
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label>Imagen (URL)</label>
                <input
                  type="url"
                  value={formCategoria.imagen}
                  onChange={(e) => setFormCategoria({ ...formCategoria, imagen: e.target.value })}
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              </div>
              <div className="form-group">
                <label>O subir archivo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageFileChange(e, "categoria")}
                  disabled={uploadingImage}
                />
                {uploadingImage && <p className="uploading">Subiendo imagen...</p>}
              </div>
              {formCategoria.imagen && (
                <div className="image-preview">
                  <img src={formCategoria.imagen} alt="Preview" />
                </div>
              )}
              <div className="form-actions">
                <button type="submit" disabled={loading || uploadingImage}>
                  {editingCategoria ? "Actualizar" : "Agregar"} Categoría
                </button>
                {editingCategoria && (
                  <button type="button" onClick={resetFormCategoria}>
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="admin-list">
            <h2>Categorías Existentes</h2>
            {categorias.length === 0 ? (
              <p className="empty-state">No hay categorías registradas</p>
            ) : (
              <div className="items-grid">
                {categorias.map(categoria => (
                  <div key={categoria.id} className="item-card">
                    {categoria.imagen && (
                      <div className="item-image">
                        <img src={categoria.imagen} alt={categoria.nombre} />
                      </div>
                    )}
                    <div className="item-info">
                      <h3>{categoria.nombre}</h3>
                      {categoria.descripcion && <p>{categoria.descripcion}</p>}
                    </div>
                    <div className="item-actions">
                      <button onClick={() => handleEditCategoria(categoria)}>Editar</button>
                      <button onClick={() => handleDeleteCategoria(categoria.id)} className="delete-btn">
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "productos" && (
        <div className="admin-section">
          <div className="admin-form-container">
            <h2>{editingProducto ? "Editar Producto" : "Nuevo Producto"}</h2>
            <form onSubmit={handleSubmitProducto} className="admin-form">
              <div className="form-group">
                <label>Nombre *</label>
                <input
                  type="text"
                  value={formProducto.nombre}
                  onChange={(e) => setFormProducto({ ...formProducto, nombre: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Descripción</label>
                <textarea
                  value={formProducto.descripcion}
                  onChange={(e) => setFormProducto({ ...formProducto, descripcion: e.target.value })}
                  rows="3"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Precio *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formProducto.precio}
                    onChange={(e) => setFormProducto({ ...formProducto, precio: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Categoría *</label>
                  <select
                    value={formProducto.categoriaId}
                    onChange={(e) => setFormProducto({ ...formProducto, categoriaId: e.target.value })}
                    required
                  >
                    <option value="">Seleccionar categoría</option>
                    {categorias.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={formProducto.disponible}
                    onChange={(e) => setFormProducto({ ...formProducto, disponible: e.target.checked })}
                  />
                  Disponible
                </label>
              </div>
              <div className="form-group">
                <label>Imagen (URL)</label>
                <input
                  type="url"
                  value={formProducto.imagen}
                  onChange={(e) => setFormProducto({ ...formProducto, imagen: e.target.value })}
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              </div>
              <div className="form-group">
                <label>O subir archivo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageFileChange(e, "producto")}
                  disabled={uploadingImage}
                />
                {uploadingImage && <p className="uploading">Subiendo imagen...</p>}
              </div>
              {formProducto.imagen && (
                <div className="image-preview">
                  <img src={formProducto.imagen} alt="Preview" />
                </div>
              )}
              <div className="form-actions">
                <button type="submit" disabled={loading || uploadingImage}>
                  {editingProducto ? "Actualizar" : "Agregar"} Producto
                </button>
                {editingProducto && (
                  <button type="button" onClick={resetFormProducto}>
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="admin-list">
            <h2>Productos Existentes</h2>
            {productos.length === 0 ? (
              <p className="empty-state">No hay productos registrados</p>
            ) : (
              <div className="items-grid">
                {productos.map(producto => {
                  const categoria = categorias.find(c => c.id === producto.categoriaId);
                  return (
                    <div key={producto.id} className="item-card">
                      {producto.imagen && (
                        <div className="item-image">
                          <img src={producto.imagen} alt={producto.nombre} />
                        </div>
                      )}
                      <div className="item-info">
                        <h3>{producto.nombre}</h3>
                        {producto.descripcion && <p>{producto.descripcion}</p>}
                        <div className="item-details">
                          <span className="price">${producto.precio?.toFixed(2) || "0.00"}</span>
                          <span className="category">{categoria?.nombre || "Sin categoría"}</span>
                          <span className={producto.disponible ? "status available" : "status unavailable"}>
                            {producto.disponible ? "Disponible" : "No disponible"}
                          </span>
                        </div>
                      </div>
                      <div className="item-actions">
                        <button onClick={() => handleEditProducto(producto)}>Editar</button>
                        <button onClick={() => handleDeleteProducto(producto.id)} className="delete-btn">
                          Eliminar
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "temporada" && (
        <div className="admin-section">
          <div className="admin-form-container">
            <h2>Configuración de Temporada del Menú</h2>
            <p style={{ color: "rgba(255, 255, 255, 0.7)", marginBottom: "2rem" }}>
              Selecciona una temporada para aplicar efectos especiales en el menú.
            </p>
            
            <div className="temporadas-grid">
              <div 
                className={`temporada-card ${temporadaActual === "invierno" ? "active" : ""}`}
                onClick={() => handleCambiarTemporada("invierno")}
              >
                <div className="temporada-icon">❄️</div>
                <h3>Invierno</h3>
                <p>Luces navideñas y efecto de nieve</p>
                {temporadaActual === "invierno" && (
                  <span className="temporada-active-badge">Activa</span>
                )}
              </div>

              <div 
                className={`temporada-card ${temporadaActual === "primavera" ? "active" : ""}`}
                onClick={() => handleCambiarTemporada("primavera")}
              >
                <div className="temporada-icon">🌸</div>
                <h3>Primavera</h3>
                <p>Flores y pétalos cayendo</p>
                {temporadaActual === "primavera" && (
                  <span className="temporada-active-badge">Activa</span>
                )}
              </div>

              <div 
                className={`temporada-card ${temporadaActual === "verano" ? "active" : ""}`}
                onClick={() => handleCambiarTemporada("verano")}
              >
                <div className="temporada-icon">☀️</div>
                <h3>Verano</h3>
                <p>Efectos de sol brillante</p>
                {temporadaActual === "verano" && (
                  <span className="temporada-active-badge">Activa</span>
                )}
              </div>

              <div 
                className={`temporada-card ${temporadaActual === "otono" ? "active" : ""}`}
                onClick={() => handleCambiarTemporada("otono")}
              >
                <div className="temporada-icon">🍂</div>
                <h3>Otoño</h3>
                <p>Hojas de otoño cayendo</p>
                {temporadaActual === "otono" && (
                  <span className="temporada-active-badge">Activa</span>
                )}
              </div>
            </div>

            <div style={{ marginTop: "2rem" }}>
              <button
                type="button"
                onClick={() => handleCambiarTemporada(null)}
                className="reset-temporada-btn"
              >
                Quitar Temporada
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;


