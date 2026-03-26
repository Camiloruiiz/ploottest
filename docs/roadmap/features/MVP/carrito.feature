# language: es
Característica: Carrito de compras

  Como cliente
  Quiero gestionar un carrito de compras
  Para preparar un pedido antes del checkout

  Escenario: Anadir un producto al carrito
    Dado que estoy viendo un producto disponible
    Cuando lo anado al carrito
    Entonces el producto debe aparecer en el resumen del carrito

  Escenario: Actualizar la cantidad de un producto
    Dado que tengo un producto en el carrito
    Cuando modifico su cantidad
    Entonces el resumen del carrito debe reflejar la nueva cantidad y el nuevo total

  Escenario: Persistir carrito en el navegador
    Dado que tengo productos en el carrito
    Cuando cierro y vuelvo a abrir la aplicacion
    Entonces el carrito debe conservar su contenido
