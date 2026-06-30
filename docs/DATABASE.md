# Database Schema Reference

Firestore collections for Ô Diên One. See [ARCHITECTURE.md](../ARCHITECTURE.md) for full context.

## Indexes Required

```
passport_scans: userId ASC, scannedAt DESC
citizen_cards: createdAt DESC
quiz_results: score DESC, createdAt DESC
capsules: visibility ASC, status ASC, createdAt DESC
```

## Security Rules (Summary)

- `citizen_cards`: read public, create authenticated or anonymous
- `passport_scans`: read/write own userId only
- `capsules`: create public, read public only if approved + public visibility
- `admin collections`: admin role only

## Citizen ID Format

`OD-{YEAR}-{SEQUENCE}` → e.g. `OD-2026-00001`

Sequence stored in `analytics/counters.citizenCardSequence`.
