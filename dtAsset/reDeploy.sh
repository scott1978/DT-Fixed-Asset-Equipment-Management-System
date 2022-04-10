#!bin/sh/
#crontab
#	2 2 * * * sh /opt/dt/reDeploy.sh
#############################################
v=2.2.26

####停止
docker stop dt-app dt-db
docker rm dt-app dt-db

docker run --name dt-db -t \
-e MYSQL_USER="dt" \
-e MYSQL_PASSWORD="dt_pwd" \
-e MYSQL_ROOT_PASSWORD=root_pwd \
-p 13309:3306 \
-d docker.io/algernonking/dtmysql:$v \
--character-set-server=utf8 \
--lower_case_table_names=1

sleep 15
#启动
docker run --name dt-app -t \
-v /data/upload:/usr/local/tomcat/webapps/upload \
--link=dt-db:db \
-p 26799:8080  \
-d docker.io/algernonking/dtapp:$v

exit 0