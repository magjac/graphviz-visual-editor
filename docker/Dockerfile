# Multi-stage build to reduce final image size
FROM node:lts-alpine3.15 as BUILD_IMAGE

# Install git and make
RUN apk update
RUN apk add git
RUN apk add make

# Clone graphviz visual editor
RUN git clone --depth 1 https://github.com/magjac/graphviz-visual-editor

WORKDIR /graphviz-visual-editor

# Install and make the dependencies
RUN npm install
RUN make
RUN npm run build

# Reduce the image size: remove development dependencies
RUN npm prune --production

# The stage that actually runs the application
FROM node:lts-alpine3.15

WORKDIR /graphviz-visual-editor

# Copy the built artifacts from the build image
COPY --from=BUILD_IMAGE /graphviz-visual-editor/build ./build
COPY --from=BUILD_IMAGE /graphviz-visual-editor/node_modules ./node_modules

RUN npm install -g serve

CMD ["serve", "-s", "build"]
