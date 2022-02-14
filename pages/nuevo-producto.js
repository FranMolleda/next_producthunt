import React, { useState, useContext } from "react";
import { css } from "@emotion/core";
import { useRouter } from "next/router";
import Layout from "../components/layout/Layout";
import {
  Formulario,
  Campo,
  InputSubmit,
  Error,
} from "../components/ui/Formulario";

import { FirebaseContext } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { ref, getDownloadURL, uploadBytesResumable } from "@firebase/storage";

//validaciones
import useValidacion from "../hooks/useValidacion";
import validarCrearProducto from "../validacion/validarCrearPorducto";

const STATE_INICIAL = {
  nombre: "",
  empresa: "",
  url: "",
  descripcion: "",
};

export default function NuevoProducto() {
  const { usuario, firebase } = useContext(FirebaseContext);

  const [uploading, setUploading] = useState(false);
  const [URLImage, setURLImage] = useState("");

  const [error, setError] = useState(false);
  const { valores, errores, handleChange, handleSubmit, handleBlur } =
    useValidacion(STATE_INICIAL, validarCrearProducto, crearProducto);
  const { id, nombre, empresa, imagen, url, descripcion } = valores;

  // context con las operaciones crud de firebase
  const { db, app } = firebase;

  const router = useRouter();

  async function crearProducto() {
    //Si el usuario no está autenticado
    if (!usuario) {
      return router.push("/login");
    }

    // crear el objeto de nuevo producto
    const producto = {
      nombre,
      empresa,
      url,
      urlimagen: URLImage,
      descripcion,
      votos: 0,
      comentarios: [],
      creado: Date.now(),
      creador: { id: usuario.uid, nombre: usuario.displayName },
    };

    // Insertarlo en la BBDD
    const productos = await addDoc(collection(db, "productos"), producto);
    return router.push("/");
  }

  const handleImageUpload = (e) => {
    // Se obtiene referencia de la ubicación donde se guardará la imagen
    const file = e.target.files[0];
    const imageRef = ref(firebase.storage, "products/" + file.name);

    // Se inicia la subida
    setUploading(true);

    //Aquí le decimos en qué ruta (imageRef y qué archivo (file))
    const uploadTask = uploadBytesResumable(imageRef, file);

    // Registra eventos para cuando detecte un cambio en el estado de la subida
    uploadTask.on(
      "state_changed",
      // Muestra progreso de la subida
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Subiendo imagen: ${progress}% terminado`);
      },
      // En caso de error
      (error) => {
        setUploading(false);
        console.error(error);
      },
      // Subida finalizada correctamente
      () => {
        setUploading(false);
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          console.log("Imagen disponible en:", url);
          setURLImage(url);
        });
      }
    );
  };
  return (
    <div>
      <Layout>
        <>
          <h1
            css={css`
              text-align: center;
              margin-top: 5rem;
            `}
          >
            Nuevo Producto
          </h1>
          <Formulario onSubmit={handleSubmit} noValidate>
            <fieldset>
              <legend>Información General</legend>

              <Campo>
                <label htmlFor="nombre">Nombre</label>
                <input
                  type="text"
                  id="nombre"
                  placeholder="Tu Nombre"
                  name="nombre"
                  value={nombre}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Campo>
              {errores.nombre && <Error>{errores.nombre}</Error>}

              <Campo>
                <label htmlFor="empresa">Empresa</label>
                <input
                  type="text"
                  id="empresa"
                  placeholder="Nombre de Empresa o Compañía"
                  name="empresa"
                  value={empresa}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Campo>
              {errores.empresa && <Error>{errores.empresa}</Error>}

              <Campo>
                <label htmlFor="imagen">Imagen</label>
                <input
                  accept="image/*"
                  type="file"
                  id="image"
                  name="image"
                  onChange={handleImageUpload}
                />
              </Campo>

              <Campo>
                <label htmlFor="url">URL</label>
                <input
                  type="url"
                  id="url"
                  placeholder="URL de tu producto"
                  name="url"
                  value={url}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Campo>
              {errores.url && <Error>{errores.url}</Error>}
            </fieldset>

            <fieldset>
              <legend>Sobre tu Producto</legend>

              <Campo>
                <label htmlFor="descripcion">Descripción</label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  value={descripcion}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Campo>
              {errores.descripcion && <Error>{errores.descripcion}</Error>}
            </fieldset>

            {error && <Error>Email ya registrado</Error>}
            <InputSubmit type="submit" value="Crear Producto" />
          </Formulario>
        </>
      </Layout>
    </div>
  );
}
