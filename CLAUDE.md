# W Energie

Internal admin dashboard for W Energie SpA — manage product catalogs, create quotations, and generate PDF quotes with EUR/CLP currency support.

## Tech Stack

- **Frontend**: React 18 + TypeScript, Create React App
- **Styling**: Material-UI v6 + Emotion (CSS-in-JS)
- **Backend/DB**: Firebase (Firestore, Auth, Hosting)
- **Routing**: React Router v6
- **PDF**: @react-pdf/renderer for quote document generation
- **Excel**: SheetJS (xlsx) + read-excel-file for product import

## Project Structure

```
src/
  components/
    Auth/               # Google OAuth login (Auth.tsx, Authed.tsx)
    Layout/             # AppBar, Drawer, Layout shell, Copyright
    Products/           # Product CRUD, import, table
    Quotes/             # Quote CRUD, PDF generation, download
    Common/             # Shared components (Title)
    App.tsx             # Router configuration
  database/             # Firebase integration layer
    index.js            # Firebase init (hardcoded config)
    auth.ts             # Google auth popup flow
    getData.ts          # Generic Firestore pagination helper
    products/           # Product collection CRUD operations
    quotes/             # Quote collection CRUD operations
  hooks/                # Custom React hooks
  utils/                # Helpers (currency formatting, Excel parsing, quote math)
    __tests__/          # Jest unit tests
  assets/               # Logos and images
public/                 # Static assets and index.html
firebase.json           # Firebase Hosting config
firestore.rules         # Firestore security rules
firestore.indexes.json  # Firestore indexes
```

## Firebase

- Config is hardcoded in `src/database/index.js` (no env vars)
- Firestore rules allow read/write only for 4 whitelisted email addresses (see `firestore.rules`)
- Auth uses Google OAuth popup flow via `signInWithPopup`

## Data Model (Firestore)

```
products/{sku}              name, nameEnglish, nameGerman, description*, price (EUR), weight?, type (Product|Part|Custom)
quotes/{quoteId}            concept, client {name, rut, address, phone, mail}, date, products[], euroToClp, discount, deliveryCost, installationCost, deliveryTerm, paymentForm, weight
```

- **Products** use SKU as document ID. German name is required; Spanish/English names and descriptions are optional. Descriptions are required for type `Product` but not for `Part`.
- **Quotes** contain embedded product line items with quantities. Pricing is calculated client-side (subtotal, 19% IVA tax, discount, EUR↔CLP conversion).

## Routes

| Path | Page |
| ---- | ---- |
| `/` | Redirects → `/cotizaciones` |
| `/cotizaciones` | `Quotes` — paginated quote list with search |
| `/cotizaciones/nueva` | `NewQuote` — create a new quote |
| `/cotizaciones/:quoteId` | `Quote` — quote detail view |
| `/cotizaciones/:quoteId/pdf` | `QuoteDocumentViewer` — full-page PDF preview (no layout shell) |
| `/productos` | `Products` — paginated product list with search |
| `/productos/nuevo` | `NewProduct` — create a new product |
| `/productos/:productId` | `Product` — product detail/edit view |

## Key Commands

All commands run from the repo root:

```bash
npm start       # Dev server (http://localhost:3000)
npm run build   # Production build → build/
npm test        # Jest tests in watch mode
npm run analyze # Bundle size analysis (requires a build first)
```

## Dev Server

- Always use port **3000** (`http://localhost:3000`) — never pick a different port.
- If port 3000 is already in use, assume the dev server is already running and use it as-is — do not kill it or start a new one.
- Only start the dev server if nothing is listening on port 3000:
  ```bash
  lsof -ti :3000 || npm start
  ```
- **Do not test UI changes yourself.** After making changes, ask the user to test in the browser and report back. The user always has a dev server available.

## Deployment

- **CI**: GitHub Actions (`.github/workflows/firebase-hosting-merge.yml`) — on push to `master`, builds the app and deploys to Firebase Hosting via service account
- **Hosting**: Firebase Hosting serves `build/` with SPA rewrites (all routes → `index.html`)
- **Firestore rules** are deployed alongside hosting

