#BROWSERIFY=node ./node_modules/browserify/bin/cmd.js
all:
#	$(BROWSERIFY) ./client.js -o bundle.js -i ecstatic  -i './lib/http'
	browserify ./client.js -o bundle.js -i ecstatic  -i './lib/http'
