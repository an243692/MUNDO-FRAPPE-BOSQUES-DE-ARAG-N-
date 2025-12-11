import React, { useState, useEffect, useMemo, useRef } from "react";
import { 
  getCategorias, 
  getProductos, 
  getTemporada,
  getSecciones,
  subscribeToCategorias,
  subscribeToProductos,
  subscribeToTemporada,
  subscribeToSecciones
} from "../services/database";
import {
  SnowEffect,
  AutumnLeavesEffect,
  SpringFlowersEffect
} from "../components/SeasonalEffects";
import { useFilter } from "../context/FilterContext";
import SEO from "../components/SEO";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Menu.css";
import logoImage from "./mundo frappe.png";

// Componente helper para imágenes con logo
const ImageWithLogo = ({ src, alt, className = "", loading = "lazy", decoding = "async", onError, wrapperClassName = "" }) => (
  <div className={`image-with-logo-wrapper ${wrapperClassName}`}>
    <img 
      src={src} 
      alt={alt}
      className={className}
      loading={loading}
      decoding={decoding}
      onError={onError}
    />
    <div className="image-logo-overlay">
      <img src={logoImage} alt="MF" className="image-logo-overlay-img" loading="lazy" decoding="async" />
    </div>
  </div>
);

const Menu = () => {
  const {
    seccionFiltro,
    setSeccionFiltro,
    categoriaFiltro,
    setCategoriaFiltro,
    categoriaSeleccionada,
    setCategoriaSeleccionada,
    setSecciones: setSeccionesContext,
    setCategorias: setCategoriasContext,
    setProductos: setProductosContext,
    filtrosAbierto,
    setFiltrosAbierto,
    modoPantalla,
    setModoPantalla
  } = useFilter();
  
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [secciones, setSecciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [temporada, setTemporada] = useState(null);
  const [seccionActivaPantalla, setSeccionActivaPantalla] = useState(0);
  const [categoriasActivasPantalla, setCategoriasActivasPantalla] = useState(0);
  const [categoriaActivaPantalla, setCategoriaActivaPantalla] = useState(0);

  useEffect(() => {
    // Cargar datos iniciales
    const cargarDatosIniciales = async () => {
      try {
        setLoading(true);
        const [categoriasData, productosData, temporadaData, seccionesData] = await Promise.all([
          getCategorias(),
          getProductos(),
          getTemporada(),
          getSecciones()
        ]);
        setCategorias(categoriasData);
        setProductos(productosData);
        setTemporada(temporadaData);
        setSecciones(seccionesData);
        // Actualizar contexto para Navbar
        setSeccionesContext(seccionesData);
        setCategoriasContext(categoriasData);
        setProductosContext(productosData);
      } catch (error) {
        console.error("Error al cargar datos iniciales:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatosIniciales();

    // Configurar listeners en tiempo real para actualizaciones automáticas
    const unsubscribeCategorias = subscribeToCategorias((categoriasData) => {
      setCategorias(categoriasData);
      setCategoriasContext(categoriasData);
      setLoading(false); // Asegurar que no quede en loading después de la primera carga
    });

    const unsubscribeProductos = subscribeToProductos((productosData) => {
      setProductos(productosData);
      setProductosContext(productosData);
      setLoading(false);
    });

    const unsubscribeTemporada = subscribeToTemporada((temporadaData) => {
      setTemporada(temporadaData);
    });

    const unsubscribeSecciones = subscribeToSecciones((seccionesData) => {
      setSecciones(seccionesData);
      setSeccionesContext(seccionesData);
    });

    // Cleanup: desuscribirse cuando el componente se desmonte
    return () => {
      unsubscribeCategorias();
      unsubscribeProductos();
      unsubscribeTemporada();
      unsubscribeSecciones();
    };
  }, []);

  const productosPorCategoria = useMemo(() => {
    const agrupados = {};
    categorias.forEach(cat => {
      const productosCat = productos.filter(
        p => p.categoriaId === cat.id && p.disponible !== false
      );
      if (productosCat.length > 0) {
        agrupados[cat.id] = {
          categoria: cat,
          productos: productosCat
        };
      }
    });
    return agrupados;
  }, [categorias, productos]);

  // Agrupar categorías por sección
  const categoriasPorSeccion = useMemo(() => {
    const agrupadas = {};
    
    // Ordenar secciones por orden
    const seccionesOrdenadas = [...secciones].sort((a, b) => {
      const ordenA = a.orden || 0;
      const ordenB = b.orden || 0;
      return ordenA - ordenB;
    });
    
    // Crear grupo para categorías sin sección
    agrupadas.sinSeccion = {
      seccion: null,
      categorias: []
    };
    
    // Agrupar categorías por sección
    categorias.forEach(cat => {
      const productosCat = productos.filter(
        p => p.categoriaId === cat.id && p.disponible !== false
      );
      
      // Solo incluir categorías que tengan productos
      if (productosCat.length === 0) return;
      
      const seccionId = cat.seccionId || 'sinSeccion';
      
      if (!agrupadas[seccionId]) {
        const seccion = secciones.find(s => s.id === cat.seccionId);
        agrupadas[seccionId] = {
          seccion: seccion || null,
          categorias: []
        };
      }
      
      agrupadas[seccionId].categorias.push(cat);
    });
    
    return agrupadas;
  }, [categorias, productos, secciones]);

  // Refs para mantener el estado actual sin causar recreaciones del intervalo
  const seccionActivaRef = useRef(seccionActivaPantalla);
  const categoriasActivasRef = useRef(categoriasActivasPantalla);
  
  // Actualizar refs cuando cambian los estados
  useEffect(() => {
    seccionActivaRef.current = seccionActivaPantalla;
  }, [seccionActivaPantalla]);
  
  useEffect(() => {
    categoriasActivasRef.current = categoriasActivasPantalla;
  }, [categoriasActivasPantalla]);
  
  // Reset categorías activas cuando cambia la sección
  useEffect(() => {
    if (!modoPantalla) return;
    setCategoriasActivasPantalla(0);
    categoriasActivasRef.current = 0;
  }, [seccionActivaPantalla, modoPantalla]);
  
  // Rotación automática de categorías y secciones en modo pantalla
  useEffect(() => {
    if (!modoPantalla) return;
    
    const interval = setInterval(() => {
      const seccionesOrdenadas = Object.entries(categoriasPorSeccion)
        .filter(([key]) => key !== 'sinSeccion')
        .sort(([keyA], [keyB]) => {
          const seccionA = categoriasPorSeccion[keyA]?.seccion;
          const seccionB = categoriasPorSeccion[keyB]?.seccion;
          const ordenA = seccionA?.orden || 0;
          const ordenB = seccionB?.orden || 0;
          return ordenA - ordenB;
        });
      
      if (seccionesOrdenadas.length === 0) return;
      
      const seccionActual = seccionActivaRef.current;
      const categoriasActuales = categoriasActivasRef.current;
      
      const [seccionKey, seccionData] = seccionesOrdenadas[seccionActual % seccionesOrdenadas.length];
      const categoriasConProductos = seccionData.categorias.filter(cat => {
        const productosCat = productos.filter(p => p.categoriaId === cat.id && p.disponible !== false);
        return productosCat.length > 0;
      });
      
      const categoriasPorGrupo = 3; // Mostrar 3 categorías a la vez
      const totalGrupos = Math.max(1, Math.ceil(categoriasConProductos.length / categoriasPorGrupo));
      
      const siguienteGrupo = (categoriasActuales + 1) % totalGrupos;
      
      // Si ya se mostraron todos los grupos de categorías, cambiar de sección
      if (siguienteGrupo === 0) {
        const siguienteSeccion = (seccionActual + 1) % seccionesOrdenadas.length;
        setSeccionActivaPantalla(siguienteSeccion);
        setCategoriasActivasPantalla(0);
      } else {
        setCategoriasActivasPantalla(siguienteGrupo);
      }
    }, 10000); // 10 segundos
    
    return () => clearInterval(interval);
  }, [modoPantalla, categoriasPorSeccion, productos]);

  // Generar structured data dinámico para SEO
  const structuredData = useMemo(() => {
    const menuItems = productos
      .filter(p => p.disponible !== false)
      .slice(0, 20) // Limitar a 20 productos para evitar JSON muy grande
      .map(producto => {
        const categoria = categorias.find(cat => cat.id === producto.categoriaId);
        const precioChico = producto.precioChico || (producto.precio && !producto.precioGrande ? producto.precio : null);
        const precioGrande = producto.precioGrande;
        
        return {
          "@type": "MenuItem",
          "name": producto.nombre,
          "description": producto.descripcion || `${producto.nombre} de Mundo Frappe`,
          "image": producto.imagen || undefined,
          "menuAddOn": categoria ? {
            "@type": "MenuSection",
            "name": categoria.nombre
          } : undefined,
          "offers": {
            "@type": "Offer",
            "price": precioChico || precioGrande || producto.precio || "0",
            "priceCurrency": "MXN"
          }
        };
      });

    const menuSections = categorias
      .filter(cat => {
        const productosCat = productos.filter(p => p.categoriaId === cat.id && p.disponible !== false);
        return productosCat.length > 0;
      })
      .map(categoria => ({
        "@type": "MenuSection",
        "name": categoria.nombre,
        "description": categoria.descripcion || undefined,
        "image": categoria.imagen || undefined,
        "hasMenuItem": productos
          .filter(p => p.categoriaId === categoria.id && p.disponible !== false)
          .slice(0, 5)
          .map(p => ({
            "@type": "MenuItem",
            "name": p.nombre
          }))
      }));

    return {
      "@context": "https://schema.org",
      "@type": "Restaurant",
      "name": "Mundo Frappe",
      "description": "Cafetería especializada en frappes, cafés y bebidas deliciosas. Descubre nuestro menú completo con una gran variedad de sabores únicos.",
      "url": "https://mundofrappe.com",
      "servesCuisine": "Bebidas",
      "priceRange": "$$",
      "hasMenu": {
        "@type": "Menu",
        "name": "Menú Mundo Frappe",
        "description": "Menú completo de frappes, cafés y bebidas",
        "hasMenuSection": menuSections,
        "hasMenuItem": menuItems
      }
    };
  }, [categorias, productos]);

  // Generar keywords dinámicas basadas en categorías
  const dynamicKeywords = useMemo(() => {
    const categoriaNombres = categorias
      .filter(cat => {
        const productosCat = productos.filter(p => p.categoriaId === cat.id && p.disponible !== false);
        return productosCat.length > 0;
      })
      .map(cat => cat.nombre.toLowerCase())
      .join(", ");
    
    return `frappe, café, bebidas, menú, mundo frappe, ${categoriaNombres}, cafetería, bebidas frías, bebidas calientes`;
  }, [categorias, productos]);

  // Generar descripción dinámica
  const dynamicDescription = useMemo(() => {
    const totalProductos = productos.filter(p => p.disponible !== false).length;
    const totalCategorias = categorias.filter(cat => {
      const productosCat = productos.filter(p => p.categoriaId === cat.id && p.disponible !== false);
      return productosCat.length > 0;
    }).length;
    
    return `Descubre nuestro delicioso menú de frappes, cafés, bebidas frías y calientes. Mundo Frappe ofrece más de ${totalProductos} productos en ${totalCategorias} categorías con una gran variedad de sabores únicos para todos los gustos.`;
  }, [categorias, productos]);

  if (loading) {
    return (
      <div className="menu-container">
        <div className="loading-wrapper">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="loading-text">Cargando menú...</p>
        </div>
      </div>
    );
  }

  // Renderizar efectos estacionales
  const renderSeasonalEffects = () => {
    if (!temporada) return null;
    
    switch (temporada) {
      case "invierno":
        return <SnowEffect />;
      case "otono":
        return <AutumnLeavesEffect />;
      case "primavera":
        return <SpringFlowersEffect />;
      default:
        return null;
    }
  };

  // Renderizar vista estilo Starbucks para modo pantalla
  const renderVistaPantalla = () => {
    const seccionesOrdenadas = Object.entries(categoriasPorSeccion)
      .filter(([key]) => key !== 'sinSeccion')
      .sort(([keyA], [keyB]) => {
        const seccionA = categoriasPorSeccion[keyA]?.seccion;
        const seccionB = categoriasPorSeccion[keyB]?.seccion;
        const ordenA = seccionA?.orden || 0;
        const ordenB = seccionB?.orden || 0;
        return ordenA - ordenB;
      });
    
    if (seccionesOrdenadas.length === 0) return null;
    
    const [seccionKey, seccionData] = seccionesOrdenadas[seccionActivaPantalla % seccionesOrdenadas.length];
    const { seccion, categorias: categoriasSeccion } = seccionData;
    
    // Filtrar categorías que tienen productos
    const categoriasConProductos = categoriasSeccion.filter(cat => {
      const productosCat = productos.filter(p => p.categoriaId === cat.id && p.disponible !== false);
      return productosCat.length > 0;
    });
    
    // Mostrar solo 3 categorías a la vez, rotar según categoriasActivasPantalla
    const categoriasPorGrupo = 3;
    const inicioIndex = categoriasActivasPantalla * categoriasPorGrupo;
    const categoriasAMostrar = categoriasConProductos.slice(inicioIndex, inicioIndex + categoriasPorGrupo);
    
    // Función helper para obtener precio único
    const obtenerPrecio = (producto) => {
      const precioChico = producto.precioChico || (producto.precio && !producto.precioGrande ? producto.precio : null);
      const precioGrande = producto.precioGrande;
      if (precioChico && precioGrande) return null; // Si tiene ambos, no es precio único
      return precioChico || precioGrande || producto.precio;
    };
    
    return (
      <div className="vista-pantalla-container">
        {/* Header con nombre de sección */}
        <div className="vista-pantalla-header">
          <h1 className="vista-pantalla-titulo">{seccion?.nombre || 'Menú'}</h1>
        </div>
        
        {/* Contenido principal */}
        <div className="vista-pantalla-content">
          {/* Grid de categorías y productos (3 por fila) */}
          <div className="vista-pantalla-grid">
            {categoriasAMostrar.map((categoria) => {
              const productosCategoria = productos.filter(
                p => p.categoriaId === categoria.id && p.disponible !== false
              );
              
              if (productosCategoria.length === 0) return null;
              
              // Verificar si se debe usar layout de doble columna
              const masDeOchoProductos = productosCategoria.length > 8;
              const precios = productosCategoria.map(obtenerPrecio);
              const todosMismoPrecio = precios.every(precio => precio !== null && precio === precios[0]);
              const precioUnico = todosMismoPrecio && precios[0] !== null ? precios[0] : null;
              const mostrarLayoutDosColumnas = masDeOchoProductos && todosMismoPrecio && precioUnico !== null;
              
              return (
                <div key={categoria.id} className="vista-pantalla-categoria">
                  {/* Nombre de categoría */}
                  <div className="vista-pantalla-categoria-header">
                    <div className="vista-pantalla-categoria-nombre">
                      <h2>{categoria.nombre}</h2>
                    </div>
                  </div>
                  
                  {/* Lista de productos */}
                  {mostrarLayoutDosColumnas ? (
                    /* Layout de doble columna con precio centralizado */
                    <div className="vista-pantalla-productos-dos-columnas">
                      {/* Columna derecha - Primera mitad */}
                      <div className="vista-pantalla-columna vista-pantalla-columna-derecha">
                        {productosCategoria.slice(0, Math.ceil(productosCategoria.length / 2)).map((producto) => (
                          <div key={producto.id} className="vista-pantalla-producto-columna">
                            <div className="vista-pantalla-producto-nombre-columna">
                              {producto.nombre}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Precio centralizado */}
                      <div className="vista-pantalla-precio-central">
                        <div className="vista-pantalla-precio-circle">
                          <span className="vista-pantalla-precio-amount">${precioUnico.toFixed(0)}</span>
                        </div>
                      </div>
                      
                      {/* Columna izquierda - Segunda mitad */}
                      <div className="vista-pantalla-columna vista-pantalla-columna-izquierda">
                        {productosCategoria.slice(Math.ceil(productosCategoria.length / 2)).map((producto) => (
                          <div key={producto.id} className="vista-pantalla-producto-columna">
                            <div className="vista-pantalla-producto-nombre-columna">
                              {producto.nombre}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    /* Layout de lista normal */
                    <div className="vista-pantalla-productos">
                      {productosCategoria.map((producto) => (
                        <div key={producto.id} className="vista-pantalla-producto">
                          <div className="vista-pantalla-producto-nombre">
                            {producto.nombre}
                          </div>
                          <div className="vista-pantalla-producto-precio">
                            {(() => {
                              const precioChico = producto.precioChico || (producto.precio && !producto.precioGrande ? producto.precio : null);
                              const precioGrande = producto.precioGrande;
                              
                              if (precioChico && precioGrande) {
                                return (
                                  <>
                                    <span>Ch ${precioChico.toFixed(0)}</span>
                                    <span>Gr ${precioGrande.toFixed(0)}</span>
                                  </>
                                );
                              } else if (precioChico) {
                                return <span>${precioChico.toFixed(0)}</span>;
                              } else if (precioGrande) {
                                return <span>${precioGrande.toFixed(0)}</span>;
                              } else {
                                return <span>${producto.precio?.toFixed(0) || "0"}</span>;
                              }
                            })()}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <SEO
        title={categoriaSeleccionada 
          ? `${categorias.find(c => c.id === categoriaSeleccionada)?.nombre || 'Categoría'} - Mundo Frappe`
          : "Mundo Frappe - Menú Digital de Bebidas y Cafés"
        }
        description={dynamicDescription}
        keywords={dynamicKeywords}
        structuredData={structuredData}
      />
      <div className={`menu-container ${temporada ? `season-${temporada}` : ""} ${modoPantalla ? 'modo-pantalla' : ''} ${filtrosAbierto ? 'sidebar-open' : ''}`}>
        {renderSeasonalEffects()}
      
      {/* Vista estilo Starbucks para modo pantalla */}
      {modoPantalla ? (
        renderVistaPantalla()
      ) : (
        <>
      {/* Hero Section con Collage */}
      {!categoriaSeleccionada && (
        <div className="hero-section">
          <div className="hero-collage">
            {/* Grid 2x2 para móvil - 4 imágenes cuadradas */}
            <div className="collage-item-mobile-grid collage-item-mobile-1">
              <img 
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsesuFlBZgiNQLF9KAhn1s9A-NKhZ41Sif8Q&s" 
                alt="Café"
                loading="eager"
                fetchPriority="high"
                decoding="async"
                width="180"
                height="180"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.style.background = 'rgba(8, 87, 107, 0.3)';
                }}
              />
            </div>
            <div className="collage-item-mobile-grid collage-item-mobile-2">
              <img 
                src="https://lh3.googleusercontent.com/gps-cs-s/AG0ilSyC6W4V3XRiAl4WyU2M-MnB2cV9xIEwSWPBTbk29_wzh-txD0SQqmg5wgtii7BQpPQkJHoXcIVAmm4s2P-0RRhfyU9Z6B38w-wjqdCvRAY2OIEjt99oPpZu8bhku1wcwLlRfYjGjA=s680-w680-h510-rw" 
                alt="Bebida"
                loading="eager"
                fetchPriority="high"
                decoding="async"
                width="180"
                height="180"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.style.background = 'rgba(8, 87, 107, 0.3)';
                }}
              />
            </div>
            <div className="collage-item-mobile-grid collage-item-mobile-3">
              <img 
                src="https://lh3.googleusercontent.com/gps-cs-s/AG0ilSxxmVttkQR1WFuAAReB-bnKmztF_v74UOTmqPx1dmkp5Oi5ch_WoJcMIixzFifxKpc6PvDnNek5TeI4GZvD3nKN4Fhzi864Dl299QXcVUvHSm4jtmTY2fxaDykGuCqno-GQizjv=s680-w680-h510-rw" 
                alt="Capuchino"
                loading="eager"
                fetchPriority="high"
                decoding="async"
                width="180"
                height="180"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.style.background = 'rgba(8, 87, 107, 0.3)';
                }}
              />
            </div>
            <div className="collage-item-mobile-grid collage-item-mobile-4">
              <img 
                src="https://lh3.googleusercontent.com/gps-cs-s/AG0ilSxxEVreotoxUBSyWj9WWUwXygCmn4oOrXUUy8yB0v90ynMrKv6i8na-FDwaEFksWeV3QSuacsOoEVXGYFsVCeZmzUIM_-Tvaq1vBTBg_bIrFi01TFLGbvpaRzNUKRm6XkmJ5wNILw=s680-w680-h510-rw" 
                alt="Bebida especial"
                loading="eager"
                fetchPriority="high"
                decoding="async"
                width="180"
                height="180"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.style.background = 'rgba(8, 87, 107, 0.3)';
                }}
              />
            </div>

            {/* Logo Central */}
            <div className="hero-logo-container">
              <img 
                src={logoImage} 
                alt="Mundo Frappe Logo" 
                className="hero-logo"
                loading="eager"
                fetchPriority="high"
                width="160"
                height="160"
              />
            </div>

            {/* Filas originales - Solo visibles en desktop */}
            <div className="collage-row">
              <div className="collage-item collage-small">
                <img 
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsesuFlBZgiNQLF9KAhn1s9A-NKhZ41Sif8Q&s" 
                  alt="Café"
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  width="180"
                  height="180"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.style.background = 'rgba(8, 87, 107, 0.3)';
                  }}
                />
              </div>
              <div className="collage-item collage-medium">
                <img 
                  src="https://lh3.googleusercontent.com/gps-cs-s/AG0ilSyC6W4V3XRiAl4WyU2M-MnB2cV9xIEwSWPBTbk29_wzh-txD0SQqmg5wgtii7BQpPQkJHoXcIVAmm4s2P-0RRhfyU9Z6B38w-wjqdCvRAY2OIEjt99oPpZu8bhku1wcwLlRfYjGjA=s680-w680-h510-rw" 
                  alt="Bebida"
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  width="240"
                  height="180"
                  style={{ aspectRatio: '4 / 3' }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.style.background = 'rgba(8, 87, 107, 0.3)';
                  }}
                />
              </div>
              <div className="collage-item collage-small collage-item-lazy">
                <img 
                  src="https://lh3.googleusercontent.com/gps-cs-s/AG0ilSzAwHg7DGvtX_wjB3JC5PNPsGYaYfU9f6HUIB_XVOQpDQgnWOmHEOZUWZNOZ8FcyK6tEycFdypXzPUpHUHMHS49FYoZ5L0D1ypcDUTLZgIdOufZx9nbCpNNGBmIKEsv8OjKCnpMEQ=s680-w680-h510-rw" 
                  alt="Frappe"
                  loading="lazy"
                  decoding="async"
                  width="180"
                  height="180"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.style.background = 'rgba(8, 87, 107, 0.3)';
                  }}
                />
              </div>
            </div>

            {/* Fila Inferior */}
            <div className="collage-row collage-row-bottom">
              <div className="collage-item collage-medium collage-item-lazy">
                <img 
                  src="https://lh3.googleusercontent.com/gps-cs-s/AG0ilSxxmVttkQR1WFuAAReB-bnKmztF_v74UOTmqPx1dmkp5Oi5ch_WoJcMIixzFifxKpc6PvDnNek5TeI4GZvD3nKN4Fhzi864Dl299QXcVUvHSm4jtmTY2fxaDykGuCqno-GQizjv=s680-w680-h510-rw" 
                  alt="Capuchino"
                  loading="lazy"
                  decoding="async"
                  width="240"
                  height="180"
                  style={{ aspectRatio: '4 / 3' }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.style.background = 'rgba(8, 87, 107, 0.3)';
                  }}
                />
              </div>
              <div className="collage-item collage-small collage-item-lazy">
                <img 
                  src="https://lh3.googleusercontent.com/gps-cs-s/AG0ilSxxEVreotoxUBSyWj9WWUwXygCmn4oOrXUUy8yB0v90ynMrKv6i8na-FDwaEFksWeV3QSuacsOoEVXGYFsVCeZmzUIM_-Tvaq1vBTBg_bIrFi01TFLGbvpaRzNUKRm6XkmJ5wNILw=s680-w680-h510-rw" 
                  alt="Bebida especial"
                  loading="lazy"
                  decoding="async"
                  width="180"
                  height="180"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.style.background = 'rgba(8, 87, 107, 0.3)';
                  }}
                />
              </div>
              <div className="collage-item collage-medium collage-item-lazy">
                <img 
                  src="https://lh3.googleusercontent.com/gps-cs-s/AG0ilSyzhFfZf8gWBQA7Fqiu-0vOvS9rQowZEBYVt6iYmUvmGwYq2kmuGxZnJ91JJoPy-2ZFwJL91EJMzerCf6loGEBELF_PF7PqsWgIKmYaCJH_AjoDmmkd7ZKZC6gTwqXYs-EotqML=s680-w680-h510-rw" 
                  alt="Café especial"
                  loading="lazy"
                  decoding="async"
                  width="240"
                  height="180"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.style.background = 'rgba(8, 87, 107, 0.3)';
                  }}
                />
              </div>
              <div className="collage-item collage-small collage-item-lazy">
                <img 
                  src="https://lh3.googleusercontent.com/gps-cs-s/AG0ilSwv-4PdOPs3ihCVVXH5dUb0qnB-6m7xAaLs5sgEGPKS3EbvZ04wlke9sVKcQnFle1IVCRD9rrg8oSnUjgZIBW6sCIEqByvvgZxtoXDTdp51P8EHl4Hy7eH_RBCCaFq4x3wKRII=s680-w680-h510-rw" 
                  alt="Malteada"
                  loading="lazy"
                  decoding="async"
                  width="180"
                  height="180"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.style.background = 'rgba(8, 87, 107, 0.3)';
                  }}
                />
              </div>
            </div>
          </div>

          <div className="hero-text">
            <h1 className="hero-title">NUESTRO MENÚ</h1>
            <p className="hero-subtitle">Descubre nuestras deliciosas opciones</p>
          </div>
        </div>
      )}

      {/* Location */}
      <div className="location-bar">
        <span className="location-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
        </span>
        <span className="location-text">Boulevard de las Naciones #39, Local A, Col. Bosques de Aragón</span>
      </div>


      {/* Categorías agrupadas por Secciones */}
      {!categoriaSeleccionada && (
        <div className="categories-section">
          {(() => {
            // Ordenar secciones: primero las que tienen sección asignada (por orden), luego sin sección
            const seccionesConOrden = Object.entries(categoriasPorSeccion)
              .filter(([key, grupo]) => {
                if (key === 'sinSeccion') return grupo.categorias.length > 0;
                return grupo.categorias.length > 0;
              })
              .sort((a, b) => {
                const [keyA, grupoA] = a;
                const [keyB, grupoB] = b;
                
                // Sin sección siempre va al final
                if (keyA === 'sinSeccion') return 1;
                if (keyB === 'sinSeccion') return -1;
                
                // Ordenar por orden de sección
                const ordenA = grupoA.seccion?.orden || 0;
                const ordenB = grupoB.seccion?.orden || 0;
                return ordenA - ordenB;
              });
            
            return seccionesConOrden
              .filter(([seccionId]) => {
                // Filtrar por sección si hay un filtro activo
                if (seccionFiltro) {
                  return seccionId === seccionFiltro || (seccionId === 'sinSeccion' && !seccionFiltro);
                }
                return true;
              })
              .map(([seccionId, grupo]) => {
                // Aplicar filtro de categoría si está activo
                let categoriasFiltradas = grupo.categorias;
                if (categoriaFiltro) {
                  categoriasFiltradas = grupo.categorias.filter(cat => cat.id === categoriaFiltro);
                }
                
                if (categoriasFiltradas.length === 0) return null;
              
              return (
                <div key={seccionId} className="section-group">
                  {grupo.seccion && (
                    <h2 className="section-title">{grupo.seccion.nombre}</h2>
                  )}
                  
                  {/* Mostrar categorías como tarjetas (2 por fila) */}
                  <div className="categories-grid">
                    {categoriasFiltradas.map(categoria => {
                      const productosCategoria = productos.filter(
                        p => p.categoriaId === categoria.id && p.disponible !== false
                      );
                      if (productosCategoria.length === 0) return null;
                      
                      return (
                        <div
                          key={categoria.id}
                          className="category-card"
                          onClick={() => {
                            setCategoriaSeleccionada(categoria.id);
                            setTimeout(() => {
                              const menuSection = document.getElementById(`menu-section-${categoria.id}`);
                              if (menuSection) {
                                menuSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                              }
                            }, 100);
                          }}
                        >
                          <div className="category-image">
                            {categoria.imagen ? (
                              <div className="category-image-with-logo">
                                <img 
                                  key={`${categoria.id}-${categoria.imagen?.substring(0, 50)}`}
                                  src={categoria.imagen} 
                                  alt={categoria.nombre}
                                  loading="lazy"
                                  decoding="async"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.parentElement.innerHTML = '<div class="category-placeholder"><span class="category-icon">🍹</span></div>';
                                  }}
                                />
                                <div className="image-logo-overlay">
                                  <img src={logoImage} alt="MF" className="image-logo-overlay-img" loading="lazy" decoding="async" />
                                </div>
                              </div>
                            ) : (
                              <div className="category-placeholder">
                                <span className="category-icon">🍹</span>
                              </div>
                            )}
                          </div>
                          <h3 className="category-name">{categoria.nombre}</h3>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            });
          })()}
        </div>
      )}

      {/* Productos por categoría - Vista de Lista */}
      {categoriaSeleccionada && productosPorCategoria[categoriaSeleccionada] && (
        <div 
          id={`menu-section-${categoriaSeleccionada}`}
          className="menu-list-section"
        >
          <button 
            className="back-button"
            onClick={() => {
              setCategoriaSeleccionada(null);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            ← Volver a categorías
          </button>
          {(() => {
            const item = productosPorCategoria[categoriaSeleccionada];
            
            // Verificar condiciones para layout de dos columnas:
            // 1. Más de 8 productos
            // 2. Todos tienen el mismo precio
            // 3. No tienen precio chico y grande al mismo tiempo (solo un precio único)
            const obtenerPrecio = (producto) => {
              const precioChico = producto.precioChico || (producto.precio && !producto.precioGrande ? producto.precio : null);
              const precioGrande = producto.precioGrande;
              // Si tiene ambos precios (chico y grande), no es precio único
              if (precioChico && precioGrande) return null;
              // Retornar el precio único (chico, grande, o precio antiguo)
              return precioChico || precioGrande || producto.precio;
            };
            
            const masDeOchoProductos = item.productos.length > 8;
            const precios = item.productos.map(obtenerPrecio);
            const todosMismoPrecio = precios.every(precio => precio !== null && precio === precios[0]);
            const precioUnico = todosMismoPrecio && precios[0] !== null ? precios[0] : null;
            
            // Verificar si se debe mostrar el layout de dos columnas
            const mostrarLayoutDosColumnas = masDeOchoProductos && todosMismoPrecio && precioUnico !== null;
            
            return (
              <div className="category-menu-block">
                {/* Lista de Productos */}
                <div className="products-list-container">
                  <div className="category-header-menu">
                    <h2 className="category-title-menu">{item.categoria.nombre}</h2>
                  </div>
                  
                  {mostrarLayoutDosColumnas ? (
                    /* Layout de dos columnas verticales con precio centralizado */
                    <div className="products-columns-layout">
                      {/* Columna izquierda - Segunda mitad de productos */}
                      <div className="products-column products-column-left">
                        {item.productos.slice(Math.ceil(item.productos.length / 2)).map(producto => (
                          <div key={producto.id} className="product-item-column">
                            <h3 className="product-item-name-column">{producto.nombre}</h3>
                          </div>
                        ))}
                      </div>
                      
                      {/* Precio centralizado entre las dos columnas */}
                      <div className="price-circle-column-container">
                        <div className="price-circle">
                          <span className="price-circle-amount">${precioUnico.toFixed(0)}</span>
                        </div>
                      </div>
                      
                      {/* Columna derecha - Primera mitad de productos */}
                      <div className="products-column products-column-right">
                        {item.productos.slice(0, Math.ceil(item.productos.length / 2)).map(producto => (
                          <div key={producto.id} className="product-item-column">
                            <h3 className="product-item-name-column">{producto.nombre}</h3>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    /* Layout de lista normal */
                    <div className="products-list">
                      {item.productos.map(producto => (
                        <div key={producto.id} className="product-item-list">
                          <div className="product-item-header">
                            <h3 className="product-item-name">{producto.nombre}</h3>
                            <div className="product-item-price">
                              {(() => {
                                const precioChico = producto.precioChico || (producto.precio && !producto.precioGrande ? producto.precio : null);
                                const precioGrande = producto.precioGrande;
                                
                                if (precioChico && precioGrande) {
                                  return (
                                    <>
                                      <span className="price-size">Ch ${precioChico.toFixed(0)}</span>
                                      <span className="price-separator">|</span>
                                      <span className="price-size">Gr ${precioGrande.toFixed(0)}</span>
                                    </>
                                  );
                                } else if (precioChico) {
                                  return <span>${precioChico.toFixed(0)}</span>;
                                } else if (precioGrande) {
                                  return <span>${precioGrande.toFixed(0)}</span>;
                                } else {
                                  // Compatibilidad con precio antiguo
                                  return <span>${producto.precio?.toFixed(0) || "0"}</span>;
                                }
                              })()}
                            </div>
                          </div>
                          {producto.descripcion && (
                            <p className="product-item-description">{producto.descripcion}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Imagen de la Categoría */}
                <div className="category-image-display">
                  {item.categoria.imagen ? (
                    <div className="category-image-wrapper">
                      <img 
                        key={`display-${item.categoria.id}-${item.categoria.imagen?.substring(0, 50)}`}
                        src={item.categoria.imagen} 
                        alt={item.categoria.nombre}
                        className="category-display-img"
                        loading="lazy"
                        decoding="async"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                      <div className="category-image-overlay">
                        <div className="overlay-logo">
                          <img src={logoImage} alt="MF" className="overlay-logo-img" loading="lazy" decoding="async" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="category-image-placeholder">
                      <span className="placeholder-icon">🍹</span>
                      <p className="placeholder-text">{item.categoria.nombre}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Footer */}
      <footer className="menu-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Mundo Frappe</h4>
            <p>Así es como sabe un buen momento</p>
            <div className="footer-social">
              <a 
                href="https://www.facebook.com/mundofrappee/?locale=es_LA" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link facebook-link"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Síguenos en Facebook</span>
              </a>
            </div>
          </div>
          <div className="footer-section">
            <h4>Contacto</h4>
            <p>
              <svg className="footer-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              Boulevard de las Naciones #39
            </p>
            <p>Local A, Col. Bosques de Aragón</p>
            <p>
              <svg className="footer-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              Lunes a Domingo
            </p>
            <p>9:00 AM - 10:00 PM</p>
          </div>
          <div className="footer-section footer-map-section">
            <h4>Ubicación</h4>
            <div className="footer-map-wrapper">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!4v1764220944322!6m8!1m7!1sIushCxKMxdHe4nHfyPCxPA!2m2!1d19.46405362573273!2d-99.0544061126348!3f359.8998350882928!4f-7.788230848710953!5f0.7820865974627469" 
                width="100%" 
                height="300" 
                style={{border:0, borderRadius: '8px'}} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación Mundo Frappe"
              ></iframe>
              <a 
                href="https://www.google.com/maps/place/Boulevard+de+las+Naciones+39,+Bosques+de+Aragón,+Nezahualcóyotl,+Méx./@19.4640536,-99.0544061,17z/data=!3m1!4b1!4m6!3m5!1s0x85d1f9c8b8b8b8b9:0x8b8b8b8b8b8b8b8b!8m2!3d19.4640536!4d-99.0544061!16s%2Fg%2F11c0x8b8b8b" 
                target="_blank" 
                rel="noopener noreferrer"
                className="map-link"
              >
                Ver en Google Maps ↗
              </a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 Mundo Frappe. Todos los derechos reservados.</p>
          {/* Botón Diseño Pantalla - Solo visible en móviles */}
          <button 
            className="btn-diseno-pantalla"
            onClick={() => {
              const nuevoModoPantalla = !modoPantalla;
              setModoPantalla(nuevoModoPantalla);
              setSeccionActivaPantalla(0);
              setCategoriasActivasPantalla(0);
              // En modo pantalla, abrir el filtro automáticamente
              if (nuevoModoPantalla) {
                setFiltrosAbierto(true);
              }
            }}
          >
            {modoPantalla ? 'Salir de Diseño Pantalla' : 'Diseño Pantalla'}
          </button>
        </div>
      </footer>
        </>
      )}
      </div>
    </>
  );
};

export default Menu;