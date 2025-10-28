# Use an official Node runtime as base image
FROM node:20-alpine

# Create app directory
WORKDIR /app

# Copy your test script
COPY js_identifier_test.mjs .

# Run the tests by default when the container starts
CMD ["node", "js_identifier_test.mjs"]
