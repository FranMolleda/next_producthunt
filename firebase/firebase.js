import app from "firebase/compat/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

import firebaseConfig from "./config";

class Firebase {
  constructor() {
    if (!app.apps.lenght) {
      app.initializeApp(firebaseConfig);
    }
    this.auth = getAuth();
  }

  //Registra un usuario
  async registrar(nombre, email, password) {
    const nuevoUsuario = await createUserWithEmailAndPassword(
      this.auth,
      email,
      password
    );

    return await nuevoUsuario.user.updateProfile({ displayName: nombre });
  }
}

const firebase = new Firebase();
export default firebase;
