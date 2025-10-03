# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


## Local development notes

This project uses Vite. To run the dev server:

1. Install dependencies: `npm install`
2. Start the frontend: `npm run dev`

Cyber News: the app can fetch headlines from NewsAPI.org. To enable this feature locally create a `.env` file in the project root with:

```
VITE_NEWSAPI_KEY=your_newsapi_key_here
```

If you don't have a NewsAPI key the app will show a helpful message in the news modal.

There is also a small local API server in `server.mjs` used for grading/logging. Run it with:

```
npm run api
```

Security note
-------------

Do NOT commit your real API keys to the repository. Use `.env` for local secrets and keep `.env` in `.gitignore` (this project already ignores `.env`). If you accidentally expose a key (for example by pasting it into a public place), rotate it immediately using the provider's dashboard (NewsAPI has a rotate/revoke option on your API settings).
