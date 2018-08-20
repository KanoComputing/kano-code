#!/bin/bash

# Exit in case of failure
set -e

cd ..

echo "Rebuilding and pushing to Pi"
npm install
NODE_ENV=production TARGET=rpi gulp build

DEST_IP='10.0.0.114'
DEST_USER='kano'

SOURCE_DIR="$(pwd)/"

DEST_DIR="/tmp/$(logname)-$(basename `pwd`)"
DEST_STR="$(printf "%s@%s:%s" "$DEST_USER" "$DEST_IP" "$DEST_DIR")"

echo "Copying from: $SOURCE_DIR"
echo "Copying to: $DEST_STR"

SSH_STR="$(which ssh) -o StrictHostKeyChecking=no"

THIS_FILE="$(basename "$0")"

rsync -avz -e "$SSH_STR" --exclude="$THIS_FILE" --exclude=.git --exclude='*.swp' --exclude=node_modules --exclude='*.pyc' --exclude=.DS_Store "$SOURCE_DIR" "$DEST_STR"
