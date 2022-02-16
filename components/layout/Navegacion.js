import React, { useContext } from "react";
import Link from "next/link";
import styled from "@emotion/styled";
import { FirebaseContext } from "../../firebase";
import { css } from "@emotion/core";

const Nav = styled.nav`
  padding-left: 2rem;

  a {
    font-size: 1.8rem;
    margin-left: 2rem;
    color: var(--gris2);
    font-family: "PT Sans", sans-serif;

    &:last-of-type {
      margin-right: 0;
    }
  }
`;
function Navegacion() {
  const { usuario } = useContext(FirebaseContext);
  return (
    <div>
      <Nav>
        <Link href="/">
          <a>Inicio</a>
        </Link>
        <Link href="/populares">
          <a>Populares</a>
        </Link>
        {usuario && (
          <Link href="/nuevo-producto">
            <a
              css={css`
                display: inline-block;
                &:hover {
                  cursor: pointer;
                }
              `}
            >
              Nuevo Producto
            </a>
          </Link>
        )}
      </Nav>
    </div>
  );
}

export default Navegacion;
