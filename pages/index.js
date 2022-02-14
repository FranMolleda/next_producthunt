import React, { useState, useEffect, useContext } from "react";
import Layout from "../components/layout/Layout";
import { FirebaseContext } from "../firebase";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import DetallesProducto from "../components/layout/DetallesProducto";

export default function Home() {
  const [productos, setProductos] = useState([]);
  const [todosproductos, setTodosProductos] = useState([]);

  const { firebase } = useContext(FirebaseContext);

  const { db } = firebase;

  useEffect(() => {
    const obtenerProductos = async () => {
      let product = [];
      const docRef = await getDocs(collection(db, "productos"));
      docRef.forEach((doc) => {
        return product.push(doc.data());
      });
      setProductos(product);
    };
    obtenerProductos();
  }, []);

  console.log(productos);

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
