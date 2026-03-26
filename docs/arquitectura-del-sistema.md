# Arquitectura del Sistema

## 1. Introduccion y objetivos

### 1.1 Proposito

Este documento describe la arquitectura del estado actual del sistema y su siguiente fase funcional. Hoy el proyecto ya cuenta con una base tecnica ejecutable: app Next.js operativa, integracion con Supabase, bootstrap desde `.json`, contratos validados y testing base. La siguiente fase se centra en completar el dominio funcional de catalogo, carrito, checkout y pedidos.

Decision de velocidad:

- `localStorage` se usa para el carrito y el estado temporal del cliente
- `Supabase` se usa para autenticacion, productos y pedidos persistentes

### 1.2 Alcance

Estado actual implementado:

- app Next.js operativa con pantalla base
- validacion de variables de entorno
- clientes de Supabase para navegador, servidor y admin
- carga inicial de productos desde archivos `.json`
- esquema SQL base para productos, pedidos y lineas
- contratos Zod compartidos
- helpers HTTP compartidos
- testing base con Vitest, Playwright y snapshot visual

Siguiente alcance funcional:

- catalogo de productos
- carrito persistido en cliente
- checkout con validacion de stock
- autenticacion de usuarios
- consulta de pedidos propios
- API minima para productos y pedidos
- despliegue operativo en Vercel si no se ha ejecutado ya en entorno objetivo

Requerimientos relacionados:

- RF-001
- RF-002
- RF-005
- RF-006
- RF-007
- RF-008
- RF-009
- RF-011
- RF-014
- RF-015
- RF-016
- RF-019

Quedan fuera del alcance inicial:

- pagos reales
- social login
- webhooks
- observabilidad avanzada
- arquitectura distribuida

Como evolucion posterior, el sistema contempla una ruta de escalado para soportar mayor volumen de uso sin formar parte del alcance base.

Documentos de referencia:

- `docs/requisitos/requerimientos-funcionales.md`
- `docs/requisitos/requerimientos-no-funcionales.md`

### 1.3 Objetivos de calidad

| Prioridad | Meta de calidad | Escenario concreto |
| --- | --- | --- |
| Alta | Consistencia de datos | un checkout concurrente no debe generar stock negativo ni pedidos incompletos |
| Alta | Seguridad de acceso | un usuario autenticado no puede consultar pedidos ajenos |
| Alta | Simplicidad operativa | la aplicacion debe poder desplegarse en Vercel con Supabase como unico servicio externo principal |
| Media | Validacion de contratos | payloads invalidos deben fallar antes de ejecutar logica de negocio |
| Media | Confianza en cambios | pruebas automatizadas deben detectar regresiones funcionales y visuales antes del despliegue |

### 1.4 Stakeholders

| Stakeholder | Interes | Expectativa sobre la arquitectura |
| --- | --- | --- |
| Usuario final | comprar de forma sencilla y fiable | catalogo rapido, checkout estable y acceso a sus pedidos |
| Equipo de desarrollo | entregar y mantener la solucion | base simple, decisiones explicitas y testing suficiente para cambiar con confianza |
| Negocio y operaciones | poner el producto en marcha rapido | despliegue simple en Vercel, bajo coste operativo y evolucion progresiva |

## 2. Restricciones de arquitectura

- una sola base de codigo
- frontend y backend en el mismo repositorio
- frontend implementado con React
- framework principal basado en Next.js App Router
- libreria de componentes basada en shadcn/ui
- stack principal basado en TypeScript
- integracion con Supabase para autenticacion y persistencia
- despliegue principal sobre Vercel
- prioridad a simplicidad operativa, mantenibilidad y consistencia de negocio

## 3. Contexto y alcance del sistema

### 3.1 Contexto de negocio

El sistema permite a un usuario explorar un catalogo, añadir productos al carrito y generar un pedido siempre que exista stock suficiente. Una vez autenticado, el usuario puede consultar sus pedidos.

Actores de negocio:

