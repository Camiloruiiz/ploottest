# language: es
Característica: Pipeline con Turborepo

  Como equipo de desarrollo
  Quiero orquestar tareas del workspace desde la raiz
  Para ejecutar desarrollo, build y testing con una capa comun de automatizacion

  Escenario: Ejecutar tareas del monorepo
    Dado que existen paquetes y aplicaciones dentro del workspace
    Cuando se lanzan comandos desde la raiz
    Entonces `Turborepo` debe coordinar `dev`, `build`, `lint`, `typecheck` y `test`
