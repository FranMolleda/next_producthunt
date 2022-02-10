import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
/* import "firebase/firestore"; */
import { getFirestore } from "firebase/firestore";
import { getStorage } from "@firebase/storage";

import firebaseConfig from "./config";

class Firebase {
  constructor() {
    this.app = initializeApp(firebaseConfig);
    this.auth = getAuth();
    this.db = getFirestore();
    this.storage = getStorage();
  }

  //Registra un usuario
  async registrar(nombre, email, password) {
    const nuevoUsuario = await createUserWithEmailAndPassword(
      this.auth,
      email,
      password
    );

    return await updateProfile(nuevoUsuario.user, { displayName: nombre });
  }

  // Inicia sesión del usuario
  async login(email, password) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  // Cierra la sesión del usuario
  async cerrarSesion() {
    await this.auth.signOut();
  }
}

const firebase = new Firebase();
export default firebase;
