import React from "react";
import { useFilter } from "../context/FilterContext";
import "./FilterSidebar.css";

const FilterSidebar = () => {
  const {
    filtrosAbierto,
    setFiltrosAbierto,
    seccionFiltro,
    setSeccionFiltro,
    categoriaFiltro,
    setCategoriaFiltro,
    setCategoriaSeleccionada,
    secciones,
    categorias,
    productos,
    modoPantalla
  } = useFilter();

  return (
    <>
      {/* Overlay para móvil */}
      {filtrosAbierto && !modoPantalla && (
        <div 
          className="filter-sidebar-overlay"
          onClick={() => setFiltrosAbierto(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`filter-sidebar ${filtrosAbierto ? 'open' : ''} ${modoPantalla ? 'modo-pantalla' : ''}`}>
        <div className="filter-sidebar-header">
          <h2 className="filter-sidebar-title">Filtros</h2>
          {!modoPantalla && (
            <button 
              className="filter-sidebar-close"
              onClick={() => setFiltrosAbierto(false)}
              aria-label="Cerrar filtros"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          )}
        </div>

        <div className="filter-sidebar-content">
          {/* Filtro de Sección */}
          <div className="filter-sidebar-section">
            <h3 className="filter-sidebar-section-title">Sección</h3>
            <div className="filter-sidebar-options">
              <button
                className={`filter-sidebar-option ${!seccionFiltro ? 'active' : ''}`}
                onClick={() => {
                  setSeccionFiltro(null);
                  setCategoriaFiltro(null);
                }}
              >
                Todas
              </button>
              {secciones
                .sort((a, b) => (a.orden || 0) - (b.orden || 0))
                .map(seccion => (
                  <button
                    key={seccion.id}
                    className={`filter-sidebar-option ${seccionFiltro === seccion.id ? 'active' : ''}`}
                    onClick={() => {
                      setSeccionFiltro(seccion.id);
                      setCategoriaFiltro(null);
                    }}
                  >
                    {seccion.nombre}
                  </button>
                ))}
            </div>
          </div>

          {/* Filtro de Categoría */}
          {seccionFiltro && (
            <div className="filter-sidebar-section">
              <h3 className="filter-sidebar-section-title">Categoría</h3>
              <div className="filter-sidebar-options">
                <button
                  className={`filter-sidebar-option ${!categoriaFiltro ? 'active' : ''}`}
                  onClick={() => {
                    setCategoriaFiltro(null);
                  }}
                >
                  Todas
                </button>
                {categorias
                  .filter(cat => cat.seccionId === seccionFiltro)
                  .filter(cat => {
                    const productosCat = productos.filter(
                      p => p.categoriaId === cat.id && p.disponible !== false
                    );
                    return productosCat.length > 0;
                  })
                  .map(categoria => (
                    <button
                      key={categoria.id}
                      className={`filter-sidebar-option ${categoriaFiltro === categoria.id ? 'active' : ''}`}
                      onClick={() => {
                        setCategoriaFiltro(categoria.id);
                        setCategoriaSeleccionada(categoria.id);
                        // No cerrar el filtro en modo pantalla
                        if (!modoPantalla) {
                          setFiltrosAbierto(false);
                        }
                      }}
                    >
                      {categoria.nombre}
                    </button>
                  ))}
              </div>
            </div>
          )}

          {/* Información de Productos */}
          {categoriaFiltro && (
            <div className="filter-sidebar-section">
              <h3 className="filter-sidebar-section-title">Productos</h3>
              <div className="filter-sidebar-info">
                {productos.filter(p => p.categoriaId === categoriaFiltro && p.disponible !== false).length} producto(s) disponible(s)
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;

