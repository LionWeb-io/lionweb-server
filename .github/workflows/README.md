# Github Workflows

There are two workflows that may run.

## CI Build and Test

The `main.yaml` workflow is the default Ci workflow that runs at each push and each pull request.
It perfoms the following steps

- Starts a Postgres docker image.
- Builds the LionWeb Server.
- Start the LionWeb Server
- Runs all the tests for the LionWeb Server

## Docker Image Creation
The `docker.yaml` workflow runs whenever a tag with the pattern `@lionweb/server@*`
is puished.
The workflow performs the following stepos:

- Build the LionWeb Server.
- Create a docker image from the built server.
- Publish the docker image to the github docker repository.
