#!/bin/sh
set -e
echo $@

if [ $# -eq 0 ]; then
    echo "No arguments supplied"
fi

for i in "$@"; do
case $i in
    -e=*|--extension=*)
    EXTENSION="${i#*=}"
    shift # past argument=value
    ;;
    -s=*|--POSTGRES_PASSWORD=*)
    POSTGRES_PASSWORD="${i#*=}"
    shift # past argument=value
    ;;
    -s=*|--DB_NAME=*)
    DB_NAME="${i#*=}"
    shift # past argument=value
    ;;
    *)
    ;;
esac
done

if [ ! -d "$PGDATA/base" ]; then
  apk update && apk add tzdata && \
  cp /usr/share/zoneinfo/Europe/Kiev /etc/localtime && \
  echo "Europe/Kiev" > /etc/timezone && apk del tzdata
  date
  gosu postgres initdb -E UTF-8
  gosu postgres postgres &

  until ps axg | grep -vw grep | grep -w 'postgres: stats collector process'; do sleep 1; done

  gosu postgres psql -U postgres -c "ALTER USER postgres WITH SUPERUSER PASSWORD '$POSTGRES_PASSWORD';"
  gosu postgres psql -U postgres -tc "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME'" | grep -q 1 || \
                     psql -U postgres -c "CREATE DATABASE $DB_NAME;"
  gosu postgres psql -U postgres -d $DB_NAME -f /pr/createDataBase.sql
  gosu postgres pg_ctl stop

  echo "host all all 0.0.0.0/0 md5" >> $PGDATA/pg_hba.conf
  sed -ri "s/^#(listen_addresses\s*=\s*)\S+/\1'*'/" $PGDATA/postgresql.conf
fi

exec gosu postgres postgres
#apk update
#apk add libx11 libxt libxtst libxext libxdmcp libxau libice libsm libxcb libc libdl libuuid libxinerama
# docker run --rm --name test -v /d/git/sector51/docker/pr:/pr -it test8 postgres
# psql -U postgres -c "DROP DATABASE $DB_NAME"
# su postgres sh -c "pg_ctl -D "$PGDATA" -m fast -w stop"

if [ ! -d "/pr/proj" ]; then
   mkdir /pr/proj && cd /pr/proj
#   git clone https://github.com/naduda/sector51.git
#   echo '============'
#   cp /pr/security.properties ./wm/src/main/resources/security.properties
#   cd wm && mvn package
#   cp target/wm.jar /pr/wm.jar -f && cd / && rm -rf /pr/proj
fi
