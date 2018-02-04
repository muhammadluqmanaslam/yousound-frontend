#!/bin/bash

echo "removing old dist"
rm -rf ./ebdeploy/dist

echo "webpack build dist"
npm run build

echo "copying dist to node project"
cp -r ./dist/ ./ebdeploy/dist

echo "deploying"
cd ./ebdeploy && eb deploy