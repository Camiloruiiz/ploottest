# language: es
Característica: Autenticacion

  Como usuario
  Quiero autenticarme en el sistema
  Para acceder a las funcionalidades protegidas

  Escenario: Iniciar sesion correctamente
    Dado que dispongo de credenciales validas
    Cuando inicio sesion
    Entonces debo acceder a las funcionalidades autenticadas

  Escenario: Impedir checkout sin autenticacion
    Dado que no he iniciado sesion
    Cuando intento confirmar una compra
    Entonces el sistema debe solicitar autenticacion
