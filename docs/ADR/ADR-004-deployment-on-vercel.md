# ADR-004: Despliegue sobre Vercel

## Estado

Aprobada

## Contexto

La aplicacion se basa en Next.js y necesita una plataforma de despliegue sencilla, con bajo coste operativo y buena integracion con el framework elegido. La solucion tambien depende de Supabase como servicio externo para autenticacion y persistencia.

Las opciones consideradas son:

- despliegue sobre Vercel
- despliegue sobre infraestructura propia o proveedores mas generales

## Decision

Se despliega la aplicacion sobre Vercel.

## Justificacion

- integracion nativa con Next.js
- despliegue simple para frontend y endpoints en una unica plataforma
- buena experiencia para variables de entorno y previews
- menor esfuerzo operativo para una primera version del producto

## Consecuencias positivas

- pipeline de despliegue mas simple
- menor complejidad de infraestructura
- soporte natural para la arquitectura elegida
- facilidad para entornos de preview y validacion de cambios

## Consecuencias negativas

- dependencia de plataforma
- algunas restricciones del modelo serverless pueden aparecer con cargas mayores
- ciertas optimizaciones avanzadas pueden requerir ajustes especificos de plataforma

## Alternativas descartadas

### Infraestructura propia o proveedores mas generales

Se descarta en esta etapa porque introduce mas decisiones operativas, configuracion y mantenimiento sin una necesidad clara para el alcance actual.

## Revision futura

Revisar esta decision si cambian significativamente los requisitos de coste, rendimiento, networking o control operativo.
