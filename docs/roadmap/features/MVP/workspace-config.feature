# language: es
Característica: Configuracion compartida del workspace

  Como equipo de desarrollo
  Quiero compartir configuraciones base
  Para evitar duplicacion entre paquetes y dejar preparado el crecimiento del monorepo

  Escenario: Reutilizar configuraciones comunes
    Dado que la aplicacion principal consume TypeScript y ESLint
    Cuando se organiza el workspace
    Entonces deben existir paquetes de configuracion compartida reutilizables
