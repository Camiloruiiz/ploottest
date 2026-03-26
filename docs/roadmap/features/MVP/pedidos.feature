# language: es
Característica: Consulta de pedidos

  Como usuario autenticado
  Quiero consultar mis pedidos
  Para revisar mi historico de compras

  Escenario: Ver pedidos propios
    Dado que estoy autenticado
    Y que tengo pedidos registrados
    Cuando accedo a mi historial
    Entonces debo ver un listado de mis pedidos

  Escenario: Impedir acceso a pedidos ajenos
    Dado que estoy autenticado
    Cuando intento acceder a un pedido de otro usuario
    Entonces el sistema debe denegar el acceso
