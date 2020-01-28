FROM ubuntu:xenial

ENV DEBIAN_FRONTEND=noninteractive \
    TERM=xterm \
    IONIC_VERSION=5.4.9 \
    NODEJS_VERSION=10.16.3 \
    PATH=$PATH:/opt/node/bin \
    LC_ALL=C.UTF-8 \
    LC_ALL=C.UTF-8

WORKDIR "/opt/node"

RUN apt-get update && apt-get install apt-utils software-properties-common apt-utils -y curl git ca-certificates --no-install-recommends && \
    curl -sL https://nodejs.org/dist/v${NODEJS_VERSION}/node-v${NODEJS_VERSION}-linux-x64.tar.gz | tar xz --strip-components=1

WORKDIR "/home"

RUN add-apt-repository ppa:deadsnakes/ppa && \
    apt-get update && \
    apt-get install -y fish bzip2 openssh-client python3.5 python3.5-dev python3-pip \
    libsasl2-dev libldap2-dev libssl-dev virtualenv gcc

RUN npm i -g --unsafe-perm ionic@${IONIC_VERSION}

RUN pip3 install flask python-ldap sqlalchemy flask-migrate mysql-connector-python flask-sqlalchemy pyopenssl

EXPOSE 8100
EXPOSE 8101
EXPOSE 80



