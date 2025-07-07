# lionweb-server
Reference implementation of LionWeb repository

## Changes in Version 0.3.0

- Support for LionWeb 2024.1
- Removed `init` request from dbAdmin
- Request `createRepository` in dbAdmin has additional **mandatory** parameter `lionWebVersion`
  - All tests and applications need to add this parameter    
  - The server config section for creating repositories also has this additional field 
- All requests fail if the LionWeb version of the chunk is not the same LionWeb version as the repository. 
- 

## Postgres
The database used for storage of models is Postgres, 
the easiest way to set up Postgres is through Docker.

The Postgres version currently being used is: postgres:16.1.
The `.env` file contains the user/database/port names and numbers being used.

![picture of database schema](docs/database-schema.svg "Database Schema")

The `lionweb_properties.property`, `lionweb_containments.containment` and `lionweb_references.reference` 
fields are LionWeb metapointers.

We use `pgAdmin 4` to test queries and look directly into the database. 

### How to start Postgres through docker

```
# download docker
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
The server is started with `npm run dev-run` in  the `packages/server` folder:

```
cd packages/server
npm run dev-run
```

For more information on how to configure the server, please check [configuration.md](configuration.md).

### How to test
Ensure the Postgres server and the LionWeb server are both running.
Then do

```
npm run test
```

## Status
This server implents the full LionWeb [Bulk API](https://lionweb.io/specification/bulk/repo-access-api.html) as defined in the LionWeb specification.

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
