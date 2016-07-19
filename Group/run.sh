#!/usr/bin/env bash

#soft link
rm $PWD/client/_ui_
ln -s $PWD/../_ui_ $PWD/client/_ui_

PACKAGE_ROOT=$PWD/../_package_:$PWD/../_library_
ENV="PACKAGE_DIRS=$PACKAGE_ROOT"

MONGOURL=mongodb://127.0.0.1:27017/HW-Weixin


#echo $ENV

stopMongoDB() {
  stopProcess "mongod.*$PORT_MONGODB"
  stopProcess "tail.*logs/mongodb"
}

stopProcess() {
  ps -ef | grep "$1" | grep -v grep | awk '{print $2}' | xargs kill -9
}
runLocalHost(){

    PORT=8000
    #stopMongoDB

    tmp=`echo $1 |sed 's/[0-9]//g'`
    if [ -n "$1" ] && [ -z "${tmp}" ] && [ $1 -gt 2900 ]
    then
        PORT=$1
        echo "PORT=$PORT"
    fi


    export MONGO_URL=$MONGOURL

    echo "---- start set env ----"
    export $ENV
    echo "PACKAGE_DIRS=${PACKAGE_DIRS}"
    echo "---- set env end ----"

    #meteor --settings settings-dev.json --port $PORT
    sudo -E meteor --port $PORT
}

runGoogleEWC(){
    PORT=7010
    MONGOURL=mongodb://127.0.0.1:27017/HW-Weixin

    export MONGO_URL=$MONGOURL

    echo "---- start set env ----"
    export $ENV
    echo "PACKAGE_DIRS=${PACKAGE_DIRS}"


    sudo meteor run --port $PORT

    echo "---- set env end ----"
}

runGoogleEWCNoRunning(){
    PORT=7010
    MONGOURL=mongodb://127.0.0.1:27017/HW-Weixin

    ps -ef |grep meteor|grep 7010 |awk '{print $2}'|xargs sudo kill -9
    ps -ef |grep meteor|grep 7011 |awk '{print $2}'|xargs sudo kill -9

    export MONGO_URL=$MONGOURL

    echo "---- start set env ----"
    export $ENV
    echo "PACKAGE_DIRS=${PACKAGE_DIRS}"


    sudo -E meteor run --settings settings.json --port $PORT >nohup.log &
    #meteor run --settings settings.json --port $PORT >nohup.log &

    echo "---- set env end ----"

    #sudo iptables -t nat -D PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 7000
    #sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 7000
    #sudo iptables-save
}



case "$1" in
    google_nohup)
        runGoogleEWC $1
        ;;

    google)
        runGoogleEWCNoRunning $1
        ;;

    *)
        runLocalHost $1
        ;;

esac