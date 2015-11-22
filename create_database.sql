create database is421;
use is421;

CREATE TABLE User (
    userId INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    firstname VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(60) NOT NULL,
    isAdmin BOOLEAN NOT NULL DEFAULT FALSE,
    owner VARCHAR(50),
    active BOOLEAN NOT NULL DEFAULT FALSE,
    confirmationCode VARCHAR(60)
);

CREATE TABLE Project (
    projectId INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    title VARCHAR(100) NOT NULL
);

CREATE TABLE UserProject (
    upId INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    userId INT NOT NULL,
    projectId INT NOT NULL
);

CREATE TABLE Task (
    taskId INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    projectId INT NOT NULL,
    title VARCHAR(50) NOT NULL,
    status VARCHAR(10) NOT NULL DEFAULT 'new',
    description VARCHAR(1000)
);

INSERT INTO User (userId, username, firstname, lastname, email, password, isAdmin, active) VALUES (1, 'urvesh', 'urvesh', 'patel', 'Hiche1986@cuvox.de',  '$2a$10$KJ.qGxnsaihR47HneRY3CubxyakDDEjFaEbjCB5UXDVqUbjD5EgJu', 1, 1);
INSERT INTO Project (projectId, title) VALUES (1, 'Sample Test Project');
INSERT INTO UserProject (upId, userId, projectId) VALUES (1, 1, 1);
INSERT INTO Task (taskId, projectId, title, description) VALUES (1, 1, 'Sample Test Task', 'Sample Test Description');
