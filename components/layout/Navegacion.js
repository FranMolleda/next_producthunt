import React from "react";
import Link from "next/link";

function Navegacion() {
  return (
    <div>
      <nav>
        <Link href="/">
          <a>Inicio</a>
        </Link>
        <Link href="/">
          <a>Populares</a>
        </Link>
        <Link href="/">
          <a>Nuevo Producto</a>
        </Link>
      </nav>
    </div>
  );
}

export default Navegacion;
