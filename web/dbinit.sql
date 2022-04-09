SET sql_safe_updates = FALSE;

USE defaultdb;
DROP DATABASE IF EXISTS comprefinsive CASCADE;
CREATE DATABASE IF NOT EXISTS comprefinsive;

USE comprefinsive;

CREATE TABLE users (
    id UUID PRIMARY KEY,
		username varchar(20) NOT NULL,
		password varchar(40) NOT NULL,
		name varchar(40) NOT NULL
);