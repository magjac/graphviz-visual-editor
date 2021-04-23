FROM node:15.14.0-buster-slim

# Install git and install make
RUN apt update 
RUN apt install git -y
RUN apt install make -y

# Clone graphviz visual editor
RUN git clone --depth 1 https://github.com/magjac/graphviz-visual-editor

WORKDIR /graphviz-visual-editor

RUN npm install
RUN make
RUN npm run build
RUN npm install -g serve

CMD ["serve", "-s", "build"]