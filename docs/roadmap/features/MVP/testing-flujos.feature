# language: es
Característica: Testing de flujos criticos

  Como equipo de desarrollo
  Quiero validar los flujos principales del sistema
  Para reducir regresiones funcionales

  Escenario: Validar flujo de catalogo
    Dado que el catalogo esta disponible
    Cuando se ejecuta la suite E2E del catalogo
    Entonces deben validarse carga, busqueda y paginacion

  Escenario: Validar flujo de checkout autenticado
    Dado que existe un usuario autenticado y productos disponibles
    Cuando se ejecuta la suite E2E del checkout
    Entonces debe validarse la creacion correcta del pedido

  Escenario: Validar consulta de pedidos propios
    Dado que un usuario tiene pedidos registrados
    Cuando se ejecuta la suite E2E del historial
    Entonces solo deben mostrarse sus pedidos
