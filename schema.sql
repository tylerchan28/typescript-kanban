CREATE DATABASE kanban;

CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  email text UNIQUE NOT NULL
);

CREATE TABLE projects (
  project_id SERIAL PRIMARY KEY,
  user_id integer REFERENCES users(user_id),
  project_name varchar(80) NOT NULL
);

CREATE TABLE lists (
  list_id SERIAL PRIMARY KEY,
  project_id integer REFERENCES projects(project_id) ON DELETE CASCADE,
  list_name varchar(80) NOT NULL 
);

CREATE TABLE cards (
  card_id SERIAL PRIMARY KEY,
  list_id integer REFERENCES lists(list_id) ON DELETE CASCADE,
  card_description text NOT NULL,
  card_order SERIAL
);

