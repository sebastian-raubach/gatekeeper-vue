FROM node:12-alpine3.10 AS build

LABEL maintainer="sebastian.raubach@hutton.ac.uk"

COPY qemu-arm-static /usr/bin/qemu-arm-static

ARG BRANCH=master

# Force docker to not cache the next line
ADD https://api.github.com/repos/germinateplatform/gatekeeper-vue/git/refs/heads/master version.json
# Clone the Gatekeeper server code and client code
RUN echo "Pulling GitHub branch: $BRANCH"
RUN apk add --no-cache git && \
    git clone -b "$BRANCH" --single-branch --depth 1 https://github.com/germinateplatform/gatekeeper-server.git /opt/gatekeeper-server && \
    git clone -b "$BRANCH" --single-branch --depth 1 https://github.com/germinateplatform/gatekeeper-vue.git /opt/gatekeeper-client

# Build the client code
WORKDIR /opt/gatekeeper-client
RUN rm -f .env && \
    echo "VUE_APP_BASE_URL=./api/" > .env && \
    apk add --no-cache python build-base gcc wget && \
    npm i && \
    npm run build && \
    mkdir /opt/gatekeeper-server/client/ && \
    cp -a /opt/gatekeeper-client/dist/. /opt/gatekeeper-server/client/

# Download Gradle and build the server code
RUN apk add --no-cache openjdk11 && \
    wget https://services.gradle.org/distributions/gradle-6.0.1-bin.zip -P /tmp/ && \
    unzip /tmp/gradle-6.0.1-bin.zip -d /opt/ && \
    echo "data.directory.external=/data/gatekeeper" > /opt/gatekeeper-server/config.properties && \
    echo "project.name=gatekeeper" >> /opt/gatekeeper-server/gradle.properties && \
    /opt/gradle-6.0.1/bin/gradle -p /opt/gatekeeper-server war


FROM arm32v7/tomcat:8-jre11

LABEL maintainer="sebastian.raubach@hutton.ac.uk"

COPY qemu-arm-static /usr/bin/qemu-arm-static

RUN mkdir -p /usr/local/tomcat/webapps && \
    rm -rf /usr/local/tomcat/webapps/ROOT

COPY --from=build /opt/gatekeeper-server/build/libs/gatekeeper-*.war /usr/local/tomcat/webapps/ROOT.war

WORKDIR /usr/local/tomcat/
