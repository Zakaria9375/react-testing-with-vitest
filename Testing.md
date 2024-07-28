# Testing

## Setup

1. Setup the following dependencies

```shell
npm i -D vitest @vitest/ui @testing-library/react jsdom @testing-library/jest-dom @testing-library/user-event
```

for api mocking

```shell
npm i -D  msw@latest
npm i -D @mswjs/data
```

for fake date

```shell
npm i -D faker-js/faker
```

2. Add the following scripts

```json
{
	"test": "vitest",
	"test:ui": "vitest --ui",
	"coverage": "vitest run --coverage"
}
```

## Shortcuts

By vitest extension installation you can have

- vi -> to add imports
- d -> to add describe
- i -> to add it
- itr -> to add screen and render

## Config

```js
/// <reference types="vitest" />

import { defineConfig } from "vitest/config";

defineConfig({
	test: {
		environment: "jsdom",
		globals: true,
		css: true,
		setupFiles: ["./vitest.setup.ts"],
	},
});

export default defineConfig;
```

You need to setup tsconfig.json

```json
// tsconfig.json
{
	"compilerOptions": {
		"types": ["@testing-library/jest-dom", "vitest/globals"]
	},
	"include": ["src", "tests"]
}
```

## SetupFile

```ts
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

Object.defineProperty(window, "matchMedia", {
	writable: true,
	value: vi.fn().mockImplementation((query) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: vi.fn(), // deprecated
		removeListener: vi.fn(), // deprecated
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		dispatchEvent: vi.fn(),
	})),
});

afterEach(() => {
	cleanup();
});
```
