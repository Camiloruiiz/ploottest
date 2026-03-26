# language: es
Característica: Testing del flujo real con Supabase

  Como equipo de desarrollo
  Quiero validar el flujo autenticado sobre Supabase real
  Para asegurar que el sistema no depende del modo demo en los recorridos criticos

  Escenario: Validar checkout real autenticado
    Dado que existe un usuario autenticado contra Supabase
    Y que el esquema real de base de datos esta aplicado
    Cuando se ejecuta el flujo de compra
    Entonces deben validarse autenticacion, checkout persistente y descuento de stock real

  Escenario: Validar historial real de pedidos
    Dado que un usuario tiene pedidos persistidos en Supabase
    Cuando consulta su historial
    Entonces solo deben devolverse sus pedidos reales
