FROM arm32v7/tomcat:8-jre8

LABEL maintainer="sebastian.raubach@hutton.ac.uk"

COPY qemu-arm-static /usr/bin/qemu-arm-static

# Clone the Gatekeeper server code and client code
RUN apt-get update && \
    apt-get install -y git && \
    git clone https://github.com/germinateplatform/gatekeeper-server.git /opt/gatekeeper-server && \
    git clone https://github.com/germinateplatform/gatekeeper-vue.git /opt/gatekeeper-client

# Install node.js
RUN apt-get update && \
    curl -sL https://deb.nodesource.com/setup_12.x | bash - && \
    apt-get update && \
    apt-get install -y nodejs

# Build the client code
WORKDIR /opt/gatekeeper-client
RUN rm -f .env && \
    echo "VUE_APP_BASE_URL=./api/" > .env
RUN apt-get install -y build-essential && \
    rm -f package-lock.json && \
    npm i && \
    npm run build && \
    mkdir /opt/gatekeeper-server/client/ && \
    cp -a /opt/gatekeeper-client/dist/. /opt/gatekeeper-server/client/

# Download Gradle and build the server code
RUN apt-get update && \
    apt-get install -y wget openjdk-8-jdk && \
    wget https://services.gradle.org/distributions/gradle-6.0.1-bin.zip -P /tmp/ && \
    unzip /tmp/gradle-6.0.1-bin.zip -d /opt/ && \
    echo "data.directory.external=/data/gatekeeper" > /opt/gatekeeper-server/config.properties && \
    echo "project.name=gatekeeper" >> /opt/gatekeeper-server/gradle.properties && \
    /opt/gradle-6.0.1/bin/gradle -p /opt/gatekeeper-server war && \
    mkdir -p /usr/local/tomcat/webapps && \
    rm -rf /usr/local/tomcat/webapps/ROOT && \
    cp /opt/gatekeeper-server/build/libs/gatekeeper-4.0.0.war /usr/local/tomcat/webapps/ROOT.war

WORKDIR /