| Actor | Interaccion principal | Resultado esperado |
| --- | --- | --- |
| Cliente | consulta catalogo, gestiona carrito y compra | pedido valido y consulta de su historial |
| Negocio | define catalogo inicial | productos disponibles para la primera version |
| Equipo de desarrollo | evoluciona y despliega la solucion | cambios controlados y trazables |

### 3.2 Contexto tecnico

Actores y sistemas externos:

- archivos `.json`: fuente inicial para la carga de productos en la primera version
- navegador web: consume la aplicacion y mantiene el carrito en `localStorage`
- aplicacion web Next.js: renderiza interfaz y expone endpoints
- Supabase Auth: autentica usuarios
- Supabase/PostgreSQL: persiste productos, pedidos y stock, pero no el carrito de la primera version
- shadcn/ui: base de componentes para la interfaz

Partners tecnicos externos:

| Partner | Tipo | Interfaz | Proposito |
| --- | --- | --- | --- |
| Archivos `.json` | fuente de datos interna | carga inicial | bootstrap del catalogo |
| Navegador | cliente | HTTP y almacenamiento local | consumo de UI y persistencia temporal del carrito |
| Vercel | plataforma | despliegue de app Next.js | hosting de UI y endpoints |
| Supabase Auth | servicio externo | cliente auth | autenticacion y sesion |
| Supabase PostgreSQL | servicio externo | cliente de datos | persistencia de productos, pedidos y stock |

### 3.3 Interfaces externas

- `GET /api/v1/products`
- `POST /api/v1/orders`
- `GET /api/v1/orders`

Descripcion de interfaces:

| Interfaz | Proposito |
| --- | --- |
| `GET /api/v1/products` | consultar catalogo con busqueda, filtros y paginacion |
| `POST /api/v1/orders` | crear un pedido validando autenticacion y stock |
| `GET /api/v1/orders` | consultar pedidos del usuario autenticado |

Requerimientos relacionados:

- RF-014
- RF-015
- RF-016
- RF-017
- RF-018

## 4. Estrategia de solucion

### 4.1 Enfoque general

Se adopta un monolito simple implementado con Next.js. Esta eleccion ha permitido construir primero una plataforma ejecutable y deja el dominio funcional preparado para completarse por fases.

### 4.2 Stack tecnologico

| Tecnologia | Rol | Version objetivo |
| --- | --- | --- |
| Node.js | runtime de desarrollo y build | 20.x |
| Next.js App Router | framework full stack para UI, routing y endpoints | 15.x |
| React | composicion de interfaz y componentes | 19.x |
| TypeScript | tipado estatico y contratos entre capas | 5.x |
| Supabase | autenticacion, sesion y persistencia relacional | 2.x cliente JS |
| shadcn/ui | libreria base de componentes de interfaz | ultima compatible |
| React Query | estado remoto, cache y sincronizacion | 5.x |
| Zod | validacion de contratos de entrada y salida | 3.x |
| Playwright | pruebas E2E y regresion visual | 1.x |
| Vercel | despliegue de la aplicacion y endpoints | gestionado por plataforma |

### 4.3 Decisiones principales

- precios en enteros mediante `price_cents`
- snapshot de precio en `order_items`
- UUIDs para entidades publicas
- validacion de entrada en API con Zod
- ownership validation en endpoints protegidos
- logica critica de stock cercana a la base de datos
- carrito persistido en `localStorage` para acelerar la primera version
- carga inicial del catalogo desde `.json` para reducir friccion de arranque
- Supabase no gestiona el carrito en la primera version

Requerimientos relacionados:

- RF-001
- RF-007
- RF-008
- RF-009
- RF-010
- RF-017
- RNF-001
- RNF-003
- RNF-011

Tabla de decisiones:

| Decision | Motivo | Impacto |
| --- | --- | --- |
| Monolito simple | acelerar la primera version | menos complejidad estructural inicial |
| `localStorage` para carrito | resolver rapido el estado temporal | sin sincronizacion multi-dispositivo |
| Bootstrap desde `.json` | reducir friccion de arranque | catalogo inicial rapido, sin backoffice |
| Supabase como BaaS | simplificar auth y persistencia | dependencia de plataforma |
| Despliegue en Vercel | simplificar operacion | integracion natural con Next.js |
| Testing con unit + Playwright + snapshots | reducir regresiones | coste de mantenimiento de pruebas |

