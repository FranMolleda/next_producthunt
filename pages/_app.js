import App from "next/app";
import firebase, { FirebaseContext } from "../firebase";
import useAutenticacion from "../hooks/useAutenticacion";

const MyApp = ({ Component, pageProps }) => {
  const usuario = useAutenticacion();
  console.log(usuario);

  return (
    <FirebaseContext.Provider
      value={{
        firebase,
      }}
    >
      <Component {...pageProps} />
    </FirebaseContext.Provider>
  );
};

export default MyApp;
