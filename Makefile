all: build test

build: move
	jison lib/grammar.y lib/lexer.l
	mv grammar.js dist/parser.js

move: lib
	mkdir -p dist
	cp lib/*.js dist/

test: move dist
	node test/all-tests.js

standalone: move dist
	node scripts/standalone.js | terser > standalone/bs.js

