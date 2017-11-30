CREATE TABLE usersecurity (
	username character varying(10) NOT NULL,
	password character varying(100) NOT NULL,
	roles character varying(100) NOT NULL,
	accountNonExpired boolean,
	accountNonLocked boolean,
	credentialsNonExpired boolean,
	enabled boolean,
	attempts integer NOT NULL DEFAULT 0,
	lastmodified timestamp without time zone NOT NULL DEFAULT now(),
	created timestamp without time zone NOT NULL DEFAULT now(),
	CONSTRAINT pk_user_security PRIMARY KEY (created),
	CONSTRAINT pk_login UNIQUE (username)
);

CREATE TABLE userinfo (
	created timestamp without time zone NOT NULL DEFAULT now(),
	name character varying(25) NOT NULL,
	surname character varying(25) NOT NULL,
	phone character varying(20) NOT NULL,
	email character varying(50) NOT NULL,
	card character varying(15),
	sex boolean,
	CONSTRAINT pk_user_info PRIMARY KEY (created)
);

CREATE TABLE barcode (
	productId integer NOT NULL,
	code character varying(13) NOT NULL,
	CONSTRAINT pk_barcode PRIMARY KEY (code)
);

CREATE TABLE product
(
  id integer NOT NULL,
  name character varying(25) NOT NULL,
  "desc" character varying(100) NOT NULL
)
INSERT INTO product (id, name, "desc") VALUES(0, 'USER', 'Відвідувач');

CREATE TABLE scanner (
	code character varying(13) NOT NULL,
	time timestamp without time zone NOT NULL DEFAULT now()
);
INSERT INTO scanner (code) VALUES(0);
CREATE OR REPLACE FUNCTION PUBLIC.AFTER_SCANNER_UPDATE() RETURNS trigger AS
$BODY$
BEGIN
  PERFORM pg_notify('scanner_update', row_to_json(NEW)::text);
  RETURN new;
END;
$BODY$
LANGUAGE 'plpgsql' VOLATILE COST 100;
CREATE TRIGGER SCANNER_UPDATE_TRIGGER
AFTER UPDATE
ON PUBLIC.SCANNER
FOR EACH ROW
EXECUTE PROCEDURE PUBLIC.AFTER_SCANNER_UPDATE();

CREATE TABLE event (
	id integer NOT NULL,
	name character varying(50),
	description character varying(50)
);

CREATE TABLE history (
	id integer NOT NULL,
	idEvent integer NOT NULL,
	time timestamp without time zone NOT NULL DEFAULT now(),
	description character varying(50)
);
