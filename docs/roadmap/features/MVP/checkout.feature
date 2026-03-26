# language: es
Característica: Checkout

  Como cliente autenticado
  Quiero confirmar mi compra
  Para generar un pedido valido en el sistema

  Escenario: Crear pedido con stock disponible
    Dado que estoy autenticado
    Y que mi carrito contiene productos con stock suficiente
    Cuando confirmo el checkout
    Entonces se debe crear un pedido con sus lineas asociadas
    Y el stock debe decrementarse correctamente

  Escenario: Rechazar checkout por stock insuficiente
    Dado que estoy autenticado
    Y que al menos un producto de mi carrito no tiene stock suficiente
    Cuando confirmo el checkout
    Entonces no se debe crear el pedido
    Y debo recibir un error de stock insuficiente
