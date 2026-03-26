# ADR-005: Estrategia de desarrollo por fases

## Estado

Aprobada

## Contexto

El sistema combina varios dominios relacionados: catalogo, carrito, checkout, autenticacion y pedidos. Para reducir riesgo y acelerar la estabilizacion del flujo principal, es necesario establecer una estrategia de desarrollo incremental.

Las opciones consideradas son:

- desarrollo por fases incrementales
- desarrollo paralelo de todas las capacidades

## Decision

Se adopta una estrategia de desarrollo por fases, priorizando primero la base de datos, la API y el flujo de checkout antes de ampliar capacidades accesorias.

## Justificacion

- reduce riesgo tecnico en el flujo de mayor criticidad
- permite validar pronto el modelo de datos y los contratos de API
- facilita detectar antes problemas de consistencia de stock y ownership
- mejora la trazabilidad del avance funcional

## Fases

1. base del dominio y modelo de datos
2. API de productos y pedidos
3. catalogo y carrito
4. checkout y validacion de stock
5. autenticacion y area privada de pedidos
6. endurecimiento, documentacion y despliegue

## Consecuencias positivas

- orden claro de implementacion
- menor riesgo de retrabajo en capas superiores
- mejor alineacion entre arquitectura y entregables funcionales

## Consecuencias negativas

- algunas mejoras de interfaz pueden quedar diferidas
- ciertas optimizaciones solo aparecen en fases posteriores

## Alternativas descartadas

### Desarrollo paralelo de todas las capacidades

Se descarta porque aumenta la dispersion del esfuerzo y dificulta estabilizar primero el dominio critico de pedidos y stock.

## Revision futura

Revisar esta decision si el producto incorpora mas equipos o necesita paralelizar multiples lineas de trabajo de forma sostenida.

