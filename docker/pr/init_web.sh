#!/bin/sh
set -e

sed -i "s/\\r//g" /pr/settings.properties
while read assignment; do
  export "$assignment"
done </pr/settings.properties

jarFile="/pr/sector51server.jar"
if [ ! -f "$jarFile" ]; then
  /pr/build.sh $GIT_BRANCH sector51server "$jarFile"
fi

java -jar "$jarFile"
