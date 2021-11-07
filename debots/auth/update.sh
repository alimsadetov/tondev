#!/bin/bash
set -e
tos=tonos-cli

debot_name=AuthDebot
debot=$(cat $debot_name.addr)
debot_abi=$(cat $debot_name.abi.json | xxd -ps -c 20000)
new_state=$( base64 -w 0 $debot_name.tvc)
echo "{\"state\":\"$new_state\"}" > upgrade.txt

LOCALNET=http://127.0.0.1
DEVNET=net.ton.dev
export NETWORK=$DEVNET

$tos --url $NETWORK call $debot upgrade upgrade.txt --sign $debot_name.keys.json --abi $debot_name.abi.json
$tos --url $NETWORK call $debot setABI "{\"dabi\":\"$debot_abi\"}" --sign $debot_name.keys.json --abi $debot_name.abi.json
#./tonos-cli call $debot setIcon "{\"icon\":\"$icon\"}" --sign $debot_name.keys.json --abi $debot_name.abi.json
rm upgrade.txt
echo DONE