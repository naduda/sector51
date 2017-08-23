FROM anapsix/alpine-java:8_jdk

ENV LANG en_US.utf8
ENV PGDATA /var/lib/postgresql/data
ENV DB_NAME qwe
ENV POSTGRES_PASSWORD qwe
ENV MAVEN_VERSION 3.3.9
ENV MAVEN_HOME /usr/lib/mvn
ENV PATH $PATH:$MAVEN_HOME/bin
ENV GOSU_VERSION 1.10

RUN mkdir -p $PGDATA && chown -R postgres $PGDATA && chmod 0700 -R $PGDATA
VOLUME /var/lib/postgresql/data

ADD ./pr/init.sh /pr/

RUN apk update && \
    apk add postgresql postgresql-client git wget && \
    wget http://archive.apache.org/dist/maven/maven-3/$MAVEN_VERSION/binaries/apache-maven-$MAVEN_VERSION-bin.tar.gz && \
    tar -zxvf apache-maven-$MAVEN_VERSION-bin.tar.gz && \
    rm apache-maven-$MAVEN_VERSION-bin.tar.gz && \
    mv apache-maven-$MAVEN_VERSION /usr/lib/mvn && \
    rm -rf /var/cache/apk/*

RUN set -ex && \
	apk update && \
	apk add --no-cache --virtual .gosu-deps dpkg gnupg openssl && \
	dpkgArch="$(dpkg --print-architecture | awk -F- '{ print $NF }')" && \
	wget -O /usr/local/bin/gosu "https://github.com/tianon/gosu/releases/download/$GOSU_VERSION/gosu-$dpkgArch" && \
	wget -O /usr/local/bin/gosu.asc "https://github.com/tianon/gosu/releases/download/$GOSU_VERSION/gosu-$dpkgArch.asc" && \
	export GNUPGHOME="$(mktemp -d)" && \
	gpg --keyserver ipv4.pool.sks-keyservers.net --recv-keys B42F6819007F00F88E364FD4036A9C25BF357DD4 && \
	gpg --batch --verify /usr/local/bin/gosu.asc /usr/local/bin/gosu && \
	rm -r "$GNUPGHOME" /usr/local/bin/gosu.asc && \
	chmod +x /usr/local/bin/gosu && \
	gosu nobody true && \
	apk del .gosu-deps

ENTRYPOINT ["/pr/init.sh"]