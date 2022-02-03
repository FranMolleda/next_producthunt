import React from "react";
import Link from "next/link";
import Buscar from "../ui/Buscar";
import Navegacion from "./Navegacion";

function Header() {
  return (
    <header>
      <div>
        <div>
          <p>P</p>

          <Buscar />

          <Navegacion />
        </div>
        <div>
          <p>Hola Fran</p>
          <button type="button">Cerrar Sesión</button>

          <Link href="/">
            <a>Login</a>
          </Link>
          <Link href="/">
            <a>Crear Cuenta</a>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
