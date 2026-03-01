# Flower Decor Events

## Current State
- Home page with hero banner and 10 event category cards
- Category gallery pages with lightbox viewer
- Admin panel for uploading/managing images per category
- Navbar with login/logout and admin panel link

## Requested Changes (Diff)

### Add
- **Favourites feature**: Heart/favourite button on each image in category gallery and on category cards on home page. Favourites stored in localStorage. A "Favourites" page (`/favourites`) showing all saved images across categories.
- **Cart feature**: "Add to Cart" button on each image in category gallery. Cart stores selected images (with category name and caption). A slide-out Cart drawer accessible from navbar showing all cart items. Cart count badge on navbar cart icon. Ability to remove items from cart. Cart persisted in localStorage.
- **Navbar updates**: Add Favourites link (with count badge) and Cart icon (with count badge) to navbar.

### Modify
- `CategoryPage.tsx`: Add heart (favourite) and cart buttons on each image card. Buttons appear on hover overlay.
- `HomePage.tsx`: Add heart (favourite) button on each category card (favourites the category, not individual images).
- `Navbar.tsx`: Add Favourites nav link with badge count, add Cart icon button with badge count that opens cart drawer.

### Remove
- Nothing removed

## Implementation Plan
1. Create `src/hooks/useLocalStorage.ts` -- generic hook for localStorage state
2. Create `src/hooks/useFavourites.ts` -- manages favourited image IDs using localStorage
3. Create `src/hooks/useCart.ts` -- manages cart items (imageId, blobId, caption, categoryName) using localStorage
4. Create `src/pages/FavouritesPage.tsx` -- grid of favourited images with remove option, links back to category
5. Create `src/components/CartDrawer.tsx` -- slide-out drawer listing cart items with remove buttons
6. Update `CategoryPage.tsx` -- add Heart and ShoppingCart icon buttons on image hover overlay
7. Update `HomePage.tsx` -- add Heart button on category cards
8. Update `Navbar.tsx` -- add Favourites link with count badge, Cart icon with count badge + CartDrawer
9. Update `App.tsx` -- add `/favourites` route
