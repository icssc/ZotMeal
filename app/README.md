    # ZotMeal


# Technical Details

## Barrel Exports
Sometimes you may see a directory structure like this:

```
.
└── src
    └── components
        └── header
            ├── header
            ├── index.ts
            └── header.tsx
```

There's a `src/components/header` directory with two notable files: `header.tsx` and `index.tsx`.

The `header.tsx` is used to indicate that this is the "functional" entrypoint.
You'd expect it to contain the actual contents of the header.

The `index.tsx` is used to perform the [barrel export](https://basarat.gitbook.io/typescript/main-1/barrel).
In JS-land, an `index.js` file represents the directory itself.
i.e. `src/components/header/index` can be referenced as `src/components/header`.
You can use the `index.js` file to re-export the header in `header.tsx`.

The result is 
```tsx
import { Header } from 'src/components/header'
```
instead of
```tsx
import { Header } from 'src/components/header/header'
```
