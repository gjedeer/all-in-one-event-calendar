#!/bin/bash

which twigjs >/dev/null

if [[ $? -eq 0 ]]
then

	twigjs \
		--output ../js_src/twigjs/ \
		--module amd \
		--twig 'external_libs/twig", "agenda' \
		../themes-ai1ec/vortex/twig/agenda.twig
	mv \
		twigjs/agenda.twig.js \
		twigjs/agenda.js
	twigjs \
		--output ../js_src/twigjs \
		--module amd \
		--twig 'external_libs/twig", "oneday' \
		../themes-ai1ec/vortex/twig/oneday.twig
	mv \
		twigjs/oneday.twig.js \
		twigjs/oneday.js
	exit 0
else

	echo 'Error: twig.js not found. Install Node.js then: npm install -g twig'
	exit 1
fi