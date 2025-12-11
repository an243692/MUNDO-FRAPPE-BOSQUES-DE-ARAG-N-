import React, { createContext, useContext, useState } from 'react';

const FilterContext = createContext();

export const useFilter = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilter debe ser usado dentro de FilterProvider');
  }
  return context;
};

export const FilterProvider = ({ children }) => {
  const [filtrosAbierto, setFiltrosAbierto] = useState(false);
  const [seccionFiltro, setSeccionFiltro] = useState(null);
  const [categoriaFiltro, setCategoriaFiltro] = useState(null);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [secciones, setSecciones] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [modoPantalla, setModoPantalla] = useState(false);

  return (
    <FilterContext.Provider
      value={{
        filtrosAbierto,
        setFiltrosAbierto,
        seccionFiltro,
        setSeccionFiltro,
        categoriaFiltro,
        setCategoriaFiltro,
        categoriaSeleccionada,
        setCategoriaSeleccionada,
        secciones,
        setSecciones,
        categorias,
        setCategorias,
        productos,
        setProductos,
        modoPantalla,
        setModoPantalla,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

