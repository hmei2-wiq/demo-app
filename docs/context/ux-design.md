# UX design

Status: DRAFT. No Figma design was produced (the UX phase needs a write-capable Figma session and a screenshot pass; skipped). This is a text spec.

Design target: calm, fresh, high-contrast. Original palette: leaf green `#1E7A4C`, deep ink `#14211B`, warm cream `#FAF7F0`, special red `#C8372D`. System font. Minimum touch target 44pt.

## Navigation
Bottom tabs: **Shop**, **Lists**, **Cart**, **Orders**.

## Screens
1. **Shop**: search field, category chips, "Specials" row, product grid. Tap product opens Detail.
2. **Product detail**: name, size, price (was/now when special), quantity stepper, Add to cart, Add to list.
3. **Lists**: your lists; open one to see items, "Add all to cart".
4. **Cart**: lines with steppers, savings, fulfilment toggle (Pickup/Delivery), slot picker, total, Place order.
5. **Order confirmation**: order id, slot, total, "Reorder" shortcut.
6. **Orders**: history; each has "Reorder" (adds all lines to cart).

## States
Loading skeleton text, empty cart message with link to Shop, error banner with Retry, offline message.

## Accessibility
Every button has an accessibilityLabel; prices read as "3 dollars 50"; stepper buttons labelled "Increase quantity of {name}".
