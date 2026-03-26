# language: es
Característica: Despliegue operativo en Vercel

  Como equipo de desarrollo
  Quiero validar el entorno publicado
  Para confirmar que el MVP funciona correctamente fuera del entorno local

  Escenario: Verificar despliegue publico
    Dado que el MVP ya esta implementado
    Cuando se publica en Vercel con sus variables de entorno
    Entonces la aplicacion debe responder correctamente en un entorno accesible

  Escenario: Ejecutar validaciones basicas sobre produccion
    Dado que existe un despliegue publico operativo
    Cuando se ejecutan comprobaciones basicas
    Entonces el entorno publicado debe considerarse listo para uso operativo