## Git Workflow

- Push directly to `master` — no PRs
- Commit message style: `[scope] description` (e.g. `[quote] increase font size`, `[fix] type error`)
- **Never push without explicit confirmation from the user** — always commit locally first, then ask before pushing.

## Code Structure & Sizing

Heuristics for keeping files and components readable. Treat the limits as warnings, not laws — exceptions are fine when called out.

### File length

- **Warn at 200 lines.** If you cross 200, ask whether something inside is independently meaningful and could move out.
- **Hard limit ~350 lines.** Past 350, splitting the file is part of the task.

### Function / component length

- **Warn at 50 lines.** Look for a coherent chunk to extract.
- **Hard limit ~80 lines** for a render function. A page-level component that's mostly hook calls and layout JSX is a fine exception.
- Hooks that purely return a derived value should be tight (≤ 30 lines).

### When to extract a component

- The same JSX pattern appears **2+ times** across the codebase — extract to `components/Common/` (or the relevant domain folder).
- A render function has more than **two visually distinct sub-views** — extract each to a sibling file, even if only used once.
- A component mixes presentational JSX with significant data shaping (>10 lines of derivation) — split into a custom hook + a presentational component.
- Single-use sub-components defined inside the same file are fine **if** they're small (<30 lines) and share state with the parent. Otherwise move them to a sibling file.

### When to extract a hook (`hooks/useX.ts`)

- Same Firestore query shape used in multiple places.
- Same client-side derivation used in 2+ components.
- State + effect pair that mirrors something external (URL params, auth user, etc.).
- Hooks compose freely — a hook that internally calls 2-3 other hooks is fine.

### When to extract a utility (`utils/X.ts`)

- Pure function (no React, no side effects) used in 2+ files.
- Calculation logic that clutters a component — extract even if used once.
- **Always** put currency formatting, price calculations, and data transformations in `utils/`.

## Reusable Building Blocks

**Before building UI or a data hook, scan this catalog and reuse (or extend) an existing piece instead of rebuilding it. When you add a new reusable component, hook, or utility, register it here in the same change so the list stays current.**

### Components (`components/`)

**Layout & navigation**
- `Layout` — main app shell: theme, drawer, auth guard, `<Outlet>` for child routes.
- `AppBar` — sticky top bar with hamburger toggle and navigation.
- `Drawer` — side navigation with menu items (Cotizaciones, Productos).
- `Authed` — auth guard: renders children if signed in, `<Auth>` otherwise.
- `Auth` — Google sign-in page (Toolpad `SignInPage`).
- `Copyright` — footer copyright text.

**Common**
- `Title` / `SubTitle` — page-level headings. Use instead of hand-rolling `<Typography variant="h4">`.
- `ErrorBoundary` — React error boundary with retry button. Wraps `<Outlet>` in Layout.

**Products**
- `ProductTable` — generic table for displaying products with pagination, quantity input, and actions. Accepts type parameter `P extends Product`. Used in both `Products` (listing) and `NewQuote` (product selection).
- `ProductForm` — form for creating/editing products. Accepts `ProductFormVariant` (New/Edit).
- `ProductImportButton` / `ImportMenu` — Excel file import with product type selection and error handling.

**Quotes**
- `QuoteDocument` — react-pdf `<Document>` template for generating quote PDFs (header, client info, product table, pricing, footer).
- `QuoteDocumentViewer` — full-page PDF preview (standalone route, no layout shell).
- `QuoteDownloadButton` — download button (memoized); lazy-loads `QuoteDownloader` on click so `@react-pdf/renderer` stays out of the initial bundle.
- `QuoteDownloader` — internal component (lazy-loaded chunk) that calls `useQuotePdf` and triggers the download.
- `QuoteRow` / `RowSkeleton` — table row and loading skeleton for the quotes list.
- `NewQuoteFields` — form field sub-components for NewQuote (`FormHeader`, `General`, `Client`, `ProductsSection`, `Delivery`, `Others`).

### Hooks (`hooks/`)

