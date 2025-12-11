import React, { useState, useRef, useEffect } from "react";
import { useFilter } from "../context/FilterContext";
import logoImage from "../pages/mundo frappe.png";
import { generateChatbotResponse, extractRecommendations } from "../services/genkitService";
import "./ChatBot.css";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);
  const { productos, categorias, secciones } = useFilter();

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Mensaje inicial cuando se abre el chat
      setMessages([
        {
          type: "bot",
          text: "¡Hola! 👋 Soy tu asistente de Mundo Frappe. Puedo ayudarte a encontrar la bebida perfecta. ¿Qué te gustaría probar hoy?",
          timestamp: new Date()
        }
      ]);
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getRecommendations = (query) => {
    const queryLower = query.toLowerCase().trim();
    const productosDisponibles = productos.filter(p => p.disponible !== false);
    
    // Detectar si busca comida
    const buscaComida = queryLower.includes("comer") || 
                       queryLower.includes("comida") ||
                       queryLower.includes("algo de comer") ||
                       queryLower.includes("algo para comer") ||
                       queryLower.includes("reposteria") ||
                       queryLower.includes("repostería") ||
                       queryLower.includes("postre") ||
                       queryLower.includes("dulce") && !queryLower.includes("bebida");
    
    // Categorías de comida
    const categoriasComida = categorias.filter(cat => {
      const nombreCat = cat.nombre.toLowerCase();
      return nombreCat.includes("comida") || 
             nombreCat.includes("reposteria") || 
             nombreCat.includes("repostería") ||
             nombreCat.includes("postre") ||
             nombreCat.includes("pan") ||
             nombreCat.includes("pastel") ||
             nombreCat.includes("galleta");
    });

    // Categorías de bebidas (excluir comida)
    const categoriasBebidas = categorias.filter(cat => {
      const nombreCat = cat.nombre.toLowerCase();
      return !nombreCat.includes("comida") && 
             !nombreCat.includes("reposteria") && 
             !nombreCat.includes("repostería") &&
             !nombreCat.includes("postre") &&
             !nombreCat.includes("pan") &&
             !nombreCat.includes("pastel") &&
             !nombreCat.includes("galleta");
    });

    // Productos de comida
    const productosComida = productosDisponibles.filter(p => 
      categoriasComida.some(cat => cat.id === p.categoriaId)
    );

    // Solo productos de categorías de bebidas
    const productosBebidas = productosDisponibles.filter(p => 
      categoriasBebidas.some(cat => cat.id === p.categoriaId)
    );

    // Si busca comida, devolver solo comida
    if (buscaComida) {
      if (productosComida.length > 0) {
        return productosComida.slice(0, 5);
      }
      // Si no hay comida, devolver mensaje indicando que no hay
      return [];
    }

    // Detectar si busca bebidas específicamente
    const buscaBebidas = queryLower.includes("bebida") || 
                        queryLower.includes("bebidas") ||
                        queryLower.includes("tomar") ||
                        queryLower.includes("beber") ||
                        (!buscaComida && (queryLower.includes("frappe") || 
                                         queryLower.includes("cafe") ||
                                         queryLower.includes("malteada") ||
                                         queryLower.includes("limonada")));

    // Detectar temperatura
    const buscaFrio = queryLower.includes("frio") || 
                     queryLower.includes("frío") || 
                     queryLower.includes("fria") ||
                     queryLower.includes("fría") ||
                     queryLower.includes("helado") ||
                     queryLower.includes("helada");
    
    const buscaCaliente = queryLower.includes("caliente") || 
                         queryLower.includes("calientes") ||
                         queryLower.includes("calor");

    // Categorías de bebidas frías
    const categoriasFrias = categoriasBebidas.filter(cat => {
      const nombre = cat.nombre.toLowerCase();
      return nombre.includes("frappe") || 
             nombre.includes("malteada") || 
             nombre.includes("limonada") ||
             nombre.includes("naranjada") ||
             nombre.includes("tizzana") ||
             nombre.includes("yogurt") ||
             nombre.includes("smoothie") ||
             nombre.includes("batido");
    });

    // Categorías de bebidas calientes
    const categoriasCalientes = categoriasBebidas.filter(cat => {
      const nombre = cat.nombre.toLowerCase();
      return nombre.includes("cafe") || 
             nombre.includes("café") || 
             nombre.includes("te") ||
             nombre.includes("té") ||
             nombre.includes("chocolate") ||
             nombre.includes("capuchino") ||
             nombre.includes("latte") ||
             nombre.includes("expresso");
    });

    // Si busca bebidas frías
    if (buscaFrio) {
      const productosFrios = productosBebidas.filter(p => 
        categoriasFrias.some(cat => cat.id === p.categoriaId)
      );
      if (productosFrios.length > 0) {
        return productosFrios.slice(0, 5);
      }
    }

    // Si busca bebidas calientes
    if (buscaCaliente) {
      const productosCalientes = productosBebidas.filter(p => 
        categoriasCalientes.some(cat => cat.id === p.categoriaId)
      );
      if (productosCalientes.length > 0) {
        return productosCalientes.slice(0, 5);
      }
    }

    // Buscar por nombre de categoría específica
    const categoriasCoincidentes = categoriasBebidas.filter(cat => {
      const nombreCat = cat.nombre.toLowerCase();
      const palabras = queryLower.split(/\s+/);
      return palabras.some(palabra => nombreCat.includes(palabra) && palabra.length > 2);
    });

    if (categoriasCoincidentes.length > 0) {
      const productosDeCategorias = productosBebidas.filter(p =>
        categoriasCoincidentes.some(cat => cat.id === p.categoriaId)
      );
      if (productosDeCategorias.length > 0) {
        return productosDeCategorias.slice(0, 5);
      }
    }

    // Buscar por nombre de producto (solo en bebidas si busca bebidas)
    const productosCoincidentes = (buscaBebidas ? productosBebidas : productosDisponibles).filter(p => {
      const nombreProd = p.nombre.toLowerCase();
      const palabras = queryLower.split(/\s+/);
      return palabras.some(palabra => nombreProd.includes(palabra) && palabra.length > 2);
    });

    if (productosCoincidentes.length > 0) {
      return productosCoincidentes.slice(0, 5);
    }

    // Palabras clave específicas
    const keywords = {
      "frappe": categoriasFrias.filter(c => c.nombre.toLowerCase().includes("frappe")),
      "malteada": categoriasFrias.filter(c => c.nombre.toLowerCase().includes("malteada")),
      "cafe": categoriasCalientes.filter(c => c.nombre.toLowerCase().includes("cafe") || c.nombre.toLowerCase().includes("café")),
      "café": categoriasCalientes.filter(c => c.nombre.toLowerCase().includes("cafe") || c.nombre.toLowerCase().includes("café")),
      "te": categoriasCalientes.filter(c => c.nombre.toLowerCase().includes("te") || c.nombre.toLowerCase().includes("té")),
      "té": categoriasCalientes.filter(c => c.nombre.toLowerCase().includes("te") || c.nombre.toLowerCase().includes("té")),
      "limonada": categoriasFrias.filter(c => c.nombre.toLowerCase().includes("limonada")),
      "yogurt": categoriasFrias.filter(c => c.nombre.toLowerCase().includes("yogurt")),
      "dulce": productosBebidas.filter(p => {
        const cat = categoriasBebidas.find(c => c.id === p.categoriaId);
        return cat && (cat.nombre.toLowerCase().includes("frappe") || 
                       cat.nombre.toLowerCase().includes("malteada") ||
                       cat.nombre.toLowerCase().includes("yogurt"));
      }),
      "refrescante": categoriasFrias.filter(c => 
        c.nombre.toLowerCase().includes("limonada") || 
        c.nombre.toLowerCase().includes("naranjada") ||
        c.nombre.toLowerCase().includes("tizzana")
      )
    };

    // Buscar keywords específicas
    for (const [keyword, resultado] of Object.entries(keywords)) {
      if (queryLower.includes(keyword)) {
        if (Array.isArray(resultado) && resultado.length > 0) {
          // Si es array de categorías
          if (resultado[0].id) {
            const productosKeyword = productosBebidas.filter(p =>
              resultado.some(cat => cat.id === p.categoriaId)
            );
            if (productosKeyword.length > 0) {
              return productosKeyword.slice(0, 5);
            }
          }
        } else if (resultado.length > 0 && resultado[0].id) {
          // Si es array de productos
          return resultado.slice(0, 5);
        }
      }
    }

    // Si busca "bebidas" sin más especificación, devolver bebidas populares
    if (buscaBebidas && !buscaFrio && !buscaCaliente) {
      const productosPopulares = productosBebidas.slice(0, 5);
      if (productosPopulares.length > 0) {
        return productosPopulares;
      }
    }

    // Recomendaciones aleatorias de bebidas si no hay coincidencias
    if (productosBebidas.length > 0 && !buscaComida) {
      const shuffled = [...productosBebidas].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, 3);
    }

    // Último recurso: productos aleatorios (solo si no busca comida específicamente)
    if (!buscaComida) {
      const shuffled = [...productosDisponibles].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, 3);
    }

    return [];
  };

  const generateResponse = (query) => {
    const queryLower = query.toLowerCase().trim();
    
    // Detectar si hay solicitud de recomendación
    const buscaRecomendacion = queryLower.match(/recomiend|recomienda|recomiende|sugiere|sugerir|quiero|dame|dame una|una bebida|bebida|frappe|cafe|malteada|limonada|te|té|yogurt|frio|frío|fria|fría|caliente|helado|helada|dulce|refrescante|comer|comida|algo de comer|algo para comer/i);
    
    // Si hay solicitud de recomendación, priorizar eso sobre saludos
    if (buscaRecomendacion) {
      const recommendations = getRecommendations(query);
      
      // Si busca comida y no hay resultados
      if (queryLower.includes("comer") || queryLower.includes("comida")) {
        if (recommendations.length === 0) {
          return {
            text: "Lo siento, actualmente no tenemos productos de comida disponibles. ¿Te gustaría que te recomiende alguna bebida? 😊",
            recommendations: null
          };
        }
      }
      
      if (recommendations.length > 0) {
        // Si pide solo una bebida
        const soloUna = queryLower.match(/solo una|nada mas una|una sola|solo un|nada mas un|solo 1|una bebida/i);
        const cantidad = soloUna ? 1 : Math.min(recommendations.length, 3);
        const productosMostrar = recommendations.slice(0, cantidad);
        
        const productosText = productosMostrar.map(p => {
          const categoria = categorias.find(c => c.id === p.categoriaId);
          const precio = p.precioChico || p.precioGrande || p.precio;
          return `• ${p.nombre}${categoria ? ` (${categoria.nombre})` : ''}${precio ? ` - $${precio.toFixed(0)}` : ''}`;
        }).join('\n');

        const saludo = queryLower.match(/hola|hi|hey|buenos días|buenas tardes|buenas noches/) ? "¡Hola! " : "";
        const mensaje = cantidad === 1 
          ? `${saludo}Te recomiendo esta bebida:\n\n${productosText}\n\n¡Espero que la disfrutes! 😊`
          : `${saludo}Te recomiendo estas opciones:\n\n${productosText}\n\n¿Te gustaría saber más sobre alguna de estas opciones?`;

        return {
          text: mensaje,
          recommendations: productosMostrar
        };
      }
    }

    // Saludos (solo si no hay solicitud de recomendación)
    if (queryLower.match(/^(hola|hi|hey|buenos días|buenas tardes|buenas noches)[\s!?]*$/)) {
      return {
        text: "¡Hola! 😊 ¿En qué puedo ayudarte hoy? Puedo recomendarte bebidas según tus preferencias.",
        recommendations: null
      };
    }

    // Despedidas
    if (queryLower.match(/adios|chao|bye|hasta luego|gracias/)) {
      return {
        text: "¡Fue un placer ayudarte! Espero que disfrutes tu bebida. ¡Vuelve pronto! 👋",
        recommendations: null
      };
    }

    // Ayuda
    if (queryLower.match(/ayuda|help|que puedes hacer|opciones/)) {
      return {
        text: "Puedo ayudarte a encontrar bebidas según tus preferencias. Por ejemplo, puedes preguntar por bebidas frías, calientes, dulces, refrescantes, o por categorías específicas como frappes, cafés, malteadas, etc.",
        recommendations: null
      };
    }

    // Si no es saludo ni despedida, intentar recomendaciones
    const recommendations = getRecommendations(query);
    
    if (recommendations.length > 0) {
      const productosText = recommendations.map(p => {
        const categoria = categorias.find(c => c.id === p.categoriaId);
        const precio = p.precioChico || p.precioGrande || p.precio;
        return `• ${p.nombre}${categoria ? ` (${categoria.nombre})` : ''}${precio ? ` - $${precio.toFixed(0)}` : ''}`;
      }).join('\n');

      return {
        text: `Te recomiendo estas opciones:\n\n${productosText}\n\n¿Te gustaría saber más sobre alguna de estas opciones?`,
        recommendations: recommendations
      };
    }

    // Respuesta por defecto
    return {
      text: "No encontré resultados específicos para tu búsqueda. ¿Podrías ser más específico? Por ejemplo: 'bebidas frías', 'frappes', 'cafés', etc.",
      recommendations: null
    };
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Agregar mensaje del usuario
    const userMessage = {
      type: "user",
      text: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue("");

    // Mostrar indicador de carga
    const loadingMessage = {
      type: "bot",
      text: "Pensando...",
      timestamp: new Date(),
      isLoading: true
    };
    setMessages(prev => [...prev, loadingMessage]);

    try {
      // Intentar usar Genkit primero
      const genkitResponse = await generateChatbotResponse(
        currentInput,
        productos,
        categorias,
        secciones
      );

      // Remover mensaje de carga
      setMessages(prev => prev.filter(msg => !msg.isLoading));

      if (genkitResponse) {
        // Extraer recomendaciones del texto generado
        const recommendations = extractRecommendations(
          genkitResponse,
          productos,
          categorias
        );

        const botMessage = {
          type: "bot",
          text: genkitResponse,
          recommendations: recommendations.length > 0 ? recommendations : null,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        // Fallback a lógica manual si Genkit no está disponible
        const response = generateResponse(currentInput);
        const botMessage = {
          type: "bot",
          text: response.text,
          recommendations: response.recommendations,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
      }
    } catch (error) {
      console.error('Error generating response:', error);
      
      // Remover mensaje de carga
      setMessages(prev => prev.filter(msg => !msg.isLoading));
      
      // Fallback a lógica manual
      const response = generateResponse(currentInput);
      const botMessage = {
        type: "bot",
        text: response.text,
        recommendations: response.recommendations,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    }
  };

  const handleQuickAction = (action) => {
    setInputValue(action);
    handleSend({ preventDefault: () => {} });
  };

  return (
    <>
      {/* Botón flotante */}
      {!isOpen && (
        <button
          className="chatbot-toggle"
          onClick={() => setIsOpen(true)}
          aria-label="Abrir chatbot"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div className="chatbot-container">
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <div className="chatbot-avatar">
                <img src={logoImage} alt="Asistente Mundo Frappe" />
              </div>
              <div>
                <h3>Asistente Mundo Frappe</h3>
                <p>En línea</p>
              </div>
            </div>
            <button
              className="chatbot-close"
              onClick={() => setIsOpen(false)}
              aria-label="Cerrar chatbot"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`chatbot-message ${msg.type} ${msg.isLoading ? 'loading' : ''}`}>
                {msg.type === "bot" && (
                  <div className="chatbot-avatar-small chatbot-avatar-bot">
                    <img src={logoImage} alt="Asistente Mundo Frappe" />
                  </div>
                )}
                <div className="chatbot-message-content">
                  {msg.isLoading ? (
                    <p className="chatbot-loading">
                      <span className="chatbot-loading-dot"></span>
                      <span className="chatbot-loading-dot"></span>
                      <span className="chatbot-loading-dot"></span>
                    </p>
                  ) : (
                    <p>{msg.text}</p>
                  )}
                  {msg.recommendations && msg.recommendations.length > 0 && (
                    <div className="chatbot-recommendations">
                      {msg.recommendations.map((producto) => {
                        const categoria = categorias.find(c => c.id === producto.categoriaId);
                        return (
                          <div key={producto.id} className="chatbot-recommendation-item">
                            <strong>{producto.nombre}</strong>
                            {categoria && <span className="chatbot-category">{categoria.nombre}</span>}
                            {(producto.precioChico || producto.precioGrande || producto.precio) && (
                              <span className="chatbot-price">
                                ${(producto.precioChico || producto.precioGrande || producto.precio).toFixed(0)}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-quick-actions">
            <button onClick={() => handleQuickAction("bebidas frías")}>
              Bebidas frías
            </button>
            <button onClick={() => handleQuickAction("bebidas calientes")}>
              Bebidas calientes
            </button>
            <button onClick={() => handleQuickAction("frappes")}>
              Frappes
            </button>
            <button onClick={() => handleQuickAction("recomendaciones")}>
              Recomendaciones
            </button>
          </div>

          <form className="chatbot-input-form" onSubmit={handleSend}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Escribe tu mensaje..."
              className="chatbot-input"
            />
            <button type="submit" className="chatbot-send">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatBot;

