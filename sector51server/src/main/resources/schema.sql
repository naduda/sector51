-- users
create table users
(
	id bigint
		constraint users_pk
			primary key,
	name varchar(50),
	username varchar(15),
	email varchar(40),
	password varchar(100) not null
);

create unique index users_email_uindex
	on users (email);
-- users

create table roles
(
	id bigint
		constraint roles_pk
			primary key,
	name varchar(25)
);

create table user_roles
(
	user_id bigint
		constraint user_roles_pk
			primary key,
	role_id bigint not null
);

