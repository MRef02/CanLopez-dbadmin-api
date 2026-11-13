FROM mysql:8.0

# Copia los scripts SQL a la carpeta de inicialización automática de MySQL
COPY ./sql/TablasBaseDatos.sql /docker-entrypoint-initdb.d/01-tablas.sql
