import React from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "./Logo";
import { useFilter } from "../context/FilterContext";
import FilterSidebar from "./FilterSidebar";
import "./Navbar.css";

const Navbar = () => {
  const location = useLocation();
  const {
    filtrosAbierto,
    setFiltrosAbierto,
    modoPantalla
  } = useFilter();
  
  const isMenuPage = location.pathname === "/";

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-logo">
            <Logo size="large" />
          </Link>
          <div className="navbar-menu">
            <Link 
              to="/" 
              className={location.pathname === "/" ? "navbar-link active" : "navbar-link"}
            >
              Mundo Frappe
            </Link>
            
            {/* Botón de Filtro con Icono de Tres Rayas - Solo en página de menú */}
            {isMenuPage && (
              <button 
                className={`navbar-filter-btn ${filtrosAbierto ? 'active' : ''}`}
                onClick={() => {
                  // En modo pantalla, solo abrir, no cerrar
                  if (modoPantalla) {
                    setFiltrosAbierto(true);
                  } else {
                    setFiltrosAbierto(!filtrosAbierto);
                  }
                }}
                aria-label="Abrir filtros"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              </button>
            )}
          </div>
        </div>
      </nav>
      
      {/* Sidebar de Filtros - Solo en página de menú */}
      {isMenuPage && <FilterSidebar />}
    </>
  );
};

export default Navbar;

