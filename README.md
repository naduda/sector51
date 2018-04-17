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


###### **_Surname_**	**_Name_**	**_Phone_**	**_Sex_**	**_Card_**	**_abontype_**	**_dtbeg_a_**	**_dtend_a_**	**_box_**	**_dtbeg_b_**	**_dtend_b_**
###### Petrenko	Petro	380501111111	M	2236302078256	M	12.03.2018	12.06.2018	13	12.03.2018	12.04.2018
###### Циганог	Наташа	380502222222	W	2236302078255	E	01.03.2018	01.06.2018	22	01.03.2018	01.04.2018
