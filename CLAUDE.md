# Projet : Application repas healthy, protéinés et budget courses

Application web mobile-first (Next.js) qui aide à organiser des repas healthy et protéinés, faire les courses, gérer le budget alimentaire et éviter le gaspillage, pour des produits courants des supermarchés français (Lidl, Carrefour, Auchan, Leclerc, Intermarché, Aldi, Monoprix, Picard).

## Profil utilisateur

Pratique musculation/fitness, objectif perte de gras + maintien/prise de muscle. Repas simples, réalistes, pas trop chers, ingrédients faciles à trouver en France.

## Stack retenue (voir section 19 du cahier des charges initial)

- Next.js (App Router, TypeScript, Tailwind) — web mobile-first avant app mobile native.
- Pas d'IA au début : base de recettes locale (src/lib/recipes.ts) + prix estimés modifiables.
- Supabase prévu pour la persistance multi-appareil (schéma SQL dans supabase/schema.sql) ; le MVP utilise le localStorage côté client pour rester simple et gratuit.
- Open Food Facts : intégration future pour enrichir les infos nutritionnelles.

## Périmètre du MVP (ne pas dépasser sans demande explicite)

1. Page recettes (filtres, détail, prix/macros/temps).
2. Page budget (budget mensuel, dépensé, restant par jour/semaine, alertes).
3. Page liste de courses (générée depuis les recettes sélectionnées, groupée par rayon, cases à cocher, recalcul du budget).
4. Page frigo / garde-manger (ce qu'on a déjà, suggestions de recettes pour éviter le gaspillage).
5. Page batch cooking simple (profils étudiant / sportif / perte de poids / gourmand / prise de muscle, durées 3/5/7/14 jours).
6. Base de 30 recettes healthy et protéinées avec prix estimés modifiables.

## Règles techniques

- Pas de chargement de toutes les recettes en mémoire inutilement ; pagination/filtrage si la base grossit.
- Calculs (budget, agrégation liste de courses, macros) faits localement, pas d'appel réseau/IA pour ça.
- Pas de prix exacts inventés comme des faits : tout prix est une estimation modifiable par l'utilisateur (champ "estimé").
- Garder le projet simple à maintenir par une seule personne ; éviter la sur-ingénierie ; prévoir l'extensibilité (scan tickets, code-barres, IA, Supabase) sans la construire avant qu'elle soit demandée.

## Fonctionnalités futures (hors MVP, à garder en tête dans l'archi)

Notes/avis sur recettes, apprentissage des préférences, assistant IA nutrition, optimisation budget/anti-gaspillage avancée, gestion des dates de péremption, scan tickets de caisse / codes-barres, comparaison de prix entre magasins, sync Apple Health/Google Fit, etc.

<!-- Règles spécifiques Next.js (générées par create-next-app) -->
@AGENTS.md
