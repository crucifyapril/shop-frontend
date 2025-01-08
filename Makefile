IMAGE = shop-learn-frontend
VERSION = 1.0
WORK_DIR = /app

NODE_VERSION = 22.12

.PHONY: logs

logs:
	@docker compose logs -f

clean:
	@rm -fr ./node_modules

install:
	@docker run -it --rm -v $$(pwd):/app -w /app --user 1000:1000 node:${NODE_VERSION} npm i
build:
	@docker run -it --rm -v $$(pwd):/app -w /app --user 1000:1000 node:${NODE_VERSION} npm run build
dev:
	@npm run dev

run:
	@docker run -it --rm -v $$(pwd):/app -w /app --user 1000:1000 node:${NODE_VERSION} $(cmd)
