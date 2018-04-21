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
  CONSTRAINT fk_user_info FOREIGN KEY (created)
      REFERENCES public.usersecurity (created) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE CASCADE,
  CONSTRAINT pk_uniqe_ui_key UNIQUE (email, phone),
  CONSTRAINT uk_userinfo_card UNIQUE (card)
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
INSERT INTO service VALUES(0, 'ABONEMENT', '-', 550);
INSERT INTO service VALUES(1, 'TRAINER', '-', 0);
INSERT INTO service VALUES(2, 'BOX', '-', 50);
INSERT INTO service VALUES(3, 'ABONEMENT (Morning)', '-', 450);
INSERT INTO service VALUES(4, 'ABONEMENT (Evening)', '-', 500);

CREATE TABLE user_service (
  idservice integer NOT NULL,
  iduser timestamp without time zone NOT NULL,
  dtbeg timestamp without time zone,
  dtend timestamp without time zone,
  value character varying(50),
  CONSTRAINT pk_user_service PRIMARY KEY (idservice, iduser),
  CONSTRAINT fk_user_service_user FOREIGN KEY (iduser)
      REFERENCES public.userinfo (created) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE CASCADE
);


-- Trigger functions
CREATE OR REPLACE FUNCTION public."afterProductDelete"()
  RETURNS trigger AS
$BODY$begin
  delete from barcode where productid = old.id;
  return old;
end$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION public."afterProductDelete"()
  OWNER TO postgres;

CREATE OR REPLACE FUNCTION public."afterUpdateProduct"()
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
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION public."afterUpdateProduct"()
  OWNER TO postgres;


CREATE OR REPLACE FUNCTION public."afterUserDelete"()
  RETURNS trigger AS
$BODY$BEGIN
  DELETE FROM user_service where iduser = OLD.created;
  DELETE FROM barcode WHERE code = OLD.card;
  RETURN OLD;
END$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION public."afterUserDelete"()
  OWNER TO postgres;
COMMENT ON FUNCTION public."afterUserDelete"() IS 'Clean Box before user delete.';

CREATE OR REPLACE FUNCTION public."afterUserServiceDelete"()
  RETURNS trigger AS
$BODY$begin
  update box set card = null where card =
    (select card from userinfo where created = old.iduser);
  return old;
end$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION public."afterUserServiceDelete"()
  OWNER TO postgres;

CREATE OR REPLACE FUNCTION public."logOnProductInsert"()
  RETURNS trigger AS
$BODY$begin
  insert into history(idevent, iduser, time, "desc", income, outcome, usercome)
    values(4, null, now(), new.name || '; price - ' || round (new.price / 100::decimal, 2)::varchar, 0, 0, 0);
  return new;
end$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION public."logOnProductInsert"()
  OWNER TO postgres;

CREATE OR REPLACE FUNCTION public."logOnUserServiceInsert"()
  RETURNS trigger AS
$BODY$begin
  insert into history(idevent, iduser, time, "desc", income, outcome, usercome)
  values(2, new.iduser, now(), (select name from service where id = new.idservice),
    (select price from service where id = new.idservice) * 100, 0, 0);
  return new;
end$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION public."logOnUserServiceInsert"()
  OWNER TO postgres;

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
  EXECUTE PROCEDURE public."afterUpdateProduct"();

CREATE TRIGGER tr_after_user_service_delete
  AFTER DELETE
  ON public.user_service
  FOR EACH ROW
  EXECUTE PROCEDURE public."afterUserServiceDelete"();

CREATE TRIGGER tr_log_afrer_insert
  AFTER INSERT
  ON public.user_service
  FOR EACH ROW
  EXECUTE PROCEDURE public."logOnUserServiceInsert"();

CREATE TRIGGER tr_after_user_delete
  AFTER DELETE
  ON public.userinfo
  FOR EACH ROW
  EXECUTE PROCEDURE public."afterUserDelete"();
