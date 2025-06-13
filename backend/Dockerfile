# Use official Node.js LTS image
FROM node:22.15.0

# Create and switch to a non-root user
RUN useradd -m appuser

# Set working directory
WORKDIR /usr/src/app

# Copy package.json files
COPY package*.json ./

# Install production dependencies only
RUN npm install --production

# Copy rest of the code as non-root
COPY --chown=appuser:appuser . .

# Create folders with permissions
RUN mkdir -p /usr/src/app/uploads /usr/src/app/uploadsProfile \
    && chown -R appuser:appuser /usr/src/app/uploads /usr/src/app/uploadsProfile \
    && chmod 750 /usr/src/app/uploads /usr/src/app/uploadsProfile

RUN apt-get update && \
    apt-get install -y time

# Use non-root user
USER appuser

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
