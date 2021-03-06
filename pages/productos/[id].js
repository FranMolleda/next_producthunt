import React, { useEffect, useContext, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../../components/layout/Layout";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { es } from "date-fns/locale";
import { FirebaseContext } from "../../firebase";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { getStorage, ref, deleteObject } from "firebase/storage";
import Error404 from "../../components/layout/404";
import { css } from "@emotion/core";
import styled from "@emotion/styled";
import { Campo, InputSubmit } from "../../components/ui/Formulario";
import Boton from "../../components/ui/Boton";

const ContenedorProducto = styled.div`
  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: 2fr 1fr;
    column-gap: 2rem;
  }
`;

const CreadorProducto = styled.p`
  padding: 0.5rem 2rem;
  background-color: #da552f;
  color: #fff;
  text-transform: uppercase;
  font-weight: bold;
  display: inline-block;
  text-align: center;
`;
const Producto = () => {
  //State del componente

  const [producto, setProducto] = useState({});
  const [error, setError] = useState(false);
  const [comentario, setComentario] = useState({});
  const [consultarDB, setConsultarDB] = useState(true);

  //Storage para borrar imagen
  const storage = getStorage();

  //Routing para obtener el id actual
  const router = useRouter();
  const {
    query: { id },
  } = router;
  /* Esto es lo mismo que esto:const id = router.query.id; */

  // context de firebase
  const { firebase, usuario } = useContext(FirebaseContext);
  useEffect(() => {
    if (id && consultarDB) {
      const obtenerProducto = async () => {
        const productoQuery = doc(firebase.db, "productos", id);
        const producto = await getDoc(productoQuery);

        if (producto.exists()) {
          setProducto(producto.data());
          setConsultarDB(false);
        } else {
          setError(true);
          setConsultarDB(false);
        }
      };
      obtenerProducto();
    }
  }, [id, consultarDB]);

  if (Object.keys(producto).length === 0 && !error) return "Cargando...";

  const {
    creado,
    descripcion,
    nombre,
    comentarios,
    empresa,
    url,
    urlimagen,
    votos,
    creador,
    haVotado,
  } = producto;

  //Administrar y validar los votos
  const votarProducto = async () => {
    if (!usuario) {
      return router.push("/login");
    }
    //obtener y sumar un nuevo voto
    const nuevoTotal = votos + 1;

    //Verificar si el usuario actual ha votado
    if (haVotado.includes(usuario.uid)) return;

    //Guardar el Id del usuario
    const nuevoHaVotado = [...haVotado, usuario.uid];

    //Actualizar en la BDD
    const productRef = doc(firebase.db, "productos", id);
    setDoc(
      productRef,
      { votos: nuevoTotal, haVotado: nuevoHaVotado },
      { merge: true }
    );

    //Actualizar el state
    setProducto({
      ...producto,
      votos: nuevoTotal,
    });
    setConsultarDB(true); //Ponemos a true para que el useEffect lo actualice
  };

  //Funciones para crear comentarios
  const comentarioChange = (e) => {
    setComentario({ ...comentario, [e.target.name]: e.target.value });
  };

  //Identifica si el comentario es del creador del producto
  const esCreador = (id) => {
    if (creador.id === id) {
      return true;
    }
  };

  const agregarComentario = (e) => {
    e.preventDefault();

    if (!usuario) {
      return router.push("/login");
    }

    //Informaci??n extra al comentario
    setComentario({
      ...comentario,
    });
    comentario.usuarioId = usuario.uid;
    comentario.usuarioNombre = usuario.displayName;

    // Tomar copia de comentarios y agregar al arreglo
    const nuevosComentarios = [...comentarios, comentario];

    //Actualizar la BBDD
    const productRef = doc(firebase.db, "productos", id);
    setDoc(
      productRef,
      {
        comentarios: nuevosComentarios,
      },
      { merge: true }
    );

    //Actualizar el state
    setProducto({
      ...producto,
      comentarios: nuevosComentarios,
    });
    setConsultarDB(true); //Ponemos a true para que el useEffect lo actualice
  };

  // funcion que revisa que el creador del producto sea el m,ismo que est?? autenticad

  const puedeBorrar = () => {
    if (!usuario) return false;

    if (creador.id === usuario.uid) {
      return true;
    }
  };

  //Elimina un producto de la BBDD
  const eliminarProducto = async () => {
    // Borramos tambi??n im??gen del storage
    const desertRef = ref(storage, urlimagen);
    if (!usuario) {
      return router.push("/login");
    }
    if (creador.id !== usuario.uid) {
      return router.push("/");
    }
    try {
      await deleteDoc(doc(firebase.db, "productos", id));
      deleteObject(desertRef);
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <>
        {error ? (
          <Error404 />
        ) : (
          <div className="contenedor">
            <h1
              css={css`
                text-align: center;
                margin-top: 5rem;
              `}
            >
              {nombre}
            </h1>
            <ContenedorProducto>
              <div>
                {" "}
                <p>
                  Publicado hace{" "}
                  {formatDistanceToNow(new Date(creado), { locale: es })}
                </p>
                <p>
                  Por: {creador.nombre} de {empresa}
                </p>
                <img src={urlimagen} alt="Imagen producto" />
                <p>{descripcion}</p>
                {usuario && (
                  <>
                    <h2>Agrega tu comentario</h2>
                    <form onSubmit={agregarComentario}>
                      <Campo>
                        <input
                          type="text"
                          name="mensaje"
                          onChange={comentarioChange}
                        />
                      </Campo>
                      <InputSubmit type="submit" value="Agregar Comentario" />
                    </form>
                  </>
                )}
                <h2
                  css={css`
                    margin: 2rem 0;
                  `}
                >
                  Comentarios
                </h2>
                {comentarios.length === 0 ? (
                  "A??n no hay comentarios"
                ) : (
                  <ul>
                    {comentarios.map((comentario, i) => (
                      <li
                        key={`${comentario.usuarioId}-${i}`}
                        css={css`
                          border: 1px solid #e1e1e1;
                          padding: 2rem;
                        `}
                      >
                        <p>{comentario.mensaje}</p>
                        <p>
                          Escrito por:{" "}
                          <span
                            css={css`
                              font-weight: bold;
                            `}
                          >
                            {comentario.usuarioNombre}
                          </span>
                        </p>
                        {esCreador(comentario.usuarioId) && (
                          <CreadorProducto>Es Cereador</CreadorProducto>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <aside>
                <Boton target="bank" bgColor="true" href={url}>
                  Visitar URL
                </Boton>

                <div
                  css={css`
                    margin-top: 5rem;
                  `}
                >
                  <p
                    css={css`
                      text-align: center;
                    `}
                  >
                    {votos} Votos
                  </p>
                  {usuario && <Boton onClick={votarProducto}>Votar</Boton>}
                </div>
              </aside>
            </ContenedorProducto>

            {puedeBorrar() && (
              <Boton onClick={eliminarProducto}>Eliminar Producto</Boton>
            )}
          </div>
        )}
      </>
    </Layout>
  );
};

export default Producto;
