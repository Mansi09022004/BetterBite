# BetterBite — D2C Protein Snacks Store

BetterBite is a direct-to-consumer protein snacks brand concept that I designed and built end to end: a full e-commerce website with login, cart and checkout, plus an AI support chatbot that answers customer questions from the store's own product documentation.

**Live site:** [betterbite-store.vercel.app](https://betterbite-store.vercel.app/)

## Features

- **Storefront:** browse products, view product details, add to cart
- **Accounts:** customer login and signup
- **Checkout and payments:** order flow with Razorpay integration
- **RAG support chatbot:** customers ask questions about products, ingredients, shipping and policies and get answers grounded in the store's documentation, not generic LLM guesses
- **Responsive UI** built with React, TypeScript and Tailwind CSS
- **Deployed on Vercel** with Supabase as the backend

## Architecture

```
 React + TypeScript frontend (Vercel)
        |
        |-- Auth, orders, products ----> Supabase (PostgreSQL)
        |-- Payments ------------------> Razorpay
        |-- Chatbot question
               |
               v
        Embed question (Gemini embeddings)
               |
               v
        Vector search in Supabase (pgvector)
               |
               v
        Top matching chunks -> LLM answers using only that context
```

## How the RAG chatbot works

1. **Ingest:** product and policy documentation is split into chunks.
2. **Embed:** each chunk is converted into a vector with Gemini embeddings.
3. **Store:** vectors are saved in Supabase using PostgreSQL + pgvector.
4. **Retrieve:** when a customer asks a question, it is embedded the same way and the closest chunks are found by vector similarity.
5. **Answer:** the model responds using only the retrieved context, so answers stay tied to the real product information.

## Reliability

Supabase free-tier projects pause after 7 days of inactivity. This once broke login, checkout and the chatbot ("Could not search the knowledge base"). I restored the project and added a scheduled **keep-alive** request (`/api/keep-alive`, run daily by a Vercel cron job) so the backend stays active.

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React, TypeScript, Tailwind CSS |
| Backend / database | Supabase (PostgreSQL, pgvector) |
| AI | Gemini embeddings, RAG pipeline |
| Payments | Razorpay |
| Hosting | Vercel (with cron jobs) |

## Project structure

| Path | Purpose |
|---|---|
| `src/` | Frontend source code |
| `api/` | Serverless functions (including the keep-alive endpoint) |
| `index.html` | App entry |
| `tailwind.config.js` | Tailwind setup |
| `package.json` | Dependencies and scripts |

## Run locally

1. Clone the repo and install dependencies:
```bash
   npm install
```
2. Create a `.env` file with your Supabase, Gemini and Razorpay keys.
3. Start the dev server:
```bash
   npm run dev
```

## What I learned

- Building a retrieval-augmented chatbot over real product data, from chunking to vector search
- Debugging a production outage caused by a free-tier database pausing, and preventing it with a scheduled keep-alive
- Wiring payments, auth and a vector database into one deployed app

## Author

Built by [Mansi Gangji](https://www.linkedin.com/in/mansi-gangji)
