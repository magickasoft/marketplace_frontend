FROM node:7.4

RUN npm install -g yarn
RUN npm install -g pushstate-server

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# copy the package.json and yarn.lock file
COPY package.json /usr/src/app
COPY yarn.lock /usr/src/app

# install the dependencies
RUN yarn install

# copy source code
COPY . /usr/src/app

EXPOSE 3000

CMD MAPBOX_API_KEY=$MAPBOX_API_KEY APP_URL=$APP_URL yarn run prod && pushstate-server build 3000
