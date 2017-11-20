#!/bin/bash
set -e

sed "s/\\r//g" /pr/settings.properties > /tmp/settings
while read -r line; do declare $line; done < /tmp/settings
rm -f /tmp/settings && rm -f /tmp/settings
POSTGRES_DB=$(echo "$POSTGRES_DB" | tr '[:upper:]' '[:lower:]')

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
  ALTER USER postgres WITH SUPERUSER PASSWORD '$POSTGRES_PASSWORD';
  CREATE DATABASE $POSTGRES_DB;
EOSQL

psql -U postgres -d $POSTGRES_DB -f /pr/createDataBase.sql
