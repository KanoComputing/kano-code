#!/bin/bash

set -e

cd ..

gulp build

pushd www
COPYFILE_DISABLE=true tar cvzf ../assets.tar.gz --exclude=.DS_Store --exclude='*.tar.gz' .
popd
