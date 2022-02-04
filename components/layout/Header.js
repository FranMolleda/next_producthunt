import React from "react";
import Link from "next/link";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import Buscar from "../ui/Buscar";
import Navegacion from "./Navegacion";
import Boton from "../ui/Boton";

const ContenedorHeader = styled.div`
  max-width: 1200px;
  width: 95%;
  margin: 0 auto;
  @media (min-width: 768px) {
    display: flex;
    justify-content: space-between;
  }
`;

const Logo = styled.p`
  color: var(--naranja);
  font-size: 4rem;
  line-height: 0;
  font-weight: 700;
  font-family: "Roboto Slab" serif;
  margin-right: 2rem;
`;

function Header() {
  return (
    <header
      css={css`
        border-bottom: 2px solid var(--gris3);
        padding: 1rem 0;
      `}
    >
      <ContenedorHeader>
        <div>
          <Link href="/">
            <a>
              <Logo>P</Logo>
            </a>
          </Link>

          <Buscar />

          <Navegacion />
        </div>
        <div>
          <p>Hola Fran</p>
          <Boton bgColor="true" type="button">
            Cerrar Sesión
          </Boton>

          <Link href="/">
            <Boton bgColor="true">Login</Boton>
          </Link>
          <Link href="/">
            <Boton>Crear Cuenta</Boton>
          </Link>
        </div>
      </ContenedorHeader>
    </header>
  );
}

export default Header;