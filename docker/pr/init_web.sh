#!/bin/sh
set -e
jarFile="/pr/sector51server.jar"

if [ ! -f "$jarFile" ]; then
  /pr/build.sh master sector51server "$jarFile"
fi

java -jar "$jarFile"
