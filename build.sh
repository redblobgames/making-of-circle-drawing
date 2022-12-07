#!/bin/sh
mkdir -p _build/
esbuild --bundle lib.js --minify --format=esm --outfile=_build/lib.js
