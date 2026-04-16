# Components Folder

This folder documents the app's reusable UI building blocks that live in `components/`.

## Structure

### `components/auth`

Authentication-related UI such as the auth container, auth card, and login/signup forms.

Current files:

- `AuthCard.tsx`
- `AuthContainer.css`
- `AutheContainer.tsx`
- `LoginForm.tsx`
- `SignupForm.tsx`

### `components/layout`

Shared page layout elements used across the app shell.

Current files:

- `Footer.tsx`
- `Footer.css`
- `Navbar.tsx`
- `Navbar.css`

### `components/rooms`

Room creation and room browsing UI. This area contains forms, cards, grids, and room-related modals.

Current files:

- `CreateRoomForm.tsx`
- `CreateRoomForm.css`
- `Modal.tsx`
- `Modal.css`
- `RoomCard.tsx`
- `RoomCard.css`
- `RoomModal.tsx`
- `RoomModal.css`
- `RoomsGrid.tsx`
- `RoomsGrid.css`

### `components/ui`

Low-level reusable interface primitives shared by higher-level components.

Current files:

- `Button.tsx`
- `Button.css`
- `Input.tsx`
- `Input.css`
- `Modal.tsx`

## Notes

- Keep feature-specific UI inside its domain folder when possible.
- Move generic, app-wide pieces into `components/ui`.
- Update this document when adding new component groups or significantly changing ownership.
