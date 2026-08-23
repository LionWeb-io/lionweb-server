# lionweb-server
Reference implementation of LionWeb repository

## Howto run the server

To run the server you need two applications
1
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

Download docker image of postgres
```bash
docker pull postgres:16.1
```
Create a container and run it
```bash
docker run --shm-size=1g -d --name lionwebrepodb -p 5432:5432 -e POSTGRES_PASSWORD=lionweb postgres:16.1
```

If you start the Postgres container from Docker Desktop, ensure to give the following parameters:
* host port is 5432
* POSTGRES_PASSWORD = lionweb

Then initialize the lionweb-server from a terminal in the `packages/server` folder,
and run the server:
```bash
npm run dev-local-setup
npm run dev-local-dev
```
### Running Postgres + lionweb-server though docker compose

Build the docker image for the lionweb-server
```bash
docker build  . -t lionweb-server
```
Run docker images for postgres and lionweb-server
```bash
docker compose -f docker-local/compose.yaml up
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

### server-adminapi-http
Contains code to manipulate the Postgres database (create, initialize)

### server
The main LionWeb server.
Manages the connections to the databases.
Gets all apis from other packages.

### server-common
Utility classes and functions shared by all other packages.

### server-logging
Utility classes and functionsfor logging server code.

### server-database
Utility classes and functions for the postgres database connection.

## API packages
These packages all provide an API with one or more functions.

### server-lionweb-bulkapi-http
The API's for the bulk protocol as specified in LionWeb.

### server-additionalapi-http
Some additiona API functions.

### server-inspectionapi-http
API's to inspect the contents of the nodes table.

### server-languages-http
The API functions to add/remove LionWeb languages to the server.
NOTE: not implemented yet, it is a placeholder.

### server-delta-client
Code for a TypeScript client for sending and receiving delta messages to/from the server.

### server-delta
Server side code for the delta protocol.

### server-delta-shared
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
```
Alternatively you can specify a specific version
```
docker pull ghcr.io/lionweb-io/lionweb-server:release-lionweb-server-0.4.2
```


# Multiple ways to run the server

|                    | Postgres Database | LionWeb Server                    | Admin UI                         | 
|--------------------|-------------------|-----------------------------------|----------------------------------|
| Docker-compose 1   | Docker            | Docker of released server         | Docker of released admin UI      |
| Docker-compose 2   | Docker            | Docker of locally build sever     | Docker of released admin UI      |
| Docker-compose 3   | Docker            | Docker of locally build sever     | Docker of locally build admin UI |
| Docker + npx       | Docker            | npx @lionweb/server-server@latest | npx admin UI                     |
| In memory Postgres | Pglite            | npx @lionweb/server-server@latest | npx admin UI                     |

