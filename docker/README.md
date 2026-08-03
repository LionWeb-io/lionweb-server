# Docker

## Lionweb Repository Image
The `Dockerfile` in the root of the project specifies the creation of an image of the LionWeb repository server.

## Docker Compose
The `compose.yaml` starts up a container running both 
- The postgres database server image from the docker registry.
- The last published LionWeb Server image from the github registry.



## docker.yaml
Github CI to create and publish a docker image when a tage named `release.*` is pushed.
