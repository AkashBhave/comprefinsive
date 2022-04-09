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

CREATE TABLE assets (
	id UUID PRIMARY KEY,
	user_id UUID NOT NULL,
	name varchar(40) NOT NULL,
	amount int NOT NULL
);

CREATE TABLE transactions (
	id UUID PRIMARY KEY,
	asset_id UUID NOT NULL
);