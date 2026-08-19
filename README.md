# ClashCoder

ClashCoder is a web application for viewing Clash of Clans clan members, roles, Town Hall levels, trophies, and lifetime war stars.

## Features

- Search for a clan by clan tag.
- View current clan members and their roles.
- View Town Hall levels and trophies.
- View lifetime war stars for each member.
- Sort members by war stars or Town Hall level.

## Requirements

- Node.js 18 or later
- A Clash of Clans API token from the [Clash of Clans Developer Portal](https://developer.clashofclans.com/)

## Run Locally

1. Clone the repository:

   ```bash
   git clone https://github.com/Pratik-Ugile28/clashcoder.git
   cd ClashCoder
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the project root:

   ```env
   CLASH_API_TOKEN=your_clash_of_clans_api_token
   ```

4. Start the server:

   ```bash
   npm start
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Endpoints

### Get clan members

```text
GET /clan-members?clanTag=CLAN_TAG
```

### Get clan members with lifetime war stars

```text
GET /clan-war-members?clanTag=CLAN_TAG
```

The `#` symbol is optional when entering a clan tag.

## Deploy on Vercel

This repository includes a Vercel serverless entry point and routing configuration.

1. Push the repository to GitHub.
2. In Vercel, select **Add New > Project**.
3. Import this GitHub repository.
4. Leave the framework preset as **Other**.
5. Add `CLASH_API_TOKEN` under the project environment variables.
6. Click **Deploy**.

Vercel automatically detects the `api/index.js` function. The `vercel.json` rewrite sends both the website and API requests to the Express application.

Do not commit your `.env` file or expose your API token publicly.

## License

This project is available under the ISC license specified in `package.json`.