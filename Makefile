COMPONENT := ./node_modules/.bin/component

JS := $(shell find -name '*.js' -print)

build: components $(JS)
	$(COMPONENT) build --dev --verbose

clean:
	rm -rf build components

components: component.json
	@$(COMPONENT) install --dev --verbose
