GENERATED_FILES = \
	src/graphvizVersion.js \
	src/graphviz-versions.json \
	src/shapes.js \
	src/versions.json \
	readme.html \
	changelog.html \
	src/dotParser.js \
	graphviz \
	dotfiles.txt \

main: $(GENERATED_FILES)

src/shapes.js: bin/generate-nodes.js
	bin/generate-nodes.js > tmp.js
	mv tmp.js $@

src/graphvizVersion.js: bin/generate-graphviz-version.js
	bin/generate-graphviz-version.js > tmp.js
	mv tmp.js $@

src/versions.json: CHANGELOG.md bin/generate-versions.py
	bin/generate-versions.py CHANGELOG.md > tmp.js
	mv tmp.js $@

src/graphviz-versions.json: graphviz/CHANGELOG.md bin/generate-versions.py
	bin/generate-versions.py graphviz/CHANGELOG.md > tmp.js
	mv tmp.js $@

src/dotParser.js: src/dotGrammar.pegjs
	node_modules/.bin/pegjs $< tmp.js
	echo "/* eslint-disable */" | cat - tmp.js > tmp2.js
	mv tmp2.js $@
	rm tmp.js

graphviz graphviz/CHANGELOG.md:
	git clone --depth 1 https://gitlab.com/graphviz/graphviz.git

dots parse-all-graphviz-dots: dotfiles.txt
	for dotfile in `cat dotfiles.txt`; do \
	  echo $$dotfile; \
	  ./bin/dotparser.js < $$dotfile > `dirname $$dotfile`/`basename $$dotfile .dot`.json; \
	done

dotfiles.txt: graphviz
	find graphviz -name '*.dot' | egrep -v "(nullderefrebuildlist\.dot|^graphviz/rtest/.*)$$" > $@

readme: readme.html

readme.html: README.md
	./node_modules/markdown-to-html/bin/github-markdown README.md -h >readme.html

changelog: changelog.html

changelog.html: CHANGELOG.md
	./node_modules/markdown-to-html/bin/github-markdown CHANGELOG.md -h >changelog.html

clone-build:
	rm -rf /tmp/`basename \`pwd\`` && git clone `pwd`/.git /tmp/`basename \`pwd\`` && cd /tmp/`basename \`pwd\`` && npm install && make && npm run build

clone-test:
	rm -rf /tmp/`basename \`pwd\`` && git clone `pwd`/.git /tmp/`basename \`pwd\`` && cd /tmp/`basename \`pwd\`` && npm install && make && env CI=true npm test

public: clone-test push-tag

push-tag: push
	git push origin `git rev-parse --abbrev-ref HEAD`:`git tag -l | grep '^v[0-9]*\.[0-9]*\.[0-9]*$$' | tail -1`

push:
	git push origin `git rev-parse --abbrev-ref HEAD`

pull:
	git checkout master
	git fetch
	git rebase origin/master

howto:
	cat HOWTO

clean:
	rm -rf $(GENERATED_FILES)
