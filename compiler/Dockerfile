FROM node:18-alpine

# Install required runtimes and sandboxing tools
RUN apk add --no-cache \
    python3 \
    py3-pip \
    g++ \
    make \
    openjdk17 \
    bubblewrap \
    util-linux \
    tini

# Create a secure non-root user and sandbox directory
RUN adduser -D runner && \
    mkdir -p /sandbox && \
    chown runner:runner /sandbox && \
    chmod 700 /sandbox && \
    chmod 555 /usr/bin/python3 && \
    chmod 555 /usr/bin/g++ && \
    chmod 555 /usr/local/bin/node && \
    chmod 555 /usr/lib/jvm/java-17-openjdk/bin/java && \
    chmod 555 /usr/lib/jvm/java-17-openjdk/bin/javac


# 1. Install required tools
RUN apk update && apk add --no-cache bash build-base curl

# 2. Download and install GNU time
RUN curl -LO http://ftp.gnu.org/gnu/time/time-1.9.tar.gz && \
    tar -xvzf time-1.9.tar.gz && \
    cd time-1.9 && \
    ./configure && make && make install && \
    cd .. && rm -rf time-1.9 time-1.9.tar.gz

# 3. Replace BusyBox time with GNU time
RUN mv /usr/bin/time /usr/bin/time-busybox && \
    ln -s /usr/local/bin/time /usr/bin/time

    
# Switch to working directory
WORKDIR /usr/src/app

# Copy package files and install only production deps
COPY package*.json ./
RUN npm install --production

# Copy the rest of the source
COPY . .

# Use the non-root user
USER runner

EXPOSE 4000

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "server.js"]
