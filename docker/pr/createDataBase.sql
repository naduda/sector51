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
	trainer timestamp without time zone,
	birthday timestamp without time zone,
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
	"desc" character varying(50),
	CONSTRAINT pk_event PRIMARY KEY (id)
);
INSERT INTO event VALUES(0, 'IN', 'Somebody in ...');
INSERT INTO event VALUES(1, 'OUT', 'Somebody out ...');
INSERT INTO event VALUES(2, 'SERVICE', 'Somobody buy...');
INSERT INTO event VALUES(3, 'SERVICE', 'Updated');
INSERT INTO event VALUES(4, 'BUY', 'Product to stock');
INSERT INTO event VALUES(5, 'SELD', 'Seld product');

CREATE TABLE history (
	id SERIAL,
	idEvent integer NOT NULL,
	idUser timestamp without time zone,
	time timestamp without time zone NOT NULL DEFAULT now(),
	"desc" character varying(50),
	CONSTRAINT pk_history PRIMARY KEY (id)
);

CREATE TABLE service (
	id integer NOT NULL,
	name character varying(15),
	"desc" character varying(50),
	price integer NOT NULL DEFAULT 0,
	CONSTRAINT pk_service PRIMARY KEY (id)
);
INSERT INTO service VALUES(0, 'ABONEMENT', '-', 0);
INSERT INTO service VALUES(1, 'TRAINER', '-', 0);
INSERT INTO service VALUES(2, 'BOX', '-', 50);

CREATE TABLE user_service (
	idService integer NOT NULL,
	idUser timestamp without time zone,
	dtBeg timestamp without time zone,
	dtEnd timestamp without time zone,
	CONSTRAINT pk_user_service PRIMARY KEY (idService, idUser)
);
