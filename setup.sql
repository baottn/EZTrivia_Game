/*
  Name: Bao Nguyen
  Section : CSE 154 AC
  Date: 5/29/2019

  This file would create an id, account, password and max_score storage for the
  user input
*/

CREATE DATABASE IF NOT EXISTS playerdb;
USE playerdb;

DROP TABLE IF EXISTS player;

CREATE TABLE player(
   id INT NOT NULL AUTO_INCREMENT,
   account VARCHAR(50) NOT NULL,
   password VARCHAR(100) NOT NULL,
   max_score INT NOT NULL,
   PRIMARY KEY(account),
   UNIQUE(id)
);

-- INSERT the admin player
INSERT INTO player (id, account, password, max_score)
VALUES (0, "admin", "admin", 0);
