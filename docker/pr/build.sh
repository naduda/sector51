#!/bin/sh
# build.sh branch folder fullFileName.jar
set -e

while read assignment; do
  export "$assignment"
done </pr/settings.properties

mkdir /pr/temp
cd /pr/temp
../clone.sh $1 $2

cd /pr/temp/$2
propFile="$PWD/src/main/resources/application.properties"
pattern="localhost:5432/sector51"
replacement="db:$POSTGRES_PORT/$POSTGRES_DB"

sed -i -e "s|$pattern|$replacement|g" "$propFile"
chmod +x ./gradlew
./gradlew build -x test
cp -R ./build/libs/sector51server-0.0.1-SNAPSHOT.jar "$3"

cd /pr
su -c "rm -r /pr/settings.properties"
su -c "rm -r /pr/temp"
