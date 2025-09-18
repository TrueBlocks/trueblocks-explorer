# Testing & Contributing

## Running Tests

**trueblocks-dalle** uses Go’s standard testing tools. To run all tests, first load your environment variables (if needed):

```sh
export $(grep -v '^#' .env | xargs) && go test ./...
```

## Contributing

We welcome contributions! To get started:

1. Fork the repository
2. Create a feature branch
3. Write tests for new features
4. Open a pull request

Please follow Go best practices and keep the public interface minimal.

## Code Style

- Use `gofmt` for formatting
- Write clear, concise comments
- Prefer composition over inheritance
