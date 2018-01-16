CREATE TABLE usersecurity (
	password character varying(100) NOT NULL,
	roles character varying(100) NOT NULL DEFAULT 'USER',
	accountNonExpired boolean DEFAULT true,
	accountNonLocked boolean DEFAULT true,
	credentialsNonExpired boolean DEFAULT true,
	enabled boolean DEFAULT true,
	attempts integer NOT NULL DEFAULT 0,
	lastmodified timestamp without time zone NOT NULL DEFAULT now(),
	created timestamp without time zone NOT NULL DEFAULT now(),
	CONSTRAINT pk_user_security PRIMARY KEY (created)
);

CREATE TABLE userinfo (
	created timestamp without time zone NOT NULL DEFAULT now(),
	name character varying(25) NOT NULL,
	surname character varying(25) NOT NULL,
	phone character varying(20) NOT NULL,
	email character varying(50) NOT NULL,
	card character varying(15),
	balance integer NOT NULL DEFAULT 0,
	sex boolean,
	CONSTRAINT pk_uniqe_ui_key UNIQUE (email, phone),
	CONSTRAINT pk_user_info PRIMARY KEY (created)
);

CREATE TABLE barcode (
	productId integer NOT NULL,
	code character varying(13) NOT NULL,
	CONSTRAINT pk_barcode PRIMARY KEY (code)
);

CREATE TABLE boxtype (
	id integer NOT NULL,
	name character varying(50) NOT NULL,
	CONSTRAINT pk_boxtype PRIMARY KEY (id)
);
INSERT INTO boxtype VALUES(1, 'Box (Man)');
INSERT INTO boxtype VALUES(2, 'Box (Woman)');
INSERT INTO boxtype VALUES(3, 'Box (Common)');

CREATE TABLE box (
	idtype integer NOT NULL,
	"number" integer NOT NULL,
	card character varying(15),
	"time" timestamp without time zone NOT NULL DEFAULT now(),
	CONSTRAINT pk_uniqe_box_key UNIQUE (idtype, "number")
);

CREATE TABLE product
(
  id integer NOT NULL,
  name character varying(25) NOT NULL,
  "desc" character varying(100) NOT NULL,
  count integer NOT NULL DEFAULT 0,
  price integer NOT NULL DEFAULT 0,
  CONSTRAINT pk_product PRIMARY KEY (id)
);
INSERT INTO product(id, name, "desc") VALUES(0, 'NEW', '-');
INSERT INTO product(id, name, "desc") VALUES(100, 'USER', 'Відвідувач');

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
