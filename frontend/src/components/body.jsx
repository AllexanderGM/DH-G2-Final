import React from "react";
import { Input } from "@heroui/react"; 
import ProductCard from "./ProductCard";
import { useEffect, useState } from 'react';



const lugares = [
  // Lugares destacados
  { id: 1, placeType: "Playa", imageUrl: "buzo_md.webp", place: "Playa Paraíso", location: "Cancún, México", description: "Aguas cristalinas y arena blanca." },
  { id: 2, placeType: "Montaña", imageUrl: "easter_islands-1_md.webp", place: "Cerro Aconcagua", location: "Mendoza, Argentina", description: "La montaña más alta de América." },
  { id: 3, placeType: "Museo", imageUrl: "melilla_la_vieja_calle_alta_melilla_españa_md.webp", place: "Museo del Prado", location: "Madrid, España", description: "Arte clásico de los grandes maestros." },
  { id: 4, placeType: "Playa", imageUrl: "bora_bora_island_french polynesia_md.webp", place: "Isla Bora Bora", location: "Polinesia Francesa", description: "El destino perfecto para el relax." },

  // Lugares adicionales
  { id: 5, placeType: "Montaña", imageUrl: "mountain1_md.webp", place: "Monte Everest", location: "Nepal", description: "El techo del mundo." },
  { id: 6, placeType: "Museo", imageUrl: "taj_mahal_uttar_pradesh_india_md.webp", place: "Louvre", location: "París, Francia", description: "Hogar de la Mona Lisa." },
  { id: 7, placeType: "Playa", imageUrl: "buzo_md.webp", place: "Maldivas", location: "Océano Índico", description: "Bungalows sobre el agua y arenas blancas." },
  { id: 8, placeType: "Montaña", imageUrl: "easter_islands-1_md.webp", place: "Monte Fuji", location: "Japón", description: "Volcán icónico y símbolo de Japón." },
  { id: 9, placeType: "Museo", imageUrl: "melilla_la_vieja_calle_alta_melilla_españa_md.webp", place: "British Museum", location: "Londres, Reino Unido", description: "Historia y arte de todo el mundo." },
  { id: 10, placeType: "Playa", imageUrl: "buzo_md.webp", place: "Bahía de Ha Long", location: "Vietnam", description: "Formaciones rocosas impresionantes sobre el mar." },
  { id: 11, placeType: "Montaña", imageUrl: "easter_islands-1_md.webp", place: "Rocky Mountains", location: "Canadá", description: "Paisajes naturales espectaculares." },
  { id: 12, placeType: "Museo", imageUrl: "melilla_la_vieja_calle_alta_melilla_españa_md.webp", place: "Metropolitan Museum of Art", location: "Nueva York, EE.UU.", description: "Colección de arte de renombre mundial." },
  { id: 13, placeType: "Playa", imageUrl: "buzo_md.webp", place: "Copacabana", location: "Río de Janeiro, Brasil", description: "Ambiente vibrante y playas icónicas." },
  { id: 14, placeType: "Montaña", imageUrl: "easter_islands-1_md.webp", place: "Los Alpes", location: "Europa", description: "Famoso destino de esquí y senderismo." },
];


const lugaresDestacados = lugares.slice(0, 4);


const getLugaresPorCategoria = (categoria) =>
  lugares.filter((lugar) => lugar.placeType === categoria);

const Body = () => {
  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-2xl mb-6">
        <Input placeholder="Buscar productos..." className="w-full p-3 border rounded-lg shadow" />
      </div>


      <h1 className="text-3xl font-bold text-gray-800 mb-6">Lugares Destacados</h1>

 
      <div className="w-full max-w-6xl mb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {lugaresDestacados.map((lugar) => (
            <ProductCard data={lugar} />
          ))}
        </div>
      </div>

   
      {["Playa", "Montaña", "Museo"].map((categoria) => (
        <div key={categoria} className="w-full max-w-6xl mb-12">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">{categoria}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {getLugaresPorCategoria(categoria).map((lugar) => (
              <ProductCard data={lugar} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Body;