### 4.4 Estrategia de desarrollo

Estado actual:

- base del proyecto e integracion con Supabase completadas
- bootstrap de productos desde `.json` disponible
- validaciones y testing base disponibles
- estructura de dominios preparada, pero no completada funcionalmente

Siguiente fase:

1. implementar catalogo real sobre la base actual
2. implementar carrito en `localStorage`
3. implementar login y area de pedidos
4. implementar checkout y cierre operativo de despliegue en Vercel

Todo lo demas queda como evolucion posterior.

## 5. Vista de bloques

### 5.1 Vista de alto nivel

El sistema se divide en los siguientes bloques:

- `products`: consulta de catalogo, filtros y paginacion
- `cart`: estado local del carrito y validaciones previas a checkout
- `orders`: creacion de pedidos, consulta historica y validacion de ownership
- `auth`: login y contexto de usuario
- `api`: adaptadores HTTP y validacion de requests
- `db`: acceso a Supabase/PostgreSQL

Whitebox del sistema:

| Bloque | Responsabilidad principal |
| --- | --- |
| UI/App | implementado como base operativa y pantalla de estado |
| Catalogo | preparado estructuralmente, pendiente de implementacion funcional |
| Carrito | preparado estructuralmente, pendiente de implementacion funcional |
| Checkout/Pedidos | preparado estructuralmente, pendiente de implementacion funcional |
| Auth | preparado estructuralmente, pendiente de implementacion funcional |
| Persistencia | implementado mediante Supabase y carga inicial |

### 5.2 Descomposicion interna propuesta

```text
src/
  app/
  modules/
    products/
    cart/
    orders/
    auth/
  lib/
    db/
    validation/
    api/
  components/
  hooks/
```

Whitebox de la aplicacion:

| Bloque interno | Responsabilidad |
| --- | --- |
| `app` | rutas, paginas y endpoints |
| `modules` | dominios preparados para la siguiente fase funcional |
| `lib` | integraciones, validacion y utilidades compartidas ya disponibles |
| `components` | piezas reutilizables de UI y pantalla base implementada |
| `hooks` | comportamiento reutilizable en cliente |

### 5.3 Dominio critico: pedidos

El flujo de pedidos concentra el mayor riesgo tecnico del sistema.

| Paso | Responsabilidad |
| --- | --- |
| Validacion | validar sesion y payload antes de operar |
| Lectura | cargar productos afectados y estado actual |
| Verificacion | comprobar stock disponible |
| Creacion | crear `order` y `order_items` |
| Persistencia final | descontar stock y confirmar resultado |

## 6. Vista de tiempo de ejecucion

### 6.1 Consulta de catalogo

1. el usuario abre el catalogo
2. el frontend solicita productos con criterios de busqueda y paginacion
3. la API valida query params
4. la capa `products` consulta base de datos
5. se devuelve listado paginado

Disparador:

- el usuario accede al catalogo o ejecuta una busqueda

Resultado esperado:

- listado de productos filtrado y paginado

Errores relevantes:

- query invalida
- fallo de acceso a datos

Requerimientos relacionados:

- RF-002
- RF-003
- RF-004
- RF-014
- RNF-006

### 6.2 Checkout

1. el usuario confirma carrito
2. el frontend envia items a `POST /api/v1/orders`
3. la API valida autenticacion y payload
4. la capa `orders` carga productos afectados
5. se verifica stock
6. se crea `order`
7. se crean `order_items`
8. se decrementa stock
9. se devuelve resultado o error estructurado

Disparador:

- el usuario autenticado confirma el checkout

Resultado esperado:

- pedido creado con lineas y stock actualizado

Errores relevantes:

- usuario no autenticado
- payload invalido
- stock insuficiente
- error transaccional

Requerimientos relacionados:

