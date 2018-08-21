GENERATED_FILES = \
	src/shapes.js \
	readme.html \

src/shapes.js: bin/generate-nodes.js
	bin/generate-nodes.js > tmp.js
	mv tmp.js $@

readme:
	./node_modules/markdown-to-html/bin/github-markdown README.md -h >readme.html

clone-test:
	rm -rf /tmp/`basename \`pwd\`` && git clone `pwd`/.git /tmp/`basename \`pwd\`` && cd /tmp/`basename \`pwd\`` && npm install && make && npm run build

public: push-tag npm-build npm-publish

push-tag: push
	git push origin `git rev-parse --abbrev-ref HEAD` : `git tag -l | grep '^v[0-9]*\.[0-9]*\.[0-9]*$$' | tail -1`

push:
	git push origin `git rev-parse --abbrev-ref HEAD`

pull:
	git checkout master
	git fetch
	git rebase origin/master

DIR=/tmp/graphviz-visual-editor-npm

npm-build:
	dir=`pwd`; rm -rf $(DIR); mkdir -p $(DIR); cd $(DIR); git clone $$dir/.git; cd graphviz-visual-editor; npm install; make; npm run build

npm-test: npm-build
	cd $(DIR)/graphviz-visual-editor; npm test

npm-publish:
	cd $(DIR)/graphviz-visual-editor; npm publish

clean:
	rm -rf $(GENERATED_FILES)
