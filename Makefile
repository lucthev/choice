browserify := ./node_modules/.bin/browserify
babel := ./node_modules/.bin/babel
standard := ./node_modules/.bin/standard
uglifyjs := ./node_modules/.bin/uglifyjs
karma := ./node_modules/.bin/karma

srcfiles := $(wildcard src/*.js)
libfiles := $(patsubst src/%.js,lib/%.js,$(srcfiles))

choice.min.js: $(libfiles)
	$(browserify) -s Choice lib/choice.js | $(uglifyjs) -m -o $@

debug: $(libfiles)
	$(browserify) -s Choice lib/choice.js -o choice.min.js

lib/%.js: src/%.js
	@mkdir -p lib
	$(babel) $< -o $@

lint:
	$(standard) src/**/*.js

clean:
	rm -rf lib/ choice.min.js

test: choice.min.js
	$(karma) start test/karma.conf.js

publish: lint test
	npm publish

.PHONY: debug lint clean test publish
