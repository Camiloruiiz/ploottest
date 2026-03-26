# ADR-009: Adopcion de monorepo con workspace

## Estado

Aprobada

## Contexto

El proyecto comenzo como una unica aplicacion organizada desde la raiz del repositorio. Con la evolucion de la base de codigo, la necesidad de compartir configuracion y la conveniencia de preparar el crecimiento futuro, el repositorio paso a organizarse como workspace.

Actualmente ya existe una estructura real basada en:

- `pnpm` como gestor del workspace
- `Turborepo` para orquestacion de tareas
- `apps/web` como aplicacion principal
- `packages/*` para configuracion compartida

La decision ya no es si mantener un repositorio simple en la raiz, sino como formalizar la estructura que el proyecto ya adopto.

Las opciones consideradas son:

- mantener una sola app en la raiz del repositorio
- adoptar un monorepo ligero con una app principal y paquetes compartidos

## Decision

Se adopta un monorepo ligero con workspace.

La aplicacion principal permanece en `apps/web`, mientras que `packages/*` se utiliza para configuracion y reutilizacion compartida.

## Justificacion

- refleja el estado real actual del proyecto
- separa con mas claridad aplicacion y configuraciones compartidas
- facilita crecimiento del repositorio sin mezclar todo en la raiz
- permite orquestar desarrollo, build, testing y validaciones desde un punto comun
- deja abierta la incorporacion futura de nuevas apps, paquetes o herramientas internas

## Consecuencias positivas

- estructura mas escalable del repositorio
- mejor reutilizacion de configuraciones comunes
- automatizacion mas consistente desde la raiz
- mejor base para crecimiento gradual sin cambiar el despliegue actual

## Consecuencias negativas

- mayor complejidad estructural que una unica app en raiz
- mas coste de mantenimiento del workspace
- curva de entrada algo mayor para nuevos contribuidores

## Alternativas descartadas

### Mantener una sola app en la raiz

Se descarta porque ya no representa el estado actual del proyecto y dificulta separar configuracion compartida, tooling y crecimiento futuro del repositorio.

## Relacion con ADRs previos

Esta decision supercede `ADR-001`, que documentaba una etapa anterior del proyecto basada en una estructura mas simple del repositorio.

No implica una arquitectura distribuida ni microservicios. El sistema sigue desplegandose principalmente como una sola aplicacion web, aunque el codigo ahora se organice como monorepo.

## Revision futura

Revisar esta decision si:

- el numero de apps o paquetes no justifica la complejidad adicional
- aparecen necesidades de ownership mas fuerte por dominio
- el workspace requiere una segmentacion mas avanzada entre aplicaciones, paquetes o servicios
