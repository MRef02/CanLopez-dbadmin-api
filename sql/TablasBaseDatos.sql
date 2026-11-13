-- ========================================================
-- BASE DE DATOS: logiexpress
-- SCRIPT COMPLETO: TABLAS (3FN), TRIGGERS Y PROCEDURES
-- ========================================================

USE logiexpress;

-- ========================================================
-- 1. TABLAS DEL SISTEMA
-- ========================================================

CREATE TABLE IF NOT EXISTS cliente (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    estado ENUM('ACTIVO', 'INACTIVO') NOT NULL DEFAULT 'ACTIVO',
    limiteCredito DECIMAL(10, 2) NOT NULL
);

CREATE TABLE IF NOT EXISTS almacenes (
    idAlmacen INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    calle VARCHAR(67) NOT NULL,
    ciudad VARCHAR(68) NOT NULL,
    estado VARCHAR(69) NOT NULL,
    capacidad INT NOT NULL CHECK (capacidad >= 0)
);

CREATE TABLE IF NOT EXISTS direcciones (
    idDireccion INT AUTO_INCREMENT PRIMARY KEY,
    clienteId INT NOT NULL,
    calle VARCHAR(67) NOT NULL,
    ciudad VARCHAR(68) NOT NULL,
    estado VARCHAR(69) NOT NULL,
    CONSTRAINT fk_direcciones_cliente 
        FOREIGN KEY (clienteId) REFERENCES cliente(id) 
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS envios (
    idEnvios INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    direccion_origen_id INT NOT NULL,
    direccion_destino_id INT NOT NULL,
    costo_total FLOAT NOT NULL,
    fecha_registro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_entrega DATETIME NULL,
    estado ENUM('REGISTRADO', 'EN_TRANSITO', 'ENTREGADO', 'CANCELADO') NOT NULL DEFAULT 'REGISTRADO',
    CONSTRAINT fk_envios_cliente 
        FOREIGN KEY (cliente_id) REFERENCES cliente(id),
    CONSTRAINT fk_envios_origen_almacen 
        FOREIGN KEY (direccion_origen_id) REFERENCES almacenes(idAlmacen),
    CONSTRAINT fk_envios_destino_direccion 
        FOREIGN KEY (direccion_destino_id) REFERENCES direcciones(idDireccion)
);

CREATE TABLE IF NOT EXISTS paquetes (
    idPaquete INT AUTO_INCREMENT PRIMARY KEY,
    envio_id INT NOT NULL,
    almacen_id INT NULL,
    peso_kg FLOAT NOT NULL,
    dimesiones VARCHAR(50) NULL,
    contenido VARCHAR(255) NOT NULL,
    CONSTRAINT fk_paquetes_envio 
        FOREIGN KEY (envio_id) REFERENCES envios(idEnvios) 
        ON DELETE CASCADE,
    CONSTRAINT fk_paquetes_almacen 
        FOREIGN KEY (almacen_id) REFERENCES almacenes(idAlmacen) 
        ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS rastreo (
    idRastreo INT AUTO_INCREMENT PRIMARY KEY,
    envioId INT NOT NULL,
    fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ubicacion VARCHAR(255) NOT NULL,
    estado ENUM('REGISTRADO', 'EN_TRANSITO', 'ENTREGADO', 'CANCELADO') NOT NULL,
    CONSTRAINT fk_rastreo_envio 
        FOREIGN KEY (envioId) REFERENCES envios(idEnvios) 
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS auditoria_envios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    envioId INT NOT NULL,
    costo_anterior FLOAT NOT NULL,
    costo_nuevo FLOAT NOT NULL,
    usuario VARCHAR(100) NULL,
    fecha_modificacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_auditoria_envios_envio 
        FOREIGN KEY (envioId) REFERENCES envios(idEnvios) 
        ON DELETE CASCADE
);

-- ========================================================
-- 2. TRIGGERS
-- ========================================================

-- Trigger 1: Control de capacidad máxima en almacén
DROP TRIGGER IF EXISTS before_insert_paquete_almacen;
DELIMITER $$
CREATE TRIGGER before_insert_paquete_almacen
BEFORE INSERT ON paquetes
FOR EACH ROW
BEGIN
    DECLARE v_capacidad_max INT DEFAULT 0;
    DECLARE v_paquetes_actuales INT DEFAULT 0;

    IF NEW.almacen_id IS NOT NULL THEN
        SELECT capacidad INTO v_capacidad_max
        FROM almacenes
        WHERE idAlmacen = NEW.almacen_id;

        SELECT COUNT(*) INTO v_paquetes_actuales
        FROM paquetes
        WHERE almacen_id = NEW.almacen_id;

        IF v_paquetes_actuales >= v_capacidad_max THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Capacidad maxima del almacen superada';
        END IF;
    END IF;
END$$
DELIMITER ;

-- Trigger 2: Auditoría de cambios en costo_total
DROP TRIGGER IF EXISTS after_update_envio_costo;
DELIMITER $$
CREATE TRIGGER after_update_envio_costo
AFTER UPDATE ON envios
FOR EACH ROW
BEGIN
    IF OLD.costo_total <> NEW.costo_total THEN
        INSERT INTO auditoria_envios (
            envioId,
            costo_anterior,
            costo_nuevo,
            usuario,
            fecha_modificacion
        ) VALUES (
            NEW.idEnvios,
            OLD.costo_total,
            NEW.costo_total,
            USER(),
            NOW()
        );
    END IF;
END$$
DELIMITER ;

-- Trigger 3: Actualización de estado del envío a ENTREGADO
DROP TRIGGER IF EXISTS after_insert_historial_rastreo;
DELIMITER $$
CREATE TRIGGER after_insert_historial_rastreo
AFTER INSERT ON rastreo
FOR EACH ROW
BEGIN
    IF NEW.estado = 'ENTREGADO' THEN
        UPDATE envios
        SET estado = 'ENTREGADO',
            fecha_entrega = NOW()
        WHERE idEnvios = NEW.envioId;
    END IF;
END$$
DELIMITER ;

-- ========================================================
-- 3. PROCEDIMIENTOS ALMACENADOS
-- ========================================================

-- Procedure 1: Reporte mensual de cliente
DROP PROCEDURE IF EXISTS sp_reporte_mensual_cliente;
DELIMITER $$
CREATE PROCEDURE sp_reporte_mensual_cliente(
    IN p_cliente_id INT,
    IN p_mes INT,
    IN p_anio INT
)
BEGIN
    SELECT 
        c.id AS cliente_id,
        CONCAT(c.nombre, ' ', c.apellido) AS cliente_nombre,
        COUNT(e.idEnvios) AS total_envios,
        SUM(CASE WHEN e.estado = 'ENTREGADO' THEN 1 ELSE 0 END) AS envios_entregados,
        COALESCE(SUM(e.costo_total), 0) AS facturacion_total,
        COALESCE(ROUND(AVG(CASE 
            WHEN e.estado = 'ENTREGADO' AND e.fecha_entrega IS NOT NULL 
            THEN TIMESTAMPDIFF(HOUR, e.fecha_registro, e.fecha_entrega) 
            ELSE NULL 
        END), 2), 0) AS promedio_horas_entrega
    FROM cliente c
    LEFT JOIN envios e ON c.id = e.cliente_id 
        AND MONTH(e.fecha_registro) = p_mes 
        AND YEAR(e.fecha_registro) = p_anio
    WHERE c.id = p_cliente_id
    GROUP BY c.id, c.nombre, c.apellido;
END$$
DELIMITER ;

-- Procedure 2: Hoja de ruta y desglose del envío
DROP PROCEDURE IF EXISTS sp_obtener_hoja_ruta_envio;
DELIMITER $$
CREATE PROCEDURE sp_obtener_hoja_ruta_envio(
    IN p_envio_id INT
)
BEGIN
    -- 1. Cabecera y paquetes
    SELECT 
        e.idEnvios AS envio_id,
        CONCAT(c.nombre, ' ', c.apellido) AS remitente,
        a.nombre AS almacen_origen,
        CONCAT(d.calle, ', ', d.ciudad, ', ', d.estado) AS direccion_destino,
        e.costo_total,
        e.estado AS estado_envio,
        e.fecha_registro,
        p.idPaquete,
        p.contenido,
        p.peso_kg,
        p.dimesiones
    FROM envios e
    INNER JOIN cliente c ON e.cliente_id = c.id
    INNER JOIN almacenes a ON e.direccion_origen_id = a.idAlmacen
    INNER JOIN direcciones d ON e.direccion_destino_id = d.idDireccion
    LEFT JOIN paquetes p ON e.idEnvios = p.envio_id
    WHERE e.idEnvios = p_envio_id;

    -- 2. Historial de rastreo
    SELECT 
        r.idRastreo,
        r.fecha,
        r.ubicacion,
        r.estado
    FROM rastreo r
    WHERE r.envioId = p_envio_id
    ORDER BY r.fecha ASC;
END$$
DELIMITER ;
