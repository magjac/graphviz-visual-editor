GENERATED_FILES = \
	src/shapes.js \

src/shapes.js: bin/generate-nodes.js
	bin/generate-nodes.js > tmp.js
	mv tmp.js $@

clean:
	rm -rf $(GENERATED_FILES)
