CREATE TABLE users
(
  id bigint NOT NULL,
  username character varying(100) NOT NULL,
  password character varying(100) NOT NULL,
  authorities character varying(100) NOT NULL,
  accountNonExpired boolean,
  accountNonLocked boolean,
  credentialsNonExpired boolean,
  enabled boolean,
  attempts integer NOT NULL DEFAULT 0,
  lastmodified timestamp without time zone NOT NULL DEFAULT now(),
  CONSTRAINT pk_users_web PRIMARY KEY (id),
  --CONSTRAINT pk_login UNIQUE (login)
);
