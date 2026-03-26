# language: es
Característica: Monorepo con pnpm

  Como equipo de desarrollo
  Quiero reorganizar el repositorio como workspace
  Para escalar la base de codigo sin mantener toda la aplicacion en la raiz

  Escenario: Mover la app principal a apps/web
    Dado que el proyecto ha evolucionado mas alla del boilerplate inicial
    Cuando se ejecuta la migracion a monorepo
    Entonces la aplicacion principal debe vivir en `apps/web`
    Y `pnpm` debe pasar a ser el gestor principal del workspace
