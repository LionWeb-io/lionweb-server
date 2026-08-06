# Changelog

## 0.4.2

- Addition  of monitor API to enable the Admin UI to mintor all delta messages between all clients
- Possibility to use PgLite, the in-memory implementation of Postgres as database server 

## 0.4.0

- Implementation of the LionWeb Delta protocol.
- Ability to run server through `npx`
- Replace Pino logger because it didn't work inside docker

## 0.3.0

- Support for LionWeb 2024.1
- Removed `init` request from dbAdmin
- Request `createRepository` in dbAdmin has additional **mandatory** parameter `lionWebVersion`
  - All tests and applications need to add this parameter    
  - The server config section for creating repositories also has this additional field 
- All requests fail if the LionWeb version of the chunk is not the same LionWeb version as the repository. 

