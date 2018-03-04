# sector51

#### Docker 
1. **_Console_**  
docker exec -it web_container /bin/sh

2. **_Copy in to container_**  
docker cp d:\backup.sql db_container:/pr/backup.sql

3. **_Copy from container_**  
docker cp db_container:/pr/createDataBase.sql d:\GIT\sector51\docker\test\test.sql

#### Database
1. **_Backup_**  
docker exec -t -u postgres db_container pg_dumpall -c > d:/backup.sql

2. **_Restore_**  
docker exec -i db_container psql -U postgres < d:/backup.sql
