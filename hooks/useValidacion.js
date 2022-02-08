import React, { useState, useEffect } from "react";

const useValidacion = (stateInicial, validar, fn) => {
  const [valores, setValores] = useState(stateInicial);
  const [errores, setErrores] = useState({});
  const [submitform, setSubmitForm] = useState(false);

  useEffect(() => {
    if (submitform) {
      const noErrores = Object.keys(errores).length === 0;

      if (noErrores) {
        fn(); //fn = finción que se ejecuta en el componente
      }
      setSubmitForm(false);
    }
  }, [errores]);

  //Función que se ejecuta conforme el usuario va escribiendo
  const handleChange = (e) => {
    setValores({
      ...valores,
      [e.target.name]: e.target.value,
    });
  };

  //Función que se ejecuta cuando el usuario hace submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const erroresValidacion = validar(valores);
    setErrores(erroresValidacion);
    setSubmitForm(true);
  };

  //Chequea al pinchar o salirte de un input
  const handleBlur = () => {
    const erroresValidacion = validar(valores);
    setErrores(erroresValidacion);
  };

  return {
    valores,
    errores,
    submitform,
    handleChange,
    handleSubmit,
    handleBlur,
  };
};

export default useValidacion;
