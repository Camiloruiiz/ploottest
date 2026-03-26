# Roadmap del Producto

La carpeta `features/` se organiza en dos grupos:

- `MVP`: capacidades ya implementadas y verificadas dentro del producto actual
- `paraImplementar`: capacidades pendientes para la siguiente iteracion

El roadmap sigue esa misma secuencia.

## Fase 1. Fundacion del sistema

Estado: completada

- carga inicial de productos desde `.json`
- definicion del modelo de datos
- configuracion inicial de Supabase
- base de aplicacion Next.js
- configuracion de despliegue base en Vercel
- base inicial de unit tests y Playwright

Features relacionadas:

- `features/MVP/boilerplate-stack.feature`
- `features/MVP/integracion-inicial.feature`
- `features/MVP/despliegue-vercel.feature`
- `features/MVP/testing-base.feature`

## Fase 2. Catalogo

Estado: completada

- listado de productos
- busqueda
- filtros basicos
- paginacion
- integracion con `GET /api/v1/products`
- soporte por datos demo y por Supabase

Features relacionadas:

- `features/MVP/catalogo.feature`

## Fase 3. Carrito

Estado: completada

- alta y baja de productos
- actualizacion de cantidades
- persistencia en `localStorage`
- resumen de cantidades y total
- integracion con la pantalla de checkout

Features relacionadas:

- `features/MVP/carrito.feature`

## Fase 4. Checkout y pedidos

Estado: completada

- autenticacion para compra
- validacion de stock en modo demo y en Supabase
- creacion de pedidos en modo demo y en Supabase
- consulta de pedidos del usuario
- integracion de login por magic link
- persistencia real de pedidos y lineas en Supabase
- descuento real de stock en Supabase
- errores estructurados del checkout real

Features relacionadas:

- `features/MVP/autenticacion.feature`
- `features/MVP/checkout.feature`
- `features/MVP/checkout-supabase.feature`
- `features/MVP/pedidos.feature`

## Fase 5. Endurecimiento operativo

Estado: parcial

- mejora de validaciones ya aplicada en el MVP actual
- endurecimiento de ownership ya aplicado en el MVP actual
- estandarizacion de errores ya aplicada en el MVP actual
- cobertura automatizada de flujos criticos ya integrada
- snapshots visuales para regresion de UI ya integrados
- pendiente: validar el entorno publico en Vercel
- pendiente: ampliar pruebas sobre flujo real con Supabase

Faltante para cierre:

- validar el despliegue publico operativo
- ampliar pruebas E2E sobre flujo real con Supabase

Features relacionadas:

- `features/MVP/testing-flujos.feature`
- `features/MVP/regresion-visual.feature`
- `features/paraImplementar/despliegue-operativo.feature`
- `features/paraImplementar/testing-supabase-real.feature`

## Siguiente feature prioritaria

La siguiente feature a implementar es `testing-supabase-real`.

Objetivo:

- ejecutar autenticacion contra Supabase real en pruebas automatizadas
- validar checkout persistente sin modo demo
- comprobar el historial de pedidos real
- verificar el flujo con el esquema y las variables del entorno real

Con esta feature el proyecto dejara de depender solo de cobertura demo para validar los recorridos criticos.

## Fase 6. Escalado x100

Estado: posterior

- cache para catalogo
- read replicas
- desacoplar procesamiento de pedidos
- observabilidad ampliada con logs y trazas
- posible separacion de responsabilidades por dominios
- CDN para assets

## Vision posterior y evolucion deseada

Estas capacidades no forman parte del alcance actual ni del siguiente paso inmediato, pero representan una direccion razonable de evolucion para el sistema.

### Procesamiento asincrono

- uso de colas o background jobs para pedidos, actualizaciones de stock y notificaciones
- desacoplar trabajo costoso del ciclo request/response

### Diseno orientado a eventos

- incorporacion de eventos de dominio como `OrderCreated`, `StockUpdated` o `PaymentConfirmed`
- mejor desacoplamiento para analytics, notificaciones e integraciones futuras

### Modularidad por dominios

- evolucion hacia limites mas claros entre catalogo, pedidos y usuarios
- posible paso posterior a un monolito mas modular o a separacion de responsabilidades

### Observabilidad y trazabilidad

- logs estructurados
- trazas de flujos criticos
- mejor capacidad de diagnostico en produccion

### Integraciones y capacidades futuras

- notificaciones
- analytics
- integracion con sistemas externos
- automatizaciones o pipelines adicionales si el producto evoluciona
