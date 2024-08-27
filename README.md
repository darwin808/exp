# UX 40 FE

## Overview

UX 40 using micro FE

## Requirements

- Node.js 22.3
- pnpm 9.3

## Prerequisites

- [pnpm](https://pnpm.io/installation)
- [Docker](https://www.docker.com/get-started)

## Getting Started

### Running Locally

1. Install dependencies:

   ```sh
   pnpm i
   ```

2. Serve the application:

   ```sh
   pnpm serve
   ```

### Running Using Docker

1. Build and start the containers:

   ```sh
   docker compose up --build
   ```

2. Open your browser and navigate to:

   ```
   http://localhost:3000/
   ```

## Testing

### Unit Tests

Run the Unit tests with the following command:

```sh
pnpm test
```

### End-to-End (E2E) Tests

Run the E2E tests with the following command:

```sh
pnpm test-e2e
```

## Adding a Module

To add a new module, follow these steps:

1. Copy the `poc_example` folder to create another module.
2. Change the `name` in the `package.json` file to `poc_YOUR_NAME`.
3. Update the port in the `vite.config.ts` file.
4. Register the new module in the `poc_host`.

### Example Registration

Add your module to the `remotes` section like this:

```js
remotes: {
  poc_remote_a: `${remoteViteReactUrl}/assets/remoteEntry.js`,
  poc_login: `${remoteLogin}/assets/remoteEntry.js`,
  open_day: 'http://localhost:3004/assets/remoteEntry.js',
},
```

### Using the `OpenDay` Component

To use the `OpenDay` component in your project, import it and include it in your JSX:

```js
import OpenDay from "open_day/page"
;<OpenDay />
```

## Contributing

Provide guidelines on how others can contribute to your project.

## License

State the license under which your project is distributed.
