# AI chat worker

The "Ask about me" chat on the portfolio works without this: it answers from `src/content.ts`. Setting up this worker switches it to **Claude**, so it can answer questions in any wording. If the worker is ever down or busy, the chat quietly falls back to the built-in answers.

GitHub Pages only hosts static files, so the Anthropic API key can't go in the website (anyone could copy it). This small Cloudflare Worker holds the key instead and:

- only accepts requests from `https://tabee1999.github.io`
- limits each visitor to 20 messages per 10 minutes, and caps message length and reply length
- answers only from the public profile in `https://tabee1999.github.io/llms.txt` (generated from `src/content.ts`, so the chat and the site always agree)
- tells Claude not to invent anything, to stay on her professional profile, and to send salary, visa and personal questions to email
- never shows API errors or the key to visitors

It uses Claude Haiku, Anthropic's fastest and lowest-cost model. You pay Anthropic per message; the spending limit in step 1 caps the bill. Cloudflare Workers is free for this amount of traffic.

## Set it up (about 10 minutes, no coding)

### 1. Get an Anthropic API key

1. Sign in at [console.anthropic.com](https://console.anthropic.com).
2. Add a small amount of credit under **Billing**.
3. Under **Limits**, set a monthly spend limit you're comfortable with.
4. Under **API keys**, create a key named `portfolio-chat` and copy it.

### 2. Create the worker on Cloudflare

1. Sign up at [dash.cloudflare.com](https://dash.cloudflare.com) (free plan).
2. Go to **Workers & Pages → Create → Create Worker**. Name it `tabeeda-chat` and deploy the starter worker.
3. Click **Edit code**, replace everything with the contents of [`worker.js`](worker.js), and click **Deploy**.
4. Go to the worker's **Settings → Variables and Secrets → Add**. Choose type **Secret**, name `ANTHROPIC_API_KEY`, paste your key, and deploy.
5. Copy the worker's address, e.g. `https://tabeeda-chat.your-name.workers.dev`.

### 3. Connect the website

In `src/content.ts`, set:

```ts
chatEndpoint: "https://tabeeda-chat.your-name.workers.dev",
```

Commit and push. Once the deploy finishes, the chat header says **AI assistant**.

## Using the command line instead

```bash
npx wrangler login
npx wrangler deploy --config chat-worker/wrangler.toml
npx wrangler secret put ANTHROPIC_API_KEY --config chat-worker/wrangler.toml
```

## Settings

Optional variables (Cloudflare **Settings → Variables**, or `[vars]` in `wrangler.toml`):

| Variable | Default | What it does |
| --- | --- | --- |
| `MODEL` | `claude-haiku-5-5` | The Claude model used for replies |
| `ALLOWED_ORIGINS` | `https://tabee1999.github.io` | Websites allowed to use the chat, comma-separated (add `http://localhost:4321` to try it locally) |
| `PROFILE_URL` | `https://tabee1999.github.io/llms.txt` | Where the chat reads the profile it answers from |

## Tests

```bash
npm run test:worker
```

Covers the reply flow, CORS and origin checks, input validation, rate limiting, hidden upstream errors and the on-topic system prompt. The Anthropic API is mocked, so no key is needed. The website's Playwright tests cover the chat window in both modes, also with the AI service mocked.
