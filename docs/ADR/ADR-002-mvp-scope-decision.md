# ADR-002: Decision de alcance de la primera version

## Estado

Aprobada

## Contexto

Intentar cubrir todo el dominio con profundidad equivalente aumentaria el riesgo de construir una solucion inconsistente, dificil de mantener o pobre en sus flujos criticos.

Se requiere decidir entre:

- intentar cubrir muchas funcionalidades superficialmente
- priorizar una primera version con nucleo de negocio solido

## Decision

Se prioriza una primera version centrada en:

- catalogo de productos
- carrito persistido en cliente
- checkout con validacion de stock
- autenticacion basica
- consulta de pedidos propios

El primer entregable implementado se ha centrado en la plataforma base y deja estos flujos funcionales como siguiente capa de desarrollo.

Se dejan fuera de la primera version:

- pagos reales
- social login
- webhooks
- observabilidad avanzada
- arquitectura distribuida
- extras visuales no esenciales

## Justificacion

- el mayor valor tecnico esta en la consistencia del flujo de pedido
- el checkout y la gestion de stock son el punto mas sensible del dominio
- un alcance acotado permite entregar algo funcional, coherente y justificable
- priorizar impacto temprano es mas adecuado que maximizar cobertura superficial

## Consecuencias positivas

- mayor probabilidad de terminar una solucion estable
- mejor calidad en las partes criticas
- roadmap inicial mas claro
- menor riesgo de deuda accidental en etapas tempranas

## Consecuencias negativas

- menor cobertura funcional visible
- algunas capacidades quedan pospuestas a iteraciones posteriores

## Alternativas descartadas

### Cobertura amplia

Se descarta porque aumenta el riesgo de dejar sin resolver correctamente validaciones, ownership o consistencia de stock, que son precisamente los puntos de mayor valor tecnico.

## Evolucion futura

Las siguientes capacidades pueden abordarse en iteraciones posteriores:

1. SSR del catalogo
2. filtros avanzados
3. refinamiento visual
4. funcionalidades accesorias
