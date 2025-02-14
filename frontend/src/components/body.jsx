import React from "react";
import { Input } from "@heroui/react"; 
import ProductCard from "./ProductCard";
import { useEffect, useState } from 'react';



const productos = [
  { id: 1, 
    placeType: "Playa", 
    imageUrl: "venecia_italia.webp", 
    place: "Bajo Alcyone",
    location: "Cocos Insland, Costa Rica.", 
    description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
  {
    id: 2,
    placeType: "Restaurante",
    imageUrl: "buzo_md.webp",
    place: "Gourmet Paradise",
    location: "Barcelona, España",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit..",
  },
  {
    id: 3,
    placeType: "Parque",
    imageUrl: "mountain1_md.webp",
    place: "Parque Nacional",
    location: "Patagonia, Chile",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    id: 4,
    placeType: "Museo",
    imageUrl: "shibuya_tokyo_japan_md.webp",
    place: "Museo de Arte Moderno",
    location: "Nueva York, EE.UU.",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
];

const Body = () => {

 
    
  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-gray-100 p-6">
      
      <div className="w-full max-w-2xl mb-6">
        <Input placeholder="Buscar productos..." className="w-full p-3 border rounded-lg shadow" />
      </div>

      {/* Contenedor Principal, menciono esto para no confundirme*/}
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
          {productos.map((producto) => (
            <div key={producto.id} className="bg-white border rounded-lg shadow p-4 flex flex-col items-center">
              <ProductCard data={producto} />
            </div>
          ))}
        </div>
        
      </div>
    </div>
  );
};

export default Body;
