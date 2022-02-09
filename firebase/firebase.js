import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

import firebaseConfig from "./config";

class Firebase {
  constructor() {
    initializeApp(firebaseConfig);
    this.auth = getAuth();
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
}

const firebase = new Firebase();
export default firebase;
