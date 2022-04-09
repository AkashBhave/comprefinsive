SET sql_safe_updates = FALSE;

USE defaultdb;
DROP DATABASE IF EXISTS comprefinsive CASCADE;
CREATE DATABASE IF NOT EXISTS comprefinsive;

USE comprefinsive;

CREATE TABLE users (
		username varchar(20) NOT NULL PRIMARY KEY,
		password varchar(40) NOT NULL,
		name varchar(40) NOT NULL
);

CREATE TABLE assets (
	username varchar(20) NOT NULL,
	name varchar(100) NOT NULL,
	symbol varchar(100) NOT NULL,
	base_amount decimal NOT NULL,
	quote_amount decimal NOT NULL,
	PRIMARY KEY (username, symbol)
);
