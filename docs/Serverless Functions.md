## Cron Jobs

Inside the `./apps/server` you will something like this

```
📦apps/server  
 ┣ 📂node_modules
 ┣ 📂src/functions
 ┃   ┣ 📂cron
 ┃   ┗ 📂trpc    
 ...
```

The `src/functions/trpc` directory is used for creating API endpoints for our tRPC functions (for future work)

Inside the `src/functions/cron` we can find:

```
📂cron  
 ┣ 📜broadcastNotification.ts  
 ┣ 📜daily.ts    
 ┗ 📜weekly.ts
```

Each of these `.ts` functions corresponds to a specific ****cron**** job that our app performs.

- **Daily**: Fetches the menu from CampusDishAPI for the current day and inserts it into the database. Runs every day at midnight to ensure the most up to date menu information.

- **Weekly**: Fetches all menus from CampusDishAPI for all days at most 2 week away from today. Allows users to see future menus for up to 2 week away.

- **BroadcastNotification**: Broadcasts a notification using expo notifications when special events are occurring on the given day.

## Server Functions

The main functionality of these jobs can be found in the `./packages/api/src/server` subdirectory.

#### server/daily

Functions in `parse.ts`

`getCampusDishMenu`
	Fetches and parses the CampusDish menu for a given date.
- Input: `Date`, `RestaurantName`, `string` (periodId)
- Returns: `CampusDishMenu`

`upsertMenusForDate`
	Fetches and upserts the CampusDish menu for all periods of a given date.
- Input: `Date`, `RestaurantName`
- Returns: None

Functions in `index.ts`

`daily`
	Performs the daily cron job action: Fetches the menu for the current date and upserts it into the database.
- Input: `Date`, `RestaurantName`
- Returns: None

#### server/weekly

`weekly`
	Performs the weekly cron job action: Fetches the menu for all 14 days after the current date and upserts them into the database.
- Input: `Date`, `RestaurantName`
- Returns: None

#### Server/scrapeEvents

`getHTML`
	Fetches the raw HTML of the page from the URL provided
- Input: `string` (URL)
- Returns: `string` (HTML)

`scrapeEvents`
	Scrapes the events from the events page URL provided to create a list of all upcoming events.
- Input: `string` (HTML)
- Returns: `Event[]`