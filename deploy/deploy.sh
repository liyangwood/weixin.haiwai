#!/usr/bin/env bash

deployGroup(){
    echo "*************************************************";
	echo "---- start to deploy Group project ----";
    . ./ENV.inc
    echo ${GROUP_ENV};
    cd Group;


    sudo mupx setup;
    sudo ${GROUP_ENV} mupx deploy;

    cd ../;
    echo "*************************************************";
    echo "";
}

case "$1" in
   Group)
      deployGroup
      ;;
   *)
      echo "usage {Group}"
      ;;

esac