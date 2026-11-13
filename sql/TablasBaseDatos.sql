
CREATE TABLE IF NOT EXISTS cliente(


    id_cliente INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(101) NOT NULL,
    apellido VARCHAR(100),
    estado enum('activo', 'inactivo') NOT NULL,
    limiteCredito DECIMAL(10,2) NOT NULL


);



CREATE TABLE IF NOT EXISTS direcciones (


    idDirecciones INT PRIMARY KEY AUTO_INCREMENT,


    clienteID INT NOT NULL,
    FOREIGN KEY (clienteID) REFERENCES cliente(id_cliente) ON DELETE CASCADE,


    calle VARCHAR(142) NOT NULL,
    ciudad VARCHAR(143) NOT NULL,
    estado VARCHAR(144) NOT NULL                           
);






CREATE TABLE If NOT EXISTS almacen (


    idAlmacen INT PRIMARY KEY AUTO_INCREMENT,
    nombreAlmacen VARCHAR(111) NOT NULL,
    calle  VARCHAR(67) NOT NULL,
    ciudad VARCHAR(68) NOT NULL,
    estado VARCHAR(69) NOT NULL,
    capacidad INT UNSIGNED NOT NULL   -- no puede ser negativa la capacidad
    


);


CREATE TABLE IF NOT EXISTS envio(


    idEnvio INT PRIMARY KEY AUTO_INCREMENT,


    clienteId int not null,
    FOREIGN KEY (clienteId) REFERENCES cliente(id_cliente),


    direccinOrigenId int not null,
    FOREIGN KEY (direccinOrigenId) REFERENCES almacen(idAlmacen),
    
    direccionDestinoId int not null,
    FOREIGN KEY (direccionDestinoId) REFERENCES direcciones(idDirecciones),


    costo DECIMAL(10,2) NOT NULL,
    fechaRegistro DATEtime NOT NULL,
    fechaEntrega DATEtime,
    estado enum('registrado', 'transito', 'entregado','cancelado') NOT NULL



);


CREATE TABLE IF NOT EXISTS paquete(


    idPaquete int primary key auto_increment not NULL,


    envioId int ,
    FOREIGN KEY (envioId) REFERENCES envio(idEnvio),


    almacenId int not null,
    FOREIGN KEY (almacenId) REFERENCES almacen(idAlmacen),


    peso float NOT NULL,
    foreign key (almacenId) references almacen(idAlmacen),


    dimensiones varchar(100) not null,
    contenido varchar(100) not null
);


CREATE TABLE IF NOT EXISTS rastreo(


    idRastreo int primary key auto_increment not NULL,


    envioId int not null,
    FOREIGN KEY (envioId) REFERENCES envio(idEnvio),


    fecha DATEtime NOT NULL,
    ubicacion varchar(100) not null,
    estado enum('registrado', 'transito', 'entregado','cancelado') NOT NULL



);


create table if not exists auditoria_envios(
    
    idAuditoria int primary key auto_increment not NULL,


    envioId int not null,
    FOREIGN KEY (envioId) REFERENCES envio(idEnvio),


    costoAnterior float ,
    costoNuevo float ,


    fecha DATEtime NOT NULL,
    usuario varchar(100) not null
);
