# language: es
Característica: Testing base del MVP

  Como equipo de desarrollo
  Quiero una base de testing automatizada
  Para validar el boilerplate antes de construir funcionalidades adicionales

  Escenario: Ejecutar unit tests base
    Dado que existe un boilerplate funcional del sistema
    Cuando se ejecutan los unit tests base
    Entonces la validacion del proyecto debe completarse correctamente

  Escenario: Ejecutar pruebas E2E del entorno base
    Dado que la aplicacion esta configurada
    Cuando se ejecutan pruebas Playwright sobre el entorno base
    Entonces debe validarse que la aplicacion responde correctamente

  Escenario: Verificar despliegue con pruebas basicas
    Dado que la aplicacion esta desplegada en Vercel
    Cuando se ejecutan validaciones basicas sobre el entorno publicado
    Entonces el despliegue debe considerarse operativo

