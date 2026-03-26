# ADR-001: Monolito vs monolito modular

## Estado

Supercedida

## Contexto

La solucion integra interfaz, API, autenticacion y persistencia en una sola base de codigo. Dentro de ese contexto, la decision no es si distribuir el sistema en multiples aplicaciones, sino como organizar internamente el proyecto para mantener simplicidad operativa sin perder claridad.

Las opciones consideradas son:

- monolito simple
- monolito modular

## Decision

Se adopta un monolito simple.

## Justificacion

- reduce al minimo la complejidad estructural inicial
- permite avanzar mas rapido sobre la primera version
- evita invertir tiempo temprano en fronteras internas que todavia no son necesarias
- favorece iteracion rapida entre UI, API y logica de negocio
- mantiene abierta una evolucion posterior hacia una modularizacion mas clara si el sistema crece

## Consecuencias positivas

- mayor velocidad de implementacion inicial
- menor coste de coordinacion entre capas
- menos friccion para ajustar contratos y flujos iniciales
- estructura suficiente para una primera version funcional

## Consecuencias negativas

- mayor riesgo de mezcla entre responsabilidades si el codigo crece sin control
- peor separacion de dominios que en un monolito modular
- puede requerir refactor posterior para mejorar mantenibilidad

## Alternativas descartadas

### Monolito modular

Se descarta en esta etapa porque añade una estructura mas estricta y decisiones de separacion que no aportan suficiente valor inmediato para la velocidad requerida por la primera version. Sigue siendo una evolucion razonable cuando el dominio y el equipo crezcan.

## Revision futura

Revisar esta decision si el sistema crece en complejidad funcional, aparecen mas contribuidores o el acoplamiento interno empieza a penalizar mantenibilidad. En ese escenario, el siguiente paso natural seria evolucionar hacia un monolito modular.

## Supercedida por

- `ADR-009-monorepo-workspace-adoption.md`
