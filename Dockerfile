FROM tomcat:8-jdk8

LABEL maintainer="sebastian.raubach@hutton.ac.uk"

# Clone the Gatekeeper server code and client code
RUN git clone https://github.com/sebastian-raubach/gatekeeper-api.git /opt/gatekeeper-api && \
    git clone https://github.com/sebastian-raubach/gatekeeper-vue.git /opt/gatekeeper-client

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
    mkdir /opt/gatekeeper-api/client/ && \
    cp -a /opt/gatekeeper-client/dist/. /opt/gatekeeper-api/client/

# Download Gradle and build the server code
RUN wget https://services.gradle.org/distributions/gradle-6.0.1-bin.zip -P /tmp/ && \
    unzip /tmp/gradle-6.0.1-bin.zip -d /opt/ && \
    echo "data.directory.external=/data/gatekeeper" > /opt/gatekeeper-api/config.properties && \
    echo "project.name=gatekeeper" >> /opt/gatekeeper-api/gradle.properties && \
    /opt/gradle-6.0.1/bin/gradle -p /opt/gatekeeper-api war && \
    mkdir -p /usr/local/tomcat/webapps && \
    rm -rf /usr/local/tomcat/webapps/ROOT && \
    cp /opt/gatekeeper-api/build/libs/gatekeeper-4.0.0.war /usr/local/tomcat/webapps/ROOT.war

WORKDIR /