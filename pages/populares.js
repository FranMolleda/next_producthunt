import React from "react";
import Layout from "../components/layout/Layout";
import DetallesProducto from "../components/layout/DetallesProducto";
import useProductos from "../hooks/useProductos";

export default function Populares() {
  /*   const [productos, setProductos] = useState([]);
  const [todosproductos, setTodosProductos] = useState([]);

  const { firebase } = useContext(FirebaseContext);

  const { db } = firebase;

  useEffect(() => {
    const obtenerProductos = async () => {
      let product = [];
      const q = query(collection(db, "productos"), orderBy("votos", "desc"));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        product.push({ ...doc.data() });
      });
      setProductos(product);
    };
    obtenerProductos();
  }, []); */

  const { productos } = useProductos("votos");
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
