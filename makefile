.PHONY: app

app:
	@rm -fR build/bin
	@wails build
	@open build/bin/TrueBlocks\ Explorer.app/

update:
	@go mod tidy
	@cd frontend ; yarn upgrade --latest ; cd -

lint:
	@yarn lint

test:
	@export $(grep -v '^#' ../.env | xargs) >/dev/null && yarn test
	@cd dalle ; make test ; cd - >/dev/null 2>&1 

generate:
	@cd ../dev-tools/goMaker && yarn deploy && cd -
	@goMaker
#	@echo "Generating wails models..."
#	@wails generate module 2>&1 >/dev/null

clean:
	@rm -fR node_modules
	@rm -fR frontend/node_modules
	@rm -fR build/bin

