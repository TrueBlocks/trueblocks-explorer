.PHONY: generate

generate:
	@cd ../dev-tools/goMaker && yarn deploy && cd -
	@goMaker

clean:
	@rm -fR node_modules
	@rm -fR frontend/node_modules
	@rm -fR build/bin

