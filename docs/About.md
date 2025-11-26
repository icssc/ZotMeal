## About

## About

Navigating UCI's dining options at Brandywine and the Anteatery is now simpler and more informed with ZotMeal. This comprehensive menu viewer, available as a website and mobile app, is designed to enhance your campus dining experience. UCI students use ZotMeal to plan their daily meals and track progress toward their nutritional goals.

Key features of ZotMeal include:

- **_Detailed Menu Viewer_**: Browse current and upcoming menus, allowing you 
to strategically plan your meal swipes and never miss your favorite dishes.
- **_Allergen and Dietary Information_**: Make informed choices with easy 
access to comprehensive ingredient and allergen details for every meal.
- **_Event Calendar_**: Stay updated on special dining hall events and limited-time offerings.
- **_Dish Ratings_**: Contribute your own feedback to help fellow Anteaters discover the best of campus dining.

![A screenshot of the ZotMeal website homepage.](./zotmeal-screenshot.jpg)

## Technology

ZotMeal consists of a Next.JS frontend with a shared backend. A summary of the libraries used in each are listed below.

### Frontend

- [Next.js](https://nextjs.org) - Full-stack React framework used for the website.
- [shad/cn](https://ui.shadcn.com/) - A library of fully customizable, plug-n-play components for use with React.
- [Zustand](https://github.com/pmndrs/zustand) - State management library for React apps. 

### Backend
- [Drizzle](https://drizzle.dev/) - ORM for Postgres.
- [AWS](https://aws.amazon.com/) - RDS and Lambda.
- [Serverless Framework](https://www.serverless.com/) - Framework for cloud resources such as AWS Lambda.
- [tRPC](https://trpc.io/) - Typesafe remote procedure calls to access the underlying Postgres database.

### Tooling

- [Turborepo](https://turborepo.com) - High-performance build system for monorepo scaling.
- [Tailwind](https://tailwindcss.com) - A utility-first CSS framework.
- [TypeScript](https://www.typescriptlang.org) - JavaScript with type-checking.
- [CommitLint](https://commitlint.js.org/) - A commit-message linter for conventional commits conformity.

## Contributing

We'd be happy to have your contributions to ZotMeal -- we're always looking to grow and change! Please see [Getting Started](/docs/contributor/zotmeal/getting-started) to learn how to contribute effectively.