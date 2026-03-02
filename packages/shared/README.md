# Shared Package

Here we store data structures that we need to use from both the Client and the Server.

## How to generate Protobuf code

Protocol Buffers (abbreviated Protobuf) is a language-neutral, platform-neutral, extensible mechanism for serializing 
structured data, developed by Google.

In practice:

* One defines the structure of your data in a .proto schema file.
* From that schema, one can use the Protobuf compiler (protoc) to generate code in your target language (Java, Python, C++, Go, etc.).
* An application then uses the generated classes to serialize (encode) and deserialize (decode) data into a compact binary format.

In this project we decided to commit the generated code to the repository. So, you would need to install protoc only
if you want to modify the .proto schema. Otherwise, you can just use the generated code.

If you want to re-generate the cooe, you will need protoc installed (for example, on macOS you can install it with `brew install protobuf`).

From the root of this package run:

```
protoc --plugin=../../node_modules/.bin/protoc-gen-ts_proto --ts_proto_out=. --ts_proto_opt=esModuleInterop=true --ts_proto_opt=env=node --ts_proto_opt=importSuffix=.js src/proto/Chunk.proto
protoc --plugin=../../node_modules/.bin/protoc-gen-ts_proto --ts_proto_out=. --ts_proto_opt=esModuleInterop=true --ts_proto_opt=env=node --ts_proto_opt=importSuffix=.js src/proto/BulkImport.proto
```
