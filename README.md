# ens2-be

## Create db migration
Before install typeorm globally in your machine `npm -g typeorm` next launch this command `typeorm migration:create -n ${migration-name} -d ${project_root}/src/database/migrations/`

## Start db migrations

`npm start db.migrate`

## SMS
To send SMS you have add in your hosts' file the row:
````
192.168.99.39           fastinfo.ilvillage.it
````

### .env changes
````
SMS_URL="http://fastinfo.ilvillage.it:8080/fastinfo/webservices/web-send.jsp"
SMS_ID="241"
SMS_KEY="7F63254375581EB7BB4A"
SMS_SENDER="3202043207"
````