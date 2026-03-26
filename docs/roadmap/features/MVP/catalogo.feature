# language: es
Característica: Catalogo de productos

  Como cliente
  Quiero explorar el catalogo de productos
  Para encontrar articulos disponibles para compra

  Escenario: Ver listado de productos
    Dado que existen productos disponibles en el sistema
    Cuando accedo al catalogo
    Entonces debo ver un listado paginado de productos

  Escenario: Buscar productos por nombre
    Dado que estoy en el catalogo
    Cuando busco un termino valido
    Entonces debo ver solo los productos que coinciden con la busqueda

  Escenario: Aplicar filtros basicos
    Dado que estoy en el catalogo
    Cuando aplico un filtro disponible
    Entonces debo ver resultados ajustados al criterio aplicado
