# healthy-meal-app

Application repas healthy, protéinés et gestion de budget courses — pensée pour les produits courants des supermarchés français (Lidl, Carrefour, Auchan, Leclerc, Intermarché, Aldi, Picard...).

Voir [CLAUDE.md](./CLAUDE.md) pour le périmètre du projet et le MVP.

## Démarrer

```bash
npm install
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## Pages du MVP

- `/recettes` — 30 recettes healthy/protéinées, filtrables, avec prix estimés modifiables.
- `/budget` — budget mensuel, dépensé, restant par jour/semaine, alertes.
- `/courses` — liste de courses générée depuis les recettes sélectionnées, groupée par rayon.
- `/frigo` — garde-manger, suggestions de recettes anti-gaspillage.
- `/batch-cooking` — génération de menus sur 3/5/7/14 jours selon un profil (étudiant, sportif, perte de poids, gourmand, prise de muscle).

Toutes les données (budget, frigo, liste de courses, sélections) sont stockées en local (`localStorage`) pour le MVP — pas de backend requis. Un schéma Supabase est prévu dans `supabase/schema.sql` pour une future persistance multi-appareil.
