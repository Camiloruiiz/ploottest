# language: es
Característica: Regresion visual

  Como equipo de desarrollo
  Quiero comparar snapshots visuales
  Para detectar cambios no intencionales en la interfaz

  Escenario: Comparar vista del catalogo
    Dado que existe una referencia visual aprobada del catalogo
    Cuando se ejecuta la comparacion visual
    Entonces cualquier cambio no esperado debe marcarse como regresion

  Escenario: Comparar vista del carrito
    Dado que existe una referencia visual aprobada del carrito
    Cuando se ejecuta la comparacion visual
    Entonces cualquier cambio no esperado debe marcarse como regresion

  Escenario: Comparar vista del checkout
    Dado que existe una referencia visual aprobada del checkout
    Cuando se ejecuta la comparacion visual
    Entonces cualquier cambio no esperado debe marcarse como regresion
