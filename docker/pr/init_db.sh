#!/bin/bash
set -e

sed -i "s/\\r//g" /pr/settings.properties
while read -r line; do declare  $line; done </pr/settings.properties

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
  ALTER USER postgres WITH SUPERUSER PASSWORD '$POSTGRES_PASSWORD';
  CREATE DATABASE $POSTGRES_DB;
EOSQL

psql -U postgres -d sector51 -f /pr/createDataBase.sql
