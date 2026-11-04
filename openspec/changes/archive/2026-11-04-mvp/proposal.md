# Proposal

## Why
FreshCart lets a busy household rebuild its weekly grocery shop in under two minutes by reordering a past basket or a saved list, then booking a pickup or delivery slot.

Weekly shops are mostly repeat purchases; the slow parts are rebuilding the basket and finding a slot.

## What Changes
### catalog
- US-CAT-01 (M · critical) As a shopper, I want to browse and search products so that I can find what I need.
- US-CAT-02 (S · supporting) As a shopper, I want to see specials with the old and new price so that I can save money.

### cart
- US-CART-01 (M · critical) As a shopper, I want to add, change and remove items so that my basket is right.
- US-CART-02 (M · critical) As a shopper, I want an accurate total with savings so that I know what I pay.

### checkout
- US-CHK-01 (M · critical) As a shopper, I want to pick a pickup or delivery slot so that I get my shop when I need it.
- US-CHK-02 (M · critical) As a shopper, I want to place an order and see it later so that I can track what I bought.

### lists
- US-LST-01 (M · critical) As a shopper, I want saved lists I can add to my cart in one tap so that weekly shops are fast.
- US-LST-02 (M · critical) As a shopper, I want to reorder a past order so that I do not rebuild it.

## Non-goals
- Real payments, accounts, loyalty points, recipes, recommendations, substitutions chat, store locator (Wedge: v2).
- Any use of the Woolworths name, logo or branding. FreshCart is an original fictional brand.

## Capabilities
### New Capabilities
- `catalog`: browse, search, specials, product detail
- `cart`: basket editing, persistence, pricing quote
- `checkout`: slots, fees, order placement, order history
- `lists`: saved lists and reorder
- `quality`: performance, accessibility and security limits

## Impact
New mobile app (`app/`) and API (`api/`). No existing systems.
