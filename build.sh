#!/bin/bash

cp app/src/config/config.json.example app/src/config/config.json

findUsername="\"username\": \"\""
username="\"username\": \"$1\""

findPassword="\"password\": \"\""
password="\"password\": \"$2\""

sed -i'' -e "s/$findUsername/$username/" app/src/config/config.json
sed -i'' -e "s/$findPassword/$password/" app/src/config/config.json

FILE=app/src/config/config.json-e
if test -f "$FILE"; then
    rm app/src/config/config.json-e
fi

docker-compose up -d --build