| Hook | What it does |
| ---- | ------------ |
| `useAuth()` | Firebase auth state (user, loading) |
| `useSession()` | Toolpad session management wrapping Firebase auth |
| `useQuote(quoteId)` | Fetches a single quote from Firestore |
| `useQuoteFromParams()` | `useQuote` with ID from URL params |
| `useProduct(productId)` | Fetches a single product from Firestore |
| `useProductFromParams()` | `useProduct` with ID from URL params |
| `usePagination(getData, getCount)` | Cursor-based Firestore pagination (forward/back, page size) |
| `useClientPagination(items)` | Client-side pagination for in-memory arrays — returns `[pageItems, paginationProps]` |
| `useInput(initial)` | Controlled input state helper — returns `[value, handleChange, setValue]` |
| `useQuotePdf(quote)` | Generates PDF blob for a quote — returns `[handleDownload, loading]` |
| `useInitialValues()` | Parses URL query params into initial quote form values (used for quote templating) |
| `useDeliveryCost(products, initialValues, ref)` | Manages interdependent weight/cost-per-kg/delivery-cost calculations |

### Utilities (`utils/`)

| Module | Exports | Used in |
| ------ | ------- | ------- |
| `formatCurrency.ts` | `formatClp`, `formatEuro` | Quote, QuoteDocument, ProductTable, Quotes |
| `quoteUtils.ts` | `getQuoteRows`, `getSubtotalPrice`, `getTotalDiscount`, `getTotalTax`, `getTotalPrice`, `getMainProductName`, `getFilteredQuotes` | Quote, QuoteDocument, Quotes |
| `productUtils.ts` | `getProductName`, `getProductDescription`, `getFilteredProducts` | ProductTable, ProductForm, Quote, QuoteDocument |
| `parseExcel.ts` | `parseExcel` (lazy-loads xlsx via dynamic import) | ProductImportButton |
| `parseProducts.ts` | `parseProducts` (via `ProductParser`) | ProductImportButton |
| `handleError.ts` | `handleError(error, userMessage)` — console.error + alert | NewQuote, ProductForm, Quote |

### Database (`database/`)

| Module | Exports |
| ------ | ------- |
| `index.js` | `app`, `db` (Firebase + Firestore instances) |
| `auth.ts` | `auth`, `signInWithGoogle`, `firebaseSignOut`, `AUTHENTICATION` |
| `getData.ts` | `getData` — generic paginated Firestore fetch |
| `products/productCollection.ts` | `ProductType` enum, `ProductData`, `Product`, `productCollection` |
| `products/*.ts` | `getProduct`, `getProducts`, `getProductsCount`, `addProduct`, `addProducts`, `updateProduct`, `deleteProduct` |
| `quotes/quoteCollection.ts` | `QuoteProduct`, `QuoteData`, `Quote`, `quoteCollection` |
| `quotes/*.ts` | `getQuote`, `getQuotes`, `getQuotesCount`, `addQuote`, `deleteQuote` |

## Conventions

- **All source code lives in `src/`**
- **Imports use absolute paths** from `src/` as base (configured via `tsconfig.json` `baseUrl`). Exception: do NOT name files `constants.ts` — conflicts with the Node.js built-in. Use `appConstants.ts` instead.
- `appConstants.ts` — app-wide constants (`EUR_TO_CLP_DEFAULT = 1010`)
- Firebase calls belong in `src/database/` — keep components free of direct Firestore calls
- Custom hooks live in `src/hooks/` — data fetching, auth state, pagination logic
- Utility functions live in `src/utils/` — quote calculations, currency formatting, Excel parsing
- **TypeScript strict mode** is enabled — respect it
- **Currency formatting**: use `formatCurrency.ts` helpers, never format inline. Supports CLP (Chilean Peso) and EUR
- **Excel import**: product data comes from supplier spreadsheets with multilingual columns (Spanish, English, German). Parsing logic lives in `parseExcel.ts` and `parseProducts.ts`

## Testing

- **Framework**: Jest + React Testing Library (via CRA)
- **Test location**: `src/utils/__tests__/`
- **Current coverage**: quote calculation utilities (`quoteUtils.test.ts`) — subtotal, discount, tax, total price
- Unit tests for pure utility functions are the primary testing pattern
