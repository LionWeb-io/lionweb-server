# lionweb-server
Reference implementation of LionWeb repository

## Changes in Version 0.4.0

- Implementation of the LionWeb Delta protocol.
- Ability to run server through `npx`
- Replace Pino logger because it didn't work inside docker

- ## Changes in Version 0.3.0

- Support for LionWeb 2024.1
- Removed `init` request from dbAdmin
- Request `createRepository` in dbAdmin has additional **mandatory** parameter `lionWebVersion`
  - All tests and applications need to add this parameter    
  - The server config section for creating repositories also has this additional field 
- All requests fail if the LionWeb version of the chunk is not the same LionWeb version as the repository. 

## Howto run the server

To run the server you need two applications

1. Run a Postgres server, easiest done through using docker.
   There are postgres images available, we are using Postgres 16.1
2. Run the LionWeb server, easiest done through using `npx`:
```asciidoc
npx  @lionweb/server-server@0.4.0 --run --config server-config.json 
```
You should ensure that the Postgress information in the `server-config.json` corresponds
with the Postgres you are running.

## Postgres
The database used for storage of models is Postgres, 
the easiest way to set up Postgres is through Docker.

The Postgres version currently being used is: postgres:16.1.
The `.env` file contains the user/database/port names and numbers being used.

![picture of database schema](docs/database-schema.svg "Database Schema")

The `lionweb_properties.property`, `lionweb_containments.containment` and `lionweb_references.reference` 
fields are LionWeb metapointers.

We use `pgAdmin 4` or the database plugin in WebStorm to test queries and look directly into the database. 

### How to start Postgres through docker

```
# download docker image of postgres
docker pull postgres:16.1

# create a container and run it
docker run --shm-size=1g -d --name lionwebrepodb -p 5432:5432 -e POSTGRES_PASSWORD=lionweb postgres:16.1
```

### How to build

```
npm install
npm run build
npm run lint
```

### How to start the LionWeb server
Ensure that Postgres is running.

If you have a local copy of the project from github,
the server is started with `npm run dev-<???>-run` in  the `packages/server` folder:
For example:
```
cd packages/server
npm run dev-local-run
```

If you don't want to checkout the code, use npx:
```asciidoc
npx  @lionweb/server-server@0.4.0-beta.5 --run --config server-config.json
```
Make sure that you have the `server-config.json`  file locally and
that the values in the file correspons to your local situation.

For more information on how to configure the server, please check [configuration.md](configuration.md).

### How to test
Ensure the Postgres server and the LionWeb server are both running.
Then do

```
npm run test
```

## Status
This server implements the full LionWeb [Bulk API](https://lionweb.io/specification/bulk/repo-access-api.html) as defined in the LionWeb specification.

The server also implements the full LionWeb Delta protocol.

##  Main Packages

### dbadmin
Contains code to manipulate the Postgres database (create, initialize)

### server
The main LionWeb server.
Manages the connections to the databases.
Gets all apis from other packages.

### common
Utility classes and functions shared by all other packages.

## API packages
These packagesa all provide an API with one or more functions.

### bulkapi
The API's for the bulk protocol as specified in LionWeb.

### additionalapi
Some additiona API functions.

### inspection
API's to inspect the contents of the nodes table.

### languages
The API functions to add/remove LionWeb languages to the server.
NOTE: not implemented yet, it is a placeholder.

### delta-client
Code for a TypeScript client for sending and receiving delta messages to/from the server.

### delta-server
Server side code for the delta protocol.

### delta-shared
Shared code (like delta type definitions) for the delta protocol.

### test
Tests for the core package

## CI
In GitHub actions a Postgres server is started on a host named `postgres`.
In your local development environment, this hostname is also being used.
You need to ensure that this hostname points to the Postgres server. 

## Authentication

It is possible to specify a token to be expected by the server in each request (see [configuration.md](configuration.md)).
This mechanism is intended to make possible to expose the LionWeb server while providing a minimum level of 
security. When the token is specified while launching the server, then each request to the server will be checked
for the presence of the same token in the `Authorization` header.

## How to perform a release

To release the lionweb server run the script `scripts/tag-and-release-docker-image.sh` from the root of the project. 
 
The details of how this works and how to answer the questions being asked
are described in the [README.md](scripts/README.md) in the scripts folder.

## How to use the Docker image

You can get the docker image from the Docker repository hosted by GitHub:

```
docker pull ghcr.io/lionweb-io/lionweb-server:latest 
# alternatively you can specify a specific version
docker pull ghcr.io/lionweb-io/lionweb-server:release-lionweb-server-0.1.1
```
