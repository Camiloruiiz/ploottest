# ADR-007: Carga inicial desde `.json`

## Estado

Aprobada

## Contexto

La primera version necesita una forma simple de cargar datos iniciales del catalogo sin introducir desde el inicio flujos de administracion, importacion avanzada o herramientas de backoffice.

Las opciones consideradas son:

- carga inicial desde archivos `.json`
- alta manual directa en base de datos
- construir desde el inicio un flujo de importacion mas completo

## Decision

Se adopta una carga inicial de productos desde archivos `.json`.

## Justificacion

- reduce friccion de arranque
- acelera la disponibilidad de un catalogo funcional
- evita introducir complejidad administrativa antes de tiempo
- encaja con el objetivo de tener una primera version desplegada cuanto antes

## Consecuencias positivas

- arranque mas rapido del sistema
- menor complejidad operativa inicial
- facilita pruebas funcionales del catalogo y checkout

## Consecuencias negativas

- no resuelve necesidades futuras de administracion de catalogo
- requiere una evolucion posterior si cambia la estrategia de carga de datos

## Alternativas descartadas

### Alta manual en base de datos

Se descarta porque añade trabajo operativo repetitivo y no deja una fuente simple de datos iniciales reutilizable.

### Flujo de importacion completo

Se descarta en la primera version porque añade complejidad que no aporta valor inmediato al objetivo de tener una aplicacion funcional desplegada.

## Revision futura

Revisar esta decision cuando el producto necesite administracion de catalogo, importaciones recurrentes o integracion con fuentes externas.
