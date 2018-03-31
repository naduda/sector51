#!/bin/bash
set -e

sed -i "s/\\r//g" /tmp/settings.properties
sed -i 's/"//g' /tmp/settings.properties
while read -r line; do declare $line; done < /tmp/settings.properties
rm -f /tmp/settings.properties
POSTGRES_DB=$(echo "$POSTGRES_DB" | tr '[:upper:]' '[:lower:]')

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
  ALTER USER postgres WITH SUPERUSER PASSWORD '$POSTGRES_PASSWORD';
  CREATE DATABASE $POSTGRES_DB;
EOSQL

psql -U postgres -d $POSTGRES_DB -f /pr/createDataBase.sql
