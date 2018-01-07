CREATE TABLE usersecurity (
	password character varying(100) NOT NULL,
	roles character varying(100) NOT NULL DEFAULT "USER",
	accountNonExpired boolean DEFAULT true,
	accountNonLocked boolean DEFAULT true,
	credentialsNonExpired boolean DEFAULT true,
	enabled boolean DEFAULT true,
	attempts integer NOT NULL DEFAULT 0,
	lastmodified timestamp without time zone NOT NULL DEFAULT now(),
	created timestamp without time zone NOT NULL DEFAULT now(),
	CONSTRAINT pk_uniqe_us UNIQUE (created),
	CONSTRAINT pk_user_security PRIMARY KEY (created)
);
INSERT INTO usersecurity(password, roles) VALUES('owner', 'OWNER');

CREATE TABLE userinfo (
	created timestamp without time zone NOT NULL DEFAULT now(),
	name character varying(25) NOT NULL,
	surname character varying(25) NOT NULL,
	phone character varying(20) NOT NULL,
	email character varying(50) NOT NULL,
	card character varying(15),
	balance integer NOT NULL DEFAULT 0,
	sex boolean,
	CONSTRAINT pk_uniqe_ui UNIQUE (created),
	CONSTRAINT pk_uniqe_ui_key UNIQUE (email, phone),
	CONSTRAINT pk_user_info PRIMARY KEY (created)
);
INSERT INTO userinfo(created, name, surname, phone, email, card) VALUES(
	(SELECT created FROM usersecurity LIMIT 1),
	'NameOwner', 'Surname', '+38(050) 111-11-11', 'owner@qa.team', '1234567898765');

CREATE TABLE barcode (
	productId integer NOT NULL,
	code character varying(13) NOT NULL,
	CONSTRAINT pk_uniqe_barcode UNIQUE (code),
	CONSTRAINT pk_barcode PRIMARY KEY (code)
);
INSERT INTO barcode(productId, code) VALUES(100, '1234567898765');

CREATE TABLE product
(
  id integer NOT NULL,
  name character varying(25) NOT NULL,
  "desc" character varying(100) NOT NULL,
  count integer NOT NULL DEFAULT 0,
  price integer NOT NULL DEFAULT 0,
  CONSTRAINT pk_uniqe_product UNIQUE (id),
  CONSTRAINT pk_product PRIMARY KEY (id)
);
INSERT INTO product (id, name, "desc") VALUES(0, 'NEW', '-');
INSERT INTO product (id, name, "desc") VALUES(100, 'USER', 'Відвідувач');

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
