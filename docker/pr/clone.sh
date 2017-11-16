#!/bin/sh
# clone.bat branch folder
set -e

git init
git remote add origin https://github.com/naduda/sector51.git
git config core.sparsecheckout true
echo "$2/*" >> .git/info/sparse-checkout
git pull --depth=1 origin $1
