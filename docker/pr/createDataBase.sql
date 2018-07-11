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
  birthday timestamp without time zone,
  CONSTRAINT pk_user_info PRIMARY KEY (created),
  CONSTRAINT pk_uniqe_ui_key UNIQUE (email, phone),
  CONSTRAINT uk_userinfo_card UNIQUE (card)
);

CREATE TABLE barcode (
	productId integer NOT NULL,
	code character varying(15) NOT NULL,
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

DO
$do$
BEGIN 
   FOR i IN 1..50 LOOP
      INSERT INTO box VALUES (1, i, '', now());
      INSERT INTO box VALUES (2, i, '', now());
      INSERT INTO box VALUES (3, i, '', now());
   END LOOP;
END
$do$;

CREATE TABLE product (
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
	email text,
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
	income integer,
	outcome integer,
	usercome integer,
	CONSTRAINT pk_history PRIMARY KEY (id)
);

CREATE TABLE service (
	id integer NOT NULL,
	name character varying(25),
	"desc" character varying(50),
	price integer NOT NULL DEFAULT 0,
	CONSTRAINT pk_service PRIMARY KEY (id)
);
INSERT INTO service VALUES(0, 'ABONEMENT', '-', 700);
INSERT INTO service VALUES(1, 'TRAINER', '-', 10);
INSERT INTO service VALUES(2, 'BOX', '-', 50);
INSERT INTO service VALUES(3, 'ABONEMENT (Morning)', '-', 550);
INSERT INTO service VALUES(4, 'ABONEMENT (Evening)', '-', 600);
INSERT INTO service VALUES(5, 'ABONEMENT 3', '-', 1900);
INSERT INTO service VALUES(6, 'ABONEMENT (Morning) 3', '-', 1450);
INSERT INTO service VALUES(7, 'ABONEMENT (Evening) 3', '-', 1600);
INSERT INTO service VALUES(8, 'ABONEMENT 6', '-', 3150);
INSERT INTO service VALUES(9, 'ABONEMENT (Morning) 6', '-', 2400);
INSERT INTO service VALUES(10, 'ABONEMENT (Evening) 6', '-', 2800);
INSERT INTO service VALUES(11, 'ABONEMENT 12', '-', 4600);
INSERT INTO service VALUES(12, 'ABONEMENT (Morning) 12', '-', 4000);
INSERT INTO service VALUES(13, 'ABONEMENT (Evening) 12', '-', 4400);
INSERT INTO service VALUES(14, 'TWELVE', '-', 500);

CREATE TABLE user_service (
  idservice integer NOT NULL,
  iduser timestamp without time zone NOT NULL,
  dtbeg timestamp without time zone,
  dtend timestamp without time zone,
  value character varying(50),
  CONSTRAINT pk_user_service PRIMARY KEY (idservice, iduser)
);


-- Trigger functions
CREATE OR REPLACE FUNCTION public."afterProductDelete"()
  RETURNS trigger AS
$BODY$begin
  delete from barcode where productid = old.id;
  return old;
end$BODY$
  LANGUAGE plpgsql VOLATILE COST 100;
ALTER FUNCTION public."afterProductDelete"() OWNER TO postgres;

CREATE OR REPLACE FUNCTION public."afterProductUpdate"()
  RETURNS trigger AS
$BODY$
declare
  delta integer;
  incomeV integer default 0;
  outcomeV integer default 0;
  newDesc character varying(50);
  ideventV integer default 5;
begin
  delta := new.count - old.count;
  ideventV := 5;
  newDesc := new.name;

  if (delta < 0) then
    incomeV := -1 * delta * new.price;
    newDesc := newDesc || ' (' || delta || ')';
  elseif (delta > 0) then
    outcomeV := delta * new.price;
    ideventV := 4;
    newDesc := newDesc || ' (' || delta || ')';
  else
    newDesc := new.name || ': price - ' || round(new.price / 100::decimal, 2)::varchar;
  end if;

  insert into history(idevent, iduser, time, "desc", income, outcome, usercome)
    values(ideventV, null, now(), newDesc, incomeV, outcomeV, 0);
  
  return new;
end$BODY$
  LANGUAGE plpgsql VOLATILE COST 100;
ALTER FUNCTION public."afterProductUpdate"() OWNER TO postgres;


CREATE OR REPLACE FUNCTION public."afterUserDelete"()
  RETURNS trigger AS
$BODY$BEGIN
  DELETE FROM user_service WHERE iduser = OLD.created;
  DELETE FROM barcode WHERE code = OLD.card;
  DELETE FROM usersecurity WHERE created = OLD.created;
  RETURN OLD;
END$BODY$
  LANGUAGE plpgsql VOLATILE COST 100;
ALTER FUNCTION public."afterUserDelete"() OWNER TO postgres;
COMMENT ON FUNCTION public."afterUserDelete"() IS 'Clean Box before user delete.';

CREATE OR REPLACE FUNCTION public."afterUserServiceDelete"()
  RETURNS trigger AS
$BODY$begin
  update box set card = null where card =
    (select card from userinfo where created = old.iduser);
  return old;
end$BODY$
  LANGUAGE plpgsql VOLATILE COST 100;
ALTER FUNCTION public."afterUserServiceDelete"() OWNER TO postgres;

CREATE OR REPLACE FUNCTION public."logOnProductInsert"()
  RETURNS trigger AS
$BODY$begin
  insert into history(idevent, iduser, time, "desc", income, outcome, usercome)
    values(4, null, now(), new.name || '; price - ' || round (new.price / 100::decimal, 2)::varchar, 0, 0, 0);
  return new;
end$BODY$
  LANGUAGE plpgsql VOLATILE COST 100;
ALTER FUNCTION public."logOnProductInsert"() OWNER TO postgres;

CREATE OR REPLACE FUNCTION public."afterUserServiceInsert"()
  RETURNS trigger AS
$BODY$begin
  IF new.idservice = 2 THEN
    UPDATE box SET card = (SELECT card FROM userinfo WHERE created = new.iduser) WHERE number = new.value::int AND idtype = 3;
  END IF;
  INSERT INTO history(idevent, iduser, time, "desc", income, outcome, usercome)
  VALUES(2, new.iduser, now(), (SELECT name FROM service WHERE id = new.idservice),
    (SELECT price FROM service WHERE id = new.idservice) * 100, 0, 0);
  return new;
end$BODY$
  LANGUAGE plpgsql VOLATILE COST 100;
ALTER FUNCTION public."afterUserServiceInsert"() OWNER TO postgres;


CREATE OR REPLACE FUNCTION public."afterUserInsert"()
  RETURNS trigger AS
$BODY$begin
  INSERT INTO barcode(productId, code) VALUES(100, new.card);
  return new;
end$BODY$
  LANGUAGE plpgsql VOLATILE COST 100;
ALTER FUNCTION public."afterUserInsert"() OWNER TO postgres;

--Triggers
CREATE TRIGGER tr_after_product_delete
  AFTER DELETE
  ON public.product
  FOR EACH ROW
  EXECUTE PROCEDURE public."afterProductDelete"();

CREATE TRIGGER tr_after_product_insert
  AFTER INSERT
  ON public.product
  FOR EACH ROW
  EXECUTE PROCEDURE public."logOnProductInsert"();

CREATE TRIGGER tr_after_product_update
  AFTER UPDATE
  ON public.product
  FOR EACH ROW
  EXECUTE PROCEDURE public."afterProductUpdate"();

CREATE TRIGGER tr_after_user_service_insert
  AFTER INSERT
  ON public.user_service
  FOR EACH ROW
  EXECUTE PROCEDURE public."afterUserServiceInsert"();

CREATE TRIGGER tr_after_user_service_delete
  AFTER DELETE
  ON public.user_service
  FOR EACH ROW
  EXECUTE PROCEDURE public."afterUserServiceDelete"();

CREATE TRIGGER tr_after_user_delete
  AFTER DELETE
  ON public.userinfo
  FOR EACH ROW
  EXECUTE PROCEDURE public."afterUserDelete"();

CREATE TRIGGER tr_after_user_insert
  AFTER INSERT
  ON public.userinfo
  FOR EACH ROW
  EXECUTE PROCEDURE public."afterUserInsert"();
