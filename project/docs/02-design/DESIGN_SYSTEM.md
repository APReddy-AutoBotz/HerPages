# HerPages design system

## 1. Identity

Brand: **HerPages**. Tagline: **An app that grows with her.** Supporting line: **Her story belongs to her.** The logo design itself is not supplied or trademark-cleared by this documentation. Do not invent a lock/seal suggesting an independent security certification.

Core palette preserves the agreed direction: Midnight Plum `#2C2138`, Aurora Violet `#806BF2`, Coral Glow `#FF7F86`, Pearl `#FAF8FC`, Soft Graphite `#45414B`. A violet-to-coral gradient is decorative branding, not the default text background.

**Accessibility correction:** white text on the original Aurora Violet is approximately 3.96:1, insufficient for ordinary small text under the normal-text WCAG AA criterion. Use action violet `#6852C7` with white text, approximately 5.80:1. Keep the original violet for accents/illustrations or use verified contrasting text. Source for criteria: [S11]. Ratios are calculated, not visually guessed.

## 2. Tokens and components

`tokens.json` is the source for semantic color and stage suggestions. Suggested structure: `brand`, `semantic.light`, `semantic.dark`, `stages`, `spacing`, `radii`, `typography`, `contrastPairs`. Components consume semantic tokens, not hardcoded stage colors. Web and mobile have platform-specific components but shared token names, icons, content rules and accessibility intent.

Stable semantics: primary action, secondary action, foreground, muted foreground, surface, raised surface, border, focus, success, warning, danger. An emergency or error does not become green because a user selects a mint theme. Each status includes text and an icon.

## 3. Life-stage palettes

| Chapter | Accent 1 | Accent 2 | Warm accent | Surface | Character |
|---|---|---|---|---|---|
| First Pages | `#C9C4FF` | `#A9E4DC` | `#FFD6B8` | `#FFFCF7` | Warm, layered, parent-friendly |
| Wonder | `#8586FF` | `#89E5CA` | `#FFC96B` | `#F9FAFF` | Curious and energetic |
| Bloom | `#A997FF` | `#72D8C3` | `#FF9A82` | `#FBFAFE` | Creative and self-directed |
| Aura | `#A980F8` | `#A8D8EA` | `#D9869E` | `#FBF9FD` | Expressive and editorial |
| Horizon | `#6657E8` | `#19B6A5` | `#FF766D` | `#FAF8FC` | Ambitious, clear, energetic |
| Rise | `#4E4BC8` | `#27A99A` | `#E77C76` | `#FAF8F4` | Independent and purposeful |
| Momentum | `#267F7D` | `#8B6C9E` | `#C9796F` | `#FAF7F2` | Focused and warm |
| Rooted | `#4B324B` | `#81977D` | `#B26F78` | `#F7F3EC` | Confident and grounded |
| Flourish | `#245D70` | `#9A80B8` | `#D49B76` | `#FBF8F2` | Renewed energy, not a retirement palette |
| Evergreen | `#285F52` | `#B29BC7` | `#C09A63` | `#FAF8F1` | Clear, calm and active |

These are decoration palettes. They are not pre-approved text/button combinations. Standard controls use verified semantic pairs until individual variants are tested. Color suggestions do not imply that women have an age-defined taste.

## 4. Layout and typography

Use a modern system sans-serif initially, with platform fonts and verified Telugu glyph fallback. Font licensing must be documented before bundling third-party typefaces. Base body target 16–18 logical pixels, at least comfortable line height, with responsive scaling. Do not use tiny type to make a dense dashboard fit.

An 8-unit spacing rhythm with 4-unit exceptions keeps layouts coherent. Default cards use 20-unit radius; playful illustration cards may use 28, adult utility cards 16. These are style suggestions, not age-enforced accessibility constraints. Never automatically shrink controls or text as a user grows up.

Suggested mobile tabs: **Today, My Pages, Discover, Help, You**. Community is a separately gated entry, not an empty tab for children. Guardian context visibly states whose collection is open. Do not expose a child's name on the locked screen.

## 5. State design

Every critical component specifies loading, empty, offline, disabled, denied, expired, failed, retrying and success states. Page-save status: `Saving locally`, `Saved on this device`, `Backup pending`, `Backed up`, `Backup failed`. Do not collapse them into a green tick.

Privacy chips use text: **On this device**, **Encrypted backup**, **Shared with selected people**, **Community-visible**, **Sent for AI processing**. Explain that the last two have different privacy from the vault. A shield icon alone is insufficient.

## 6. Age transitions and choice

No automatic midnight palette interpolation. Offer a preview at an appropriate moment, with Keep, Try or Choose another style. Color interpolation can accidentally fail contrast and should not be used for active controls. An animated transition is decorative, interruptible and disabled under reduced motion. User theme selection persists across age changes; policy transitions occur independently.

Women entering at 50+ can choose any theme. A simplified navigation mode is available to everyone. No assumed cognitive decline or compulsory caregiver connection. Meaningful older-adult content includes learning, entrepreneurship, sport, art, volunteering, mentoring and chosen storytelling.

## 7. Accessibility acceptance

Target WCAG 2.2 AA for web plus native accessibility testing. Normal text contrast at least 4.5:1; large text at least 3:1 where the criterion applies; meaningful component boundaries/focus indicators at least 3:1. Product target touch areas: 48 logical pixels on mobile, larger where useful; do not describe that target as a universal WCAG requirement. [S11]

Test VoiceOver and TalkBack, keyboard-only web, 200% text scaling, screen magnification, color-vision simulations and reduced motion. Date pickers and chip filters need accessible names/roles. Errors identify the field and remediation without relying on red. Password/recovery flows permit assistive technology and do not force inaccessible puzzles.

## 8. Content tone

Warm without infantilizing. 'What would you like to try?' rather than 'You are falling behind.' 'Only on this device; create a backup to protect against loss' rather than '100% safe forever.' Avoid beauty, marriage or academic-rank assumptions. No guilt messages to parents or shame streaks for children.

## 9. Review artifacts

Each delivered screen needs light/dark, large text, empty/error/offline variants and age-context examples. Screenshots use synthetic people. Design approval does not approve child-data processing, encryption or safe public launch.
