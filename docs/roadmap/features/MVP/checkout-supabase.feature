# language: es
Característica: Checkout real con Supabase

  Como cliente autenticado
  Quiero confirmar mi compra contra la base de datos real
  Para crear pedidos persistentes y consistentes en el sistema

  Escenario: Crear pedido real con stock disponible
    Dado que estoy autenticado con Supabase
    Y que mi carrito contiene productos con stock suficiente
    Cuando confirmo el checkout
    Entonces se debe crear un pedido en la tabla `orders`
    Y se deben crear sus lineas en `order_items`
    Y el stock de los productos debe decrementarse correctamente

  Escenario: Rechazar checkout sin autenticacion
    Dado que no estoy autenticado
    Cuando intento confirmar una compra
    Entonces el sistema debe rechazar la operacion
    Y debe devolver un error de autenticacion

  Escenario: Rechazar checkout por stock insuficiente
    Dado que estoy autenticado con Supabase
    Y que al menos un producto de mi carrito no tiene stock suficiente
    Cuando confirmo el checkout
    Entonces no se debe crear el pedido
    Y debo recibir un error estructurado de stock insuficiente
