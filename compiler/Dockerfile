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
