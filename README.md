# Marketplace Frontend

## Install

```bash
yarn install
```

## Launching locally

```bash
export MAPBOX_API_KEY=[api_key_here]
export APP_URL="http://dev.backend.marketplace.agoradoxa.net/api/"
```

```bash
GMAP_API_KEY=$GMAP_API_KEY APP_URL=$APP_URL yarn run prod
```

## Docker launching
```bash
docker run -d -e MAPBOX_API_KEY="${MAPBOX_API_KEY}" -e APP_URL="http://dev.backend.marketplace.agoradoxa.net/api/" --name ${CONTAINER_NAME} -p ${EXPOSED_PORT}:3000 ${IMAGE_NAME}
```