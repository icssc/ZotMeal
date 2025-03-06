# The Nextjs Frontend

The other half of ZotMeal's frontend -- written in the [Next.js](https://nextjs.org) framework.

## Table of Contents
1. [App Structure](#app-structure)
2. [Components](#components)
    a. [📂 App](#-app)
    b. [📂 Components](#-components)
    c. [📂 Lib](#-lib)
3. [Backend Integration](#backend-integration)

# App Structure

The web app is contained in apps/next, which should look something like:

```
📦apps/next
 ┣ 📂.next
 ┣ 📂node_modules
 ┣ 📂public
 ┣ 📂src
 ┃ ┣ 📂app
 ┃ ┣ 📂components
 ┃ ┣ 📂lib
 ┃ ...
 ...
```

We will now go into detail about each subdirectory of `📂src`, where most of the work is done.

## 📂 App
In `📂app`, we use Next.js file router to establish **pages**, which are web pages rendered individually from one another, each with a unique URL.

```
📂app
 ┣ 📂about
 ┣ 📂events
 ┣ favicon.ico
 ┣ globals.css
 ┣ layout.tsx
 ┣ page.tsx
```

Without going too far into the weeds of the [Next.js page router](https://nextjs.org/docs/pages/building-your-application/routing/pages-and-layouts), let's breakdown each element:

- `📂about` & `📂events`: Each folder in Next (if containing a `page.tsx`) represents a page. In this case, `/about` and `/events`.
- `favicon.ico`: The favicon of the website (the little image that appears next to the tab name).
- `globals.css`: The global stylesheet for all pages, used by tailwindcss.
- `page.tsx`: The homepage for the web app.

## 📂 Components

## 📂 Lib

# Components

# Backend Integration

| - |
| Still |