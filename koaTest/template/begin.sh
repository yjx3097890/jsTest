#!/bin/sh

port=`lsof -t -i:3001`
if [ "$port" != "" ]
then
     kill -9 $port
fi
port2=`lsof -t -i:3002`
if [ "$port2" != "" ]
then
  	kill -9 $port2
fi

port3=`lsof -t -i:35729`
if [ "$port3" != "" ]
then
  	kill -9 $port3
fi

pm2 kill &&
npm install --production && 


node resServer "$1" &
echo "\r\n---->start resource server ok! \r\n" &&

# echo "install deps done\r\n\r\n" &&
if [ "$1" == dev -o "$1" == "" ]
then
	gulp &
else
	# npm install pm2 -g && 
	npm start
fi
echo "---->start $1 server ok!\r\n\r\n" 
