.PHONY: app

test:
	@export $(grep -v '^#' ../.env | xargs) >/dev/null && go test ./...

update: build-db
	@go get "github.com/TrueBlocks/trueblocks-sdk/v5@latest"
	@go get github.com/TrueBlocks/trueblocks-core/src/apps/chifra@latest
	@go mod tidy

build-db:
	@echo "Building databases.tar.gz..."
	@cd pkg/storage && tar -czf databases.tar.gz databases
	@tar -tzf pkg/storage/databases.tar.gz
	@echo "Building series.tar.gz..."
	@cd pkg/storage && tar -czf series.tar.gz series
	@tar -tzf pkg/storage/series.tar.gz

lint:
	@golangci-lint run

clean:
	@rm -fR node_modules
	@rm -fR build/bin

# Build & serve documentation book (mdBook) from ./book
.PHONY: book
book:
	$(MAKE) -C book serve