
# Base image
FROM node:22.3-alpine3.19

# Install pnpm
RUN npm install -g pnpm@9.3.0

# Set working directory
WORKDIR /app

# Copy pnpm configuration and lockfile
COPY pnpm-workspace.yaml ./
COPY pnpm-lock.yaml ./
COPY .npmrc ./

# Copy package.json files
COPY package.json ./
COPY apps/poc_dashboard/package*.json ./apps/poc_dashboard/
COPY apps/poc_host/package*.json ./apps/poc_host/
COPY apps/poc_login/package*.json ./apps/poc_login/
COPY apps/poc_example/package*.json ./apps/poc_example/
COPY apps/poc_hygiene/package*.json ./apps/poc_hygiene/


# Copy all files to the container
COPY . .

# Install dependencies
RUN pnpm install --frozen-lockfile && pnpm store prune

# Copy all files to the container
COPY . .

# Build the project
RUN pnpm build

# Expose the port the app runs on
EXPOSE 3000

# Start the app
CMD ["pnpm", "server"]
