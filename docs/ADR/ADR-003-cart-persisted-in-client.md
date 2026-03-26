# ADR-003: Carrito persistido en cliente

## Estado

Aprobada

## Contexto

El sistema necesita ofrecer una experiencia de carrito funcional con una implementacion simple y una complejidad operativa baja. La decision principal es donde persistir ese estado temporal antes del checkout.

Las opciones consideradas son:

- carrito persistido en cliente
- carrito persistido en servidor

## Decision

Se persiste el carrito en cliente mediante `localStorage`.

## Justificacion

- reduce complejidad de backend y modelo de datos
- acelera la implementacion del flujo principal
- evita introducir una entidad adicional para un estado temporal
- es suficiente para una primera version centrada en catalogo y checkout
- permite reservar el esfuerzo de backend para el punto realmente critico: la creacion consistente del pedido
- evita mezclar el problema del carrito con la persistencia principal gestionada por Supabase

## Consecuencias positivas

- menor tiempo de desarrollo
- menos endpoints y reglas de sincronizacion
- UX suficiente para una primera version
- independencia del carrito respecto a la sesion hasta el momento de compra

## Consecuencias negativas

- el carrito no se comparte entre dispositivos
- el estado puede perderse si el usuario limpia almacenamiento local
- requiere cuidado en hidratacion y acceso desde entorno cliente

## Alternativas descartadas

### Carrito persistido en servidor

Se descarta en esta iteracion porque introduce mas complejidad de modelo, autenticacion y sincronizacion de estado de la que aporta al alcance actual. Es una opcion valida para una version mas madura del producto.

## Revision futura

Revisar esta decision si el producto necesita:

- sincronizacion multi-dispositivo
- recuperacion de carrito entre sesiones
- analitica o reglas avanzadas sobre abandono de carrito
