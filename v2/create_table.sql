create table is421 (
	  username varchar(50) not null unique,
    password varchar(255) not null,
    firstname varchar(50) not null,
    lastname varchar(50) not null,
    email varchar(50) not null unique,
    isAdmin boolean not null default false
    active boolean not null default false
    confirmationCode varchar(255) not null unique
    );