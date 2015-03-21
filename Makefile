# Various programs
browserify := ./node_modules/.bin/browserify
jshint := ./node_modules/.bin/jshint
uglifyjs := ./node_modules/.bin/uglifyjs
karma := ./node_modules/.bin/karma

# Build options
src := src/choice.js
all := $(shell $(browserify) --list $(src))

dist/choice.js: $(all)
	@mkdir -p dist
	$(browserify) -s Choice $(src) | $(uglifyjs) -m -o $@

lint:
	$(jshint) src test

clean:
	rm -rf dist

test: lint dist/choice.js
	$(karma) start test/karma.conf.js

publish: test
	npm publish

.PHONY: clean lint test publish
