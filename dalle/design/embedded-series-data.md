# Design Document: Embedded and Managed Series Data

## 1. Background

The `dalleserver` application currently utilizes a robust system for managing its "database" files (`.csv` files). These files are embedded within the application binary inside a `databases.tar.gz` archive. On startup, a `CacheManager` checks the integrity of a local cache (`~/.local/share/trueblocks/dalle/cache`) by comparing the hash of the embedded archive against a stored hash in a manifest file. If the cache is stale or missing, it is wiped and rebuilt from the embedded data. This ensures that the application's data is always in sync with the compiled version.

In contrast, the "series" data (`.json` files) is managed differently. These files reside in `~/.local/share/trueblocks/dalle/series`, and the application reads them directly from the filesystem. If a requested series file does not exist, it is created on-the-fly. This makes the `series` directory a dynamic, user-modifiable space rather than a managed asset.

This document proposes a design to make the handling of `series` data identical to the `databases` data, thereby providing a version-controlled, consistent, and robust mechanism for managing the default set of series.

## 2. Proposed Changes

The core proposal is to treat the `series` data as a managed, cached asset derived from an embedded source, exactly like the databases.

### 2.1. Introduce Embedded `series.tar.gz`

A new compressed archive, `series.tar.gz`, will be created. This archive will contain the default set of series definition files (e.g., `default.json`, `art-deco.json`, etc.).

This archive will be embedded into the application binary using the `//go:embed` directive in a new file, `dalle/pkg/storage/series.go`:

```go
//go:embed series.tar.gz
var embeddedSeries []byte
```

### 2.2. Extend the Cache Management System

The existing `CacheManager` will be enhanced to manage both the database cache and the new series cache.

1.  **Extend the Cache Manifest**: The `cache_manifest.json` file will be updated to store two separate hashes: one for the databases and one for the series.

    ```json
    {
      "databases_hash": "sha256_hash_of_databases_tar_gz",
      "series_hash": "sha256_hash_of_series_tar_gz"
    }
    ```

2.  **Dual Hashing**: On startup, the `CacheManager` will compute the SHA256 hash of both the embedded `databases.tar.gz` and the new `embeddedSeries` byte slice.

3.  **Independent Cache Validation**: The manager will compare each calculated hash against its corresponding value in the manifest. This allows the database and series caches to be validated and rebuilt independently, although in practice they will be managed together.

### 2.3. Treat `series` Directory as a Cache

The directory `~/.local/share/trueblocks/dalle/series` will no longer be treated as a primary data source. Instead, it will be considered a **cache directory**.

If the `CacheManager` detects that the `series_hash` is different from the one in the manifest (or if the manifest/directory is missing), it will perform the following actions:
1.  **Wipe the Directory**: The entire `~/.local/share/trueblocks/dalle/series` directory will be deleted.
2.  **Re-create and Populate**: The directory will be re-created, and its contents will be populated by extracting all the JSON files from the embedded `series.tar.gz`.
3.  **Update Manifest**: The `series_hash` in `cache_manifest.json` will be updated to the new hash.

### 2.4. Modify Series Loading Logic

The `dalle/context.go:loadSeries` function will be simplified. Since the `CacheManager` will guarantee that the `series` directory is present and correct upon application start, `loadSeries` will no longer need to check for file existence or create files on-the-fly. It will simply read the required `[series_name].json` file directly from the now-cached `series` directory.

## 3. Consequences and Behavioral Changes

Adopting this design has several important implications:

1.  **Version-Controlled Series**: The default series definitions will be part of the source code repository and versioned along with the application. This ensures consistency and reliability across all installations.

2.  **Loss of Dynamic Creation**: The ability for a user to create a new series simply by requesting it will be removed. The set of available series will be defined by the contents of the embedded `series.tar.gz`.

3.  **`series` Directory Becomes Volatile**: The `~/.local/share/trueblocks/dalle/series` directory will become a managed cache. **Any manual modifications or new JSON files added to this directory by a user will be deleted** whenever the application is updated with a new `series.tar.gz`. This is a critical change in behavior that moves away from treating this location as persistent user storage.

This change aligns the `series` data handling with the robust and self-contained model already proven for the databases, leading to a more predictable and maintainable application.
