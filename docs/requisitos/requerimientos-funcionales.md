# Requerimientos Funcionales

## RF-001 Carga inicial del catalogo

El sistema debe permitir una carga inicial de productos desde archivos `.json`.

## RF-002 Catalogo de productos

El sistema debe permitir consultar un listado de productos disponibles con su nombre, descripcion, precio y stock visible.

## RF-003 Busqueda de productos

El sistema debe permitir buscar productos por nombre mediante una caja de busqueda.

## RF-004 Filtros basicos

El sistema debe permitir aplicar filtros basicos sobre el catalogo para acotar resultados.

## RF-005 Paginacion del catalogo

El sistema debe paginar el listado de productos para evitar cargas excesivas y mejorar la navegacion.

## RF-006 Gestion de carrito

El sistema debe permitir anadir productos al carrito, actualizar cantidades y eliminar productos.

## RF-007 Persistencia de carrito

El sistema debe conservar el carrito del usuario en el cliente entre sesiones del navegador.

## RF-008 Checkout autenticado

El sistema debe requerir autenticacion para completar el proceso de compra.

## RF-009 Validacion de stock

El sistema debe validar disponibilidad de stock antes de confirmar un pedido.

## RF-010 Creacion de pedidos

El sistema debe crear un pedido con sus lineas asociadas al confirmar el checkout.

## RF-011 Snapshot de precio

El sistema debe almacenar en cada linea del pedido el precio unitario aplicado en el momento de la compra.

## RF-012 Consulta de pedidos propios

El sistema debe permitir a un usuario autenticado consultar el historico de sus propios pedidos.

## RF-013 Aislamiento por propiedad

El sistema no debe permitir que un usuario consulte pedidos pertenecientes a otro usuario.

## RF-014 API de productos

El sistema debe exponer un endpoint `GET /api/v1/products` para consulta de catalogo con soporte de busqueda, filtros y paginacion.

## RF-015 API de creacion de pedidos

El sistema debe exponer un endpoint `POST /api/v1/orders` para crear pedidos de forma consistente.

## RF-016 API de pedidos del usuario

El sistema debe exponer un endpoint `GET /api/v1/orders` para obtener los pedidos del usuario autenticado.

## RF-017 Validacion de contratos

El sistema debe validar los datos de entrada y salida relevantes en los limites de la API.

## RF-018 Gestion de errores de negocio

El sistema debe devolver errores comprensibles para casos como:

- autenticacion ausente
- stock insuficiente
- payload invalido
- acceso no autorizado

## RF-019 Despliegue operativo

El sistema debe poder desplegarse como una aplicacion web accesible para usuarios finales.
