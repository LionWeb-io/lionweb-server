# Shared Package

Here we store data structures that we need to use from both the Client and the Server.

## How to generate FlatBuffers code

The FlatBuffers classes are needed here because the Client need to use them to serialize
and the server to deserialize them.

From the root of this package run:

```
flatc --ts -o src src/flatbuffers/chunk.fbs
flatc --ts -o src src/flatbuffers/bulkimport.fbs
```
