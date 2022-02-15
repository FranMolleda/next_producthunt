import React, { useState, useEffect, useContext } from "react";
import {
  collection,
  query,
  where,
  addDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

import { FirebaseContext } from "../firebase";

const useProductos = (orden) => {
  const [productos, setProductos] = useState([]);

  const { firebase } = useContext(FirebaseContext);

  const { db } = firebase;

  useEffect(() => {
    const obtenerProductos = async () => {
      let product = [];
      const q = query(collection(db, "productos"), orderBy(orden, "desc"));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        product.push({ ...doc.data() });
      });
      setProductos(product);
    };
    obtenerProductos();
  }, []);

  return {
    productos,
  };
};

export default useProductos;
