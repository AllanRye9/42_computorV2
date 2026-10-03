TSC = ./node_modules/.bin/tsc
NAME = bin/computorV2

all: $(NAME)

install-deps: node_modules/.bin/tsc

node_modules/.bin/tsc:
	npm install --no-save --no-package-lock typescript @types/node

build: node_modules/.bin/tsc
	$(TSC) --target ES2020 --module NodeNext --moduleResolution NodeNext \
		--rootDir . --outDir dist --strict false --esModuleInterop \
		--skipLibCheck --types node --rewriteRelativeImportExtensions \
		computorV2/computorV2.ts
	mkdir -p bin
	printf '%s\n' '#!/bin/sh' \
		'SCRIPT_DIR=$$(CDPATH= cd -- "$$(dirname -- "$$0")" && pwd)' \
		'exec node "$$SCRIPT_DIR/../dist/computorV2/computorV2.js" "$$@"' \
		> $(NAME)
	chmod +x $(NAME)

$(NAME): build

clean:
	rm -f $(NAME)
	rm -rf dist

fclean: clean
	rm -rf node_modules
	rm -f package-lock.json

re: fclean all

.PHONY: all install-deps build clean fclean re
