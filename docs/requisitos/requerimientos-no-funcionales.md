# Requerimientos No Funcionales

## RNF-001 Consistencia de datos

La creacion de pedidos no debe producir decrementos de stock inconsistentes ni pedidos confirmados sin disponibilidad valida.

## RNF-002 Seguridad de acceso

Las operaciones sobre pedidos deben requerir autenticacion y validacion de propiedad del recurso.

## RNF-003 Validacion de entradas

Las entradas a la API deben validarse antes de ejecutar logica de negocio.

## RNF-004 Mantenibilidad

La solucion debe ser comprensible y permitir evolucion posterior sin refactorizaciones estructurales mayores inmediatas.

## RNF-005 Simplicidad operativa

La arquitectura debe minimizar el numero de piezas de infraestructura necesarias para operar la solucion.

## RNF-006 Rendimiento del catalogo

La consulta de catalogo debe soportar busqueda y paginacion con tiempos de respuesta razonables para una primera version del producto.

## RNF-007 Persistencia local del carrito

El carrito debe mantenerse disponible entre sesiones del navegador sin requerir sincronizacion con backend.

## RNF-008 Observabilidad basica

Los errores relevantes del sistema deben poder identificarse y diagnosticarse mediante logs o respuestas estructuradas.

## RNF-009 Escalabilidad evolutiva

La solucion debe permitir evolucion posterior sin rehacer el dominio principal ni el flujo de compra.

## RNF-010 Compatibilidad de despliegue

La solucion debe ser compatible con despliegue en Vercel e integracion con Supabase.

## RNF-011 Integridad historica

Los pedidos deben preservar el precio aplicado al momento de compra aunque el producto cambie posteriormente.

## RNF-012 Experiencia de usuario basica

La interfaz debe ofrecer navegacion clara, estados de carga y mensajes de error entendibles.

## RNF-013 Tipado y contratos

La base de codigo debe aprovechar TypeScript para reducir errores de integracion entre frontend, API y acceso a datos.

## RNF-014 Disponibilidad funcional

La aplicacion debe mantener disponibles las capacidades esenciales del flujo de compra:

- catalogo
- carrito
- checkout
- consulta de pedidos

## RNF-015 Escalado x100

Si el volumen de uso creciera de forma significativa, la solucion debe poder evolucionar mediante medidas como:

- cache del catalogo
- read replicas
- desacoplamiento de procesamiento de pedidos
- observabilidad con logs y trazas
- separacion progresiva de responsabilidades
- CDN para assets

## RNF-016 Estrategia de testing

La solucion debe contar con una estrategia de testing automatizada basada en unit tests, pruebas E2E y comparaciones visuales.

## RNF-017 Cobertura de flujos criticos

Los flujos criticos del sistema deben poder validarse mediante pruebas automatizadas antes del despliegue.

## RNF-018 Regresion visual controlada

La interfaz debe poder validarse mediante snapshots visuales para detectar cambios no intencionales en componentes y pantallas clave.
