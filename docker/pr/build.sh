#!/bin/sh
# build.sh branch folder fullFileName.jar 
#    POSTGRES_DB POSTGRES_PASSWORD EMAIL_USER EMAIL_PASSWORD
set -e

/pr/clone.sh $1 $2
cd /pr/temp/$2

jarFile=$3
propFile="$PWD/src/main/resources/application.properties"
pattern="localhost:5432/sector51"
replacement="db:5432/$4"
echo $6
echo $7
sed -i -e "s|$pattern|$replacement|g" "$propFile"
sed -i -e "s|password=12345678|password=$5|g" "$propFile"
sed -i -e "s|password=user@gmail.com|$6|g" "$propFile"
sed -i -e "s|password=email_password|$7|g" "$propFile"
cat $propFile
chmod +x ./gradlew
./gradlew build -x test
cp -R ./build/libs/sector51server-0.0.1-SNAPSHOT.jar "$jarFile"

su -c "rm -r /pr/temp"