- RF-007
- RF-008
- RF-009
- RF-010
- RF-017
- RNF-001
- RNF-002
- RNF-011

### 6.3 Consulta de pedidos

1. el usuario autenticado accede a su area privada
2. el frontend consulta `GET /api/v1/orders`
3. la API valida sesion
4. se filtra por `user_id`
5. se devuelve solo informacion propia

Disparador:

- el usuario autenticado accede a su historial

Resultado esperado:

- listado exclusivo de sus pedidos

Errores relevantes:

- sesion invalida
- acceso no autorizado
- fallo de lectura

Requerimientos relacionados:

- RF-011
- RF-012
- RF-016
- RNF-002

### 6.4 Carga inicial desde `.json`

1. el sistema lee los archivos `.json` definidos para bootstrap
2. transforma los datos a la estructura esperada
3. inserta o inicializa productos en persistencia
4. deja disponible el catalogo base para la aplicacion

Disparador:

- proceso de arranque o inicializacion del catalogo

Resultado esperado:

- productos cargados correctamente para la primera version

Errores relevantes:

- archivo inexistente
- formato invalido
- fallo durante la carga en persistencia

Requerimientos relacionados:

- RF-001

## 7. Vista de despliegue

### 7.1 Entorno minimo

- frontend y backend preparados para desplegarse como una unica aplicacion Next.js en Vercel
- Supabase como proveedor gestionado de autenticacion y base de datos
- configuracion por variables de entorno para claves y conexion con Supabase

Requerimientos relacionados:

- RF-019
- RNF-010

### 7.2 Nodos

- cliente web
- aplicacion Next.js desplegada en Vercel
- base de datos PostgreSQL en Supabase
- servicio de autenticacion Supabase Auth

### 7.3 Mapeo de bloques a infraestructura

| Bloque | Destino |
| --- | --- |
| UI/App | Vercel |
| Endpoints Next.js | Vercel |
| Auth | Supabase Auth |
| Productos, pedidos y stock | Supabase PostgreSQL |
| Bootstrap desde `.json` | recurso interno del repositorio o proceso de inicializacion |

### 7.4 Entornos

| Entorno | Proposito |
| --- | --- |
| Local | desarrollo e integracion diaria |
| Produccion | aplicacion publicada en Vercel conectada a Supabase |

### 7.5 Consideraciones operativas

- Vercel aloja la interfaz web y los endpoints de Next.js
- Supabase aloja autenticacion y base de datos
- el despliegue requiere variables de entorno para URL y claves de Supabase

## 8. Conceptos transversales

### 8.1 Validacion

Todos los contratos de entrada de API deben validarse con Zod antes de invocar logica de negocio.

Requerimientos relacionados:

- RF-017
- RNF-003

### 8.2 Seguridad

- autenticacion obligatoria para pedidos
- validacion de ownership
- no confiar en precios ni totales calculados por el cliente

Requerimientos relacionados:

- RF-007
- RF-011
- RF-012
- RNF-002

### 8.3 Gestion de errores

Los endpoints deben responder con errores estructurados, distinguendo entre:

- error de validacion
- error de autenticacion
- error de autorizacion
- error de stock insuficiente
- error interno

Requerimientos relacionados:

- RF-018
- RNF-008

### 8.4 Gestion de estado

- estado remoto con React Query
- estado local del carrito con `localStorage`

Requerimientos relacionados:

- RF-006
- RNF-007

Decision aplicada:

- `localStorage` es la opcion elegida por velocidad de implementacion
- no se sincroniza carrito contra Supabase en esta version

### 8.5 Persistencia

Modelo principal:

- `products`
- `orders`
- `order_items`

Requerimientos relacionados:

- RF-001
- RF-009
- RF-010
- RNF-011

### 8.6 Carga inicial

La primera carga del sistema se realiza desde archivos `.json` para acelerar el arranque del catalogo. Esta estrategia solo cubre la inicializacion de la primera version y no sustituye futuras capacidades de importacion o administracion.

Requerimientos relacionados:

- RF-001

### 8.7 Testing

La estrategia de testing del sistema combina:

