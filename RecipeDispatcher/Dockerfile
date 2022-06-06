FROM node:alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install pnpm
RUN apk add --no-cache curl \
    && curl -sL https://unpkg.com/@pnpm/self-installer | node

COPY package.json ./

RUN pnpm install --production --quiet

COPY src src
COPY config config

CMD [ "node", "src/index.mjs" ]
