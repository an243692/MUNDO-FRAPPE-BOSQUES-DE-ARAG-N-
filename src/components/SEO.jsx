import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

const SEO = ({ 
  title = "Mundo Frappe - Menú Digital de Bebidas y Cafés",
  description = "Descubre nuestro delicioso menú de frappes, cafés, bebidas frías y calientes. Mundo Frappe ofrece una gran variedad de sabores únicos para todos los gustos.",
  keywords = "frappe, café, bebidas, menú, mundo frappe, frappes, bebidas frías, cafetería",
  image = "https://mundofrappe.com/og-image.jpg",
  type = "website",
  structuredData = null
}) => {
  const location = useLocation();
  const siteUrl = "https://mundofrappe.com";
  const currentUrl = `${siteUrl}${location.pathname}`;

  // Structured Data por defecto para LocalBusiness
  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "FoodEstablishment",
    "name": "Mundo Frappe",
    "description": "Cafetería especializada en frappes, cafés y bebidas deliciosas",
    "url": siteUrl,
    "servesCuisine": "Bebidas",
    "priceRange": "$$"
  };

  const finalStructuredData = structuredData || defaultStructuredData;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={currentUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={currentUrl} />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(finalStructuredData)}
      </script>
    </Helmet>
  );
};

export default SEO;





