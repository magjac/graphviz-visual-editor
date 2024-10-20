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
	bin/generate-nodes.js > $@.tmp
	mv $@.tmp $@

src/graphvizVersion.js: bin/generate-graphviz-version.js
	bin/generate-graphviz-version.js > $@.tmp
	mv $@.tmp $@

src/versions.json: CHANGELOG.md bin/generate-versions.py
	bin/generate-versions.py CHANGELOG.md > $@.tmp
	mv $@.tmp $@

src/graphviz-versions.json: graphviz/CHANGELOG.md bin/generate-versions.py
	bin/generate-versions.py graphviz/CHANGELOG.md > $@.tmp
	mv $@.tmp $@

src/dotParser.js: src/dotGrammar.pegjs
	npx peggy --format es --output $@.tmp $<
	echo "/* eslint-disable */" | cat - $@.tmp > $@.tmp2
	mv $@.tmp2 $@
	rm $@.tmp

graphviz/CHANGELOG.md: graphviz

graphviz:
	git clone --depth 1 https://gitlab.com/graphviz/graphviz.git $@.tmp
	mv $@.tmp $@

dots parse-all-graphviz-dots: dotfiles.txt
	for dotfile in `cat dotfiles.txt`; do \
	  echo $$dotfile; \
	  ./bin/dotparser.js < $$dotfile > `dirname $$dotfile`/`basename $$dotfile .dot`.json; \
	done

dotfiles.txt: graphviz
	find graphviz -name '*.dot' | egrep -v "(nullderefrebuildlist\.dot|^graphviz/tests/.*)$$" > $@.tmp
	mv $@.tmp $@

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
