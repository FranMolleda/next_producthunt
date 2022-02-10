export default function validarCrearCuenta(valores) {
  let errores = {};

  // Validar el nombre de usuario
  if (!valores.nombre) {
    errores.nombre = "El Nombre es obligatorio";
  }

  // Validar empresa
  if (!valores.empresa) {
    errores.empresa = "Nombre de Empresa es obligatoiro";
  }

  // Validar url
  if (!valores.url) {
    errores.url = "La URL del producto es obligatoria";
  } else if (!/^(ftp|http|https):\/\/[^ "]+$/.test(valores.url)) {
    errores.url = "URL mal formateada o no válida";
  }

  // Validar el descripción
  if (!valores.descripcion) {
    errores.descripcion = "Agrega una descripción de tu producto";
  }

  return errores;
}
