#!/bin/sh
set -e

jarFile="/pr/sector51server.jar"
if [ ! -f "$jarFile" ]; then
  sed -i "s/\\r//g" /tmp/settings.properties
  sed -i 's/"//g' /tmp/settings.properties
  while read assignment; do
    export "$assignment"
  done </tmp/settings.properties
  rm -f /tmp/settings.properties
  POSTGRES_DB=$(echo "$POSTGRES_DB" | tr '[:upper:]' '[:lower:]')
  /pr/build.sh $GIT_BRANCH sector51server "$jarFile" $POSTGRES_DB $POSTGRES_PASSWORD
fi

java -jar "$jarFile"
