import React, { useEffect, useContext, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../../components/layout/Layout";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { es } from "date-fns/locale";
import { FirebaseContext } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
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

const Producto = () => {
  //State del componenteç

  const [producto, setProducto] = useState({});
  const [error, setError] = useState(false);
  //Routing para obtener el id actual
  const router = useRouter();
  const {
    query: { id },
  } = router;
  /* Esto es lo mismo que esto:const id = router.query.id; */

  // context de firebase
  const { firebase, usuario } = useContext(FirebaseContext);
  useEffect(() => {
    if (id) {
      const obtenerProducto = async () => {
        const productoQuery = doc(firebase.db, "productos", id);
        const producto = await getDoc(productoQuery);

        if (producto.exists()) {
          setProducto(producto.data());
        } else {
          setError(true);
          console.log("No such document!");
        }
      };
      obtenerProducto();
    }
  }, [id]);

  if (Object.keys(producto).length === 0) return "Cargando...";

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
  } = producto;

  //Administrar y validar los votos
  const votarProducto = () => {
    if (!usuario) {
      return router.push("/login");
    }
    //obtener y sumar un nuevo voto
    const nuevoTotal = votos + 1;

    //Actualizar en la BDD
    doc(firebase.db, "productos", id).update({ votos: nuevoTotal });

    //Actualizar el state
    setProducto({
      ...producto,
      votos: nuevoTotal,
    });
  };
  return (
    <Layout>
      <>
        {error && <Error404 />}
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
                  <form>
                    <Campo>
                      <input type="text" name="mensaje" />
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
              {comentarios.map((comentario) => (
                <li key={id}>
                  <p>{comentario.nombre}</p>
                  <p>Escrito por: {comentario.usuarioNombre}</p>
                </li>
              ))}
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
        </div>
      </>
    </Layout>
  );
};

export default Producto;
