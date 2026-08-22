# Article masthead continuity

Status: selected review implementation; publication not approved

## Visitor problem

Long-form readers should retain quiet access to authored identity, the homepage,
and reader settings without permanently giving the full opening masthead scarce
reading space.

## Parent problem class

**Scroll-linked adaptive chrome continuity.** A masthead may change density as
reading begins, but the transition must preserve the reader's spatial position.
Neither the document nor the masthead may jump, flash, overshoot, or swap into
an apparently different component.

## Fixed

- Preserve the approved opening geometry and shared `Xiaoyu Ouyang` identity.
- Keep the masthead fully opaque; article content must never show through it.
- Keep the complete identity link and 44px reader-settings target available.
- Preserve keyboard focus, reduced-motion behavior, and article anchor access.

## Selected interaction

- At the document top, render the existing full masthead above an equal-height
  flow spacer.
- Once the document moves below the top, hold a 52px masthead at the viewport top.
- Return to the full masthead only at the document top.
- Use no direction inference, idle timer, remembered visibility, blank-space
  activation, hidden state, translucency, blur, or glass treatment.
- Keep the masthead in one fixed coordinate system and preserve the full
  opening-height spacer so collapse never pulls the article upward.
- Resolve restored scroll position before enabling transitions so reload and
  browser-history restoration never animate from an uninitialized geometry.

## Non-goals

- A general site-navigation system or canonical house pattern.
- Focus mode, reading progress, article taxonomy, or new destinations.
- Changes to the homepage masthead.

## Acceptance evidence

- At 390px and 1280px, opening name, settings, and first-content geometry match
  the approved static state.
- Scrolling produces one stable 52px opaque masthead with aligned identity and
  settings; continued downward or upward scrolling does not change its state.
- Every transition frame stays between 52px and the opening masthead height;
  article movement equals the browser's scroll movement without layout shift,
  and the identity/settings move monotonically toward their compact positions.
- Returning to `scrollY = 0` restores the full masthead.
- The home link and settings remain keyboard- and pointer-operable.
- Reduced motion removes the height transition.
- Build, focused static contract, and lived browser gestures pass.
