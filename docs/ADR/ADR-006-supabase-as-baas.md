# ADR-006: Supabase como BaaS

## Estado

Aprobada

## Contexto

La solucion necesita autenticacion, base de datos relacional y una integracion sencilla con una aplicacion Next.js desplegada en Vercel. El objetivo es reducir complejidad operativa y acelerar la construccion de la primera version sin renunciar a un modelo relacional adecuado para productos, pedidos y stock.

Las opciones consideradas son:

- Supabase como BaaS
- backend y base de datos gestionados de forma separada
- otras plataformas BaaS con menor encaje en el modelo relacional planteado

## Decision

Se adopta Supabase como plataforma BaaS para autenticacion y persistencia.

## Justificacion

- proporciona autenticacion y PostgreSQL en una misma plataforma
- reduce el esfuerzo de infraestructura y configuracion inicial
- encaja bien con el modelo de datos relacional del dominio
- simplifica la integracion con Next.js y despliegue en Vercel
- permite apoyar la logica critica de stock sobre capacidades nativas de PostgreSQL
- en la primera version no se utiliza para sincronizar el carrito del cliente

## Consecuencias positivas

- menor complejidad operativa
- integracion mas directa entre autenticacion y datos
- acceso a una base relacional solida para pedidos e inventario
- buena base para evolucionar reglas de seguridad y acceso

## Consecuencias negativas

- dependencia de plataforma
- parte del diseño queda condicionado por las capacidades y convenciones de Supabase
- una migracion futura a otra solucion implicaria coste tecnico

## Alternativas descartadas

### Backend y base de datos gestionados por separado

Se descarta en esta etapa porque introduce mas piezas operativas, mas configuracion y mayor friccion de integracion sin aportar una ventaja clara para el alcance actual.

### Otras plataformas BaaS

Se descartan porque no ofrecen una ventaja decisiva frente a Supabase para un dominio que depende de relaciones claras entre productos, pedidos y stock.

## Revision futura

Revisar esta decision si cambian de forma significativa los requisitos de coste, portabilidad, control operativo o capacidades avanzadas de base de datos.
