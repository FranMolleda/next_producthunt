import React, { useState, useEffect } from "react";
import firebase from "../firebase";

function useAutenticacion() {
  const [usuarioautenticado, setUsuarioAutenticado] = useState(null);
  useEffect(() => {
    console.log(firebase.auth);
    const unsuscribe = firebase.auth.onAuthStateChanged((usuario) => {
      if (usuario) {
        setUsuarioAutenticado(usuario);
      } else {
        setUsuarioAutenticado(null);
      }
    });
    return () => unsuscribe();
  }, []);

  return usuarioautenticado;
}

export default useAutenticacion;
