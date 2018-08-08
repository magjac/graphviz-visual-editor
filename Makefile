GENERATED_FILES = \
	src/shapes.js \
	readme.html \

src/shapes.js: bin/generate-nodes.js
	bin/generate-nodes.js > tmp.js
	mv tmp.js $@

readme:
	./node_modules/markdown-to-html/bin/github-markdown README.md -h >readme.html

clean:
	rm -rf $(GENERATED_FILES)
