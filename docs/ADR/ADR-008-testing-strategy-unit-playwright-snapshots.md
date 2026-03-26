# ADR-008: Estrategia de testing

## Estado

Aprobada

## Contexto

La solucion necesita un nivel basico de confianza para evolucionar con rapidez sin introducir regresiones funcionales o visuales. El sistema combina UI, logica de negocio y flujos criticos de compra, por lo que una unica capa de pruebas no es suficiente.

Las opciones consideradas son:

- unit tests + Playwright E2E + snapshots visuales
- solo unit tests
- solo E2E

## Decision

Se adopta una estrategia de testing basada en:

- unit tests para logica y componentes
- Playwright E2E para flujos criticos
- snapshots visuales para regresiones de interfaz

## Justificacion

- reduce regresiones
- aumenta confianza en cambios y refactors
- da senales rapidas antes de desplegar
- permite cubrir tanto el boilerplate del MVP como los flujos funcionales posteriores

## Consecuencias positivas

- mayor confianza en cambios
- mejor cobertura de flujos relevantes
- deteccion temprana de regresiones visuales y funcionales

## Consecuencias negativas

- se anaden suites de pruebas y tiempo de mantenimiento
- los snapshots requieren revision disciplinada
- cambios visuales intencionales deben aprobarse de forma explicita

## Alcance

- MVP: stack base, integracion inicial y despliegue
- paraImplementar: catalogo, carrito, checkout, autenticacion y pedidos

## Revision futura

Revisar esta estrategia si el sistema requiere una piramide de testing mas profunda o herramientas visuales especializadas.