- unit tests para logica de negocio, validaciones y componentes criticos
- Playwright E2E para flujos principales
- snapshots visuales para detectar regresiones no intencionales en UI

Esta estrategia cubre tanto el boilerplate del MVP como los flujos funcionales implementados despues.

Que resuelve:

- reduce regresiones funcionales y visuales

Como se aplica:

- unit tests para logica y componentes
- Playwright para flujos y comparaciones visuales

Que queda fuera por ahora:

- infraestructura avanzada de testing distribuido
- tooling visual adicional mas alla de snapshots base

Requerimientos relacionados:

- RNF-016
- RNF-017
- RNF-018

## 9. Decisiones de arquitectura

Las decisiones formales se documentan en `docs/ADR/`.

ADRs vigentes del sistema:

- ADR-001: monolito vs monolito modular
- ADR-002: decision de alcance de la primera version
- ADR-003: carrito persistido en cliente
- ADR-004: despliegue sobre Vercel
- ADR-005: estrategia de desarrollo por fases
- ADR-006: Supabase como BaaS
- ADR-007: carga inicial desde `.json`
- ADR-008: estrategia de testing

## 10. Requisitos de calidad

### 10.1 Consistencia

No deben generarse pedidos con stock negativo por condiciones evitables de concurrencia.

Requerimientos relacionados:

- RNF-001

### 10.2 Rendimiento

Se busca una experiencia correcta para catalogo con:

- indices de base de datos
- busqueda con debounce
- paginacion
- cache de React Query

Requerimientos relacionados:

- RNF-006

Escenario de calidad:

- una consulta tipica de catalogo debe responder de forma razonable con paginacion y busqueda activa

### 10.3 Escalabilidad

La escalabilidad avanzada queda fuera del alcance base y se aborda despues de disponer de una aplicacion funcional desplegada.

Requerimientos relacionados:

- RNF-009
- RNF-015

### 10.4 Mantenibilidad

La logica de negocio debe quedar separada de UI y de los adaptadores HTTP.

Requerimientos relacionados:

- RNF-004
- RNF-013

### 10.5 Seguridad

Un usuario no puede consultar pedidos ajenos ni crear pedidos sin autenticacion.

Requerimientos relacionados:

- RNF-002

### 10.6 Testing y regresion

La solucion debe contar con una estrategia de pruebas que reduzca regresiones funcionales y visuales, y que permita validar cambios con rapidez antes del despliegue.

Requerimientos relacionados:

- RNF-016
- RNF-017
- RNF-018

Escenarios de calidad:

- una regression en checkout debe ser detectable por tests automatizados
- un cambio visual no intencional en catalogo, carrito o checkout debe ser detectable por snapshots

Estado actual:

- unit tests base implementados
- E2E base implementado sobre la home
- snapshot visual base implementado sobre la home

## 11. Riesgos y deuda tecnica

| Riesgo o deuda | Impacto | Mitigacion | Estado |
| --- | --- | --- | --- |
| concurrencia de stock | pedidos inconsistentes | reforzar estrategia transaccional en checkout | abierto |
| carrito en cliente no sincronizado | experiencia limitada entre dispositivos | mantenerlo asi en primera version y revisar despues | aceptado |
| bootstrap desde `.json` limitado | no cubre administracion continua | evolucionar a importacion o backoffice si el producto crece | abierto |
| dependencia de Supabase | condiciona portabilidad | aislar acceso a datos y auth en capas propias | aceptado |
| snapshots visuales con mantenimiento | ruido en cambios UI | revisar cambios visuales intencionales con disciplina | abierto |
| escalado x100 fuera del alcance base | capacidad limitada ante crecimiento | tratarlo como fase posterior con cache, replicas y observabilidad | aceptado |

## 12. Glosario

- catalogo: conjunto de productos disponibles para compra
- carrito: seleccion temporal de productos en cliente
- checkout: proceso de validacion y creacion del pedido
- ownership: validacion de que un recurso pertenece al usuario autenticado
- snapshot de precio: copia del precio del producto en el momento de compra
