#!/bin/sh
# build.sh branch folder fullFileName.jar POSTGRES_DB POSTGRES_PASSWORD
set -e

mkdir /pr/temp
cd /pr/temp
../clone.sh $1 $2
cd /pr/temp/$2

jarFile=$3
propFile="$PWD/src/main/resources/application.properties"
pattern="localhost:5432/sector51"
replacement="db:5432/$4"
sed -i -e "s|$pattern|$replacement|g" "$propFile"
sed -i -e "s|password=12345678|password=$POSTGRES_PASSWORD|g" "$propFile"
chmod +x ./gradlew
./gradlew build -x test
cp -R ./build/libs/sector51server-0.0.1-SNAPSHOT.jar "$jarFile"

su -c "rm -r /pr/temp"
