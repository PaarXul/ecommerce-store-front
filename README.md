# Ecommerce Store Front

Este proyecto es una aplicación de comercio electrónico que permite a los usuarios buscar productos por nombre, precio, descuento y categoría. La aplicación está desarrollada en JavaScript y se ejecuta en un servidor web Nginx alojado en un contenedor Docker.

## Funcionalidades

- Búsqueda de productos por nombre, precio, descuento y categoría.
- Ordenación de los resultados de búsqueda por cualquier columna de la tabla de productos.
- Paginación de los resultados de búsqueda.
- Despliegue de la aplicación en un contenedor Docker.

## Estructura del proyecto

- `index.html`: Proporciona una interfaz de usuario para buscar productos.
- `script.js`: Contiene la lógica de la aplicación. Realiza solicitudes a la API para obtener los datos de los productos y actualizar la tabla de productos.
- `style.css`: Define los estilos de la aplicación.
- `Dockerfile`: Especifica que la aplicación se debe ejecutar en un servidor web Nginx.
- `docker-compose.yml`: Configura el puerto en el que se debe ejecutar el servidor.

## Despliegue

Para desplegar la aplicación, se debe construir y ejecutar el contenedor Docker con los siguientes comandos:

```bash
docker-compose build
docker-compose up