#!/bin/bash

# cat package.json > _package.json

# SAM does not support workspace syntax
# cat _package.json | grep -v "workspace" > package.json

sam build --template template.yaml --manifest package.json

# cat _package.json > package.json
# rm _package.json

# rsync -a --copy-links build-folder destination-folder
