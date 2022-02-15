import React, { useState, useEffect, useContext } from "react";
import Layout from "../components/layout/Layout";
import DetallesProducto from "../components/layout/DetallesProducto";
import useProductos from "../hooks/useProductos";

export default function Home() {
  const { productos } = useProductos("creado");
  return (
    <div>
      <Layout>
        <div className="listado-productos">
          <div className="contenedor">
            <ul className="bg-white">
              {productos.map((producto) => (
                <DetallesProducto producto={producto} key={producto.id} />
              ))}
            </ul>
          </div>
        </div>
      </Layout>
    </div>
  );
}
