# Shared Package

Here we store data structures that we need to use from both the Client and the Server.

## How to generate ProtoBuf code

You will need protoc installed (for example, on macOS you can install it with `brew install protobuf`).

From the root of this package run:

```
protoc --plugin=../../node_modules/.bin/protoc-gen-ts_proto --ts_proto_out=. --ts_proto_opt=esModuleInterop=true --ts_proto_opt=env=node --ts_proto_opt=importSuffix=.js src/proto/Chunk.proto
protoc --plugin=../../node_modules/.bin/protoc-gen-ts_proto --ts_proto_out=. --ts_proto_opt=esModuleInterop=true --ts_proto_opt=env=node --ts_proto_opt=importSuffix=.js src/proto/BulkImport.proto
```
