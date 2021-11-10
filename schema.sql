CREATE DATABASE kanban;

CREATE TABLE users (
  user_id integer PRIMARY KEY,
  email text NOT NULL
);

CREATE TABLE projects (
  project_id SERIAL PRIMARY KEY,
  user_id integer REFERENCES users(user_id),
  project_name varchar(80) NOT NULL
);

CREATE TABLE lists (
  list_id SERIAL PRIMARY KEY,
  project_id integer REFERENCES projects(project_id),
  list_name varchar(80) NOT NULL
);


CREATE TABLE cards (
  card_id SERIAL PRIMARY KEY,
  list_id integer REFERENCES lists(list_id),
  card_description text NOT NULL
);

CREATE INDEX product_id_index ON products (product_id);
CREATE INDEX features_id_index ON features (product_id);
CREATE INDEX styles_id_index ON styles (product_id);
CREATE INDEX photos_id_index ON photos (style_id);
CREATE INDEX skus_id_index ON skus (style_id);
CREATE INDEX related_id_index ON related (product_id);
CREATE INDEX cart_id_index on cart (user_id);