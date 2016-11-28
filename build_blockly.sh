#!/bin/bash

mkdir .blockly_tmp

cd .blockly_tmp

echo 'Pulling blockly and closure...'

wget -O blockly.tar.gz https://github.com/google/blockly/tarball/master
wget -O closure.tar.gz https://github.com/google/closure-library/tarball/master

tar xzf blockly.tar.gz
tar xzf closure.tar.gz

mv google-blockly-* blockly
mv google-closure-library-* closure-library

echo 'Patching blockly'

rsync -av ../app/assets/vendor/blockly-patch/* ./blockly/

cd blockly

echo 'Building blockly'

./build.py

cp ./blockly_compressed.js ../../app/assets/vendor/google-blockly/blockly_compressed.js

cd ../../

echo 'Cleaning up'

rm -rf .blockly_tmp
