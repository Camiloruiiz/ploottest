# Arquitectura del Sistema

## 1. Introduccion y objetivos

### 1.1 Proposito

Este documento describe la arquitectura de una primera version minimamente funcional del sistema. El objetivo es entregar una aplicacion operativa, desplegada en Vercel, con catalogo, carrito, checkout y consulta de pedidos.

Decision de velocidad:

- `localStorage` se usa para el carrito y el estado temporal del cliente
- `Supabase` se usa para autenticacion, productos y pedidos persistentes

### 1.2 Alcance

El sistema cubre:

- catalogo de productos
- carga inicial de productos desde archivos `.json`
- carrito persistido en cliente
- checkout con validacion de stock
- autenticacion de usuarios
- consulta de pedidos propios
- API minima para productos y pedidos
- despliegue operativo en Vercel

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

### 1.3 Objetivos de calidad

Los atributos de calidad prioritarios son:

- consistencia de datos en checkout
- simplicidad de implementacion
- validacion de inputs
- control de acceso por usuario

### 1.4 Stakeholders

- usuario final: necesita explorar productos, gestionar un carrito y completar compras de forma fiable
- equipo de desarrollo: necesita una base de codigo clara, modular y facil de extender
- negocio y operaciones: necesitan una solucion sencilla de desplegar y operar

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

### 3.2 Contexto tecnico

Actores y sistemas externos:

- archivos `.json`: fuente inicial para la carga de productos en la primera version
- navegador web: consume la aplicacion y mantiene el carrito en `localStorage`
- aplicacion web Next.js: renderiza interfaz y expone endpoints
- Supabase Auth: autentica usuarios
- Supabase/PostgreSQL: persiste productos, pedidos y stock, pero no el carrito de la primera version
- shadcn/ui: base de componentes para la interfaz

### 3.3 Interfaces externas

- `GET /api/v1/products`
- `POST /api/v1/orders`
- `GET /api/v1/orders`

Requerimientos relacionados:

- RF-014
- RF-015
- RF-016
- RF-017
- RF-018

## 4. Estrategia de solucion

### 4.1 Enfoque general

Se adopta un monolito simple implementado con Next.js. Esta eleccion prioriza velocidad de construccion, simplicidad operativa y facilidad de despliegue en Vercel.

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

### 4.4 Estrategia de desarrollo

La primera version se construye en cuatro pasos:

1. carga inicial desde `.json` e integracion con Supabase
2. API minima de productos y pedidos
3. catalogo, carrito en `localStorage` y login
4. checkout, pedidos y despliegue en Vercel

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

## 6. Vista de tiempo de ejecucion

### 6.1 Consulta de catalogo

1. el usuario abre el catalogo
2. el frontend solicita productos con criterios de busqueda y paginacion
3. la API valida query params
4. la capa `products` consulta base de datos
5. se devuelve listado paginado

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

Requerimientos relacionados:

- RF-011
- RF-012
- RF-016
- RNF-002

## 7. Vista de despliegue

### 7.1 Entorno minimo

- frontend y backend desplegados como una unica aplicacion Next.js en Vercel
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

### 7.3 Consideraciones operativas

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

## 11. Riesgos y deuda tecnica

- el control de concurrencia puede requerir una funcion SQL o una estrategia mas estricta si aumenta la carga
- el carrito en cliente no sincroniza entre dispositivos
- el escalado x100 requiere medidas adicionales fuera del alcance base

## 12. Glosario

- catalogo: conjunto de productos disponibles para compra
- carrito: seleccion temporal de productos en cliente
- checkout: proceso de validacion y creacion del pedido
- ownership: validacion de que un recurso pertenece al usuario autenticado
- snapshot de precio: copia del precio del producto en el momento de compra
