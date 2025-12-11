// Servicio para usar Google AI (Gemini) para generar respuestas del chatbot
// Usamos la API REST directamente ya que Genkit está diseñado para Node.js/backend

const GOOGLE_AI_API_KEY = process.env.REACT_APP_GOOGLE_AI_API_KEY || 'AIzaSyBtJDVXDQlywzU4h0ARunvauLYMCK9d2Uo';
const GOOGLE_AI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

/**
 * Genera una respuesta del chatbot usando Google AI (Gemini)
 * @param {string} userMessage - Mensaje del usuario
 * @param {Array} productos - Lista de productos disponibles
 * @param {Array} categorias - Lista de categorías
 * @param {Array} secciones - Lista de secciones
 * @returns {Promise<string>} - Respuesta generada por la IA
 */
export const generateChatbotResponse = async (userMessage, productos, categorias, secciones) => {
  try {
    
    // Preparar información del menú para el contexto
    const productosDisponibles = productos.filter(p => p.disponible !== false);
    const productosInfo = productosDisponibles.slice(0, 30).map(p => {
      const categoria = categorias.find(c => c.id === p.categoriaId);
      const precio = p.precioChico || p.precioGrande || p.precio;
      return {
        nombre: p.nombre,
        categoria: categoria?.nombre || 'Sin categoría',
        precio: precio ? `$${precio.toFixed(0)}` : 'Precio no disponible'
      };
    });

    const categoriasList = categorias.map(c => c.nombre).join(', ');

    // Crear el prompt del sistema
    const systemPrompt = `Eres un asistente virtual conversacional y amigable. Trabajas para "Mundo Frappe", una cafetería, pero puedes hablar sobre CUALQUIER tema.

INFORMACIÓN DEL MENÚ (SOLO usa esta información cuando el usuario pregunte específicamente sobre productos, menú, bebidas o comida):
Categorías: ${categoriasList}
Productos: ${productosInfo.map(p => `${p.nombre} (${p.categoria}) - ${p.precio}`).join(', ')}

INSTRUCCIONES IMPORTANTES:
1. Responde en español de manera natural y conversacional
2. Puedes responder sobre CUALQUIER tema: conversación general, preguntas, chistes, groserías, temas serios, etc.
3. NO fuerces la conversación hacia el menú si el usuario no pregunta sobre ello
4. Si el usuario dice groserías o habla de temas no relacionados con el menú, responde normalmente sin mencionar productos
5. SOLO menciona productos del menú cuando el usuario pregunte específicamente sobre:
   - Productos, menú, bebidas, comida
   - Recomendaciones de productos
   - Precios de productos
6. Para cualquier otra pregunta o comentario, responde de manera natural sin mencionar el menú
7. Mantén las respuestas concisas pero informativas (máximo 200 palabras)
8. Usa emojis de forma moderada cuando sea apropiado
9. Sé honesto, directo y conversacional`;

    // Generar respuesta usando Google AI API (Gemini)
    const fullPrompt = `${systemPrompt}\n\nUsuario: ${userMessage}\n\nAsistente:`;
    
    const response = await fetch(`${GOOGLE_AI_API_URL}?key=${GOOGLE_AI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: fullPrompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
          topP: 0.8,
          topK: 40
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Google AI API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    return generatedText || 'Lo siento, no pude generar una respuesta. ¿Podrías reformular tu pregunta?';
  } catch (error) {
    console.error('Error generating response with Google AI:', error);
    // Retornar null para usar fallback
    return null;
  }
};

/**
 * Extrae recomendaciones de productos del texto generado
 * @param {string} responseText - Texto de la respuesta generada
 * @param {Array} productos - Lista de productos
 * @param {Array} categorias - Lista de categorías
 * @returns {Array} - Array de productos recomendados
 */
export const extractRecommendations = (responseText, productos, categorias) => {
  if (!responseText) return [];
  
  const productosDisponibles = productos.filter(p => p.disponible !== false);
  const recommendations = [];
  const responseLower = responseText.toLowerCase();
  
  // Buscar nombres de productos mencionados en la respuesta
  productosDisponibles.forEach(producto => {
    const nombreProducto = producto.nombre.toLowerCase();
    // Buscar coincidencias exactas o parciales del nombre del producto
    if (responseLower.includes(nombreProducto) || 
        nombreProducto.split(' ').some(palabra => palabra.length > 3 && responseLower.includes(palabra))) {
      if (!recommendations.find(r => r.id === producto.id)) {
        recommendations.push(producto);
      }
    }
  });
  
  return recommendations.slice(0, 5);
};
