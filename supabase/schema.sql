-- Schéma Supabase (PostgreSQL) pour Healthy Meal App.
-- Pas utilisé par le MVP (qui tourne en localStorage), prévu pour la
-- persistance multi-appareil une fois le MVP validé.

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  created_at timestamptz not null default now()
);

create table if not exists stores (
  id uuid primary key default gen_random_uuid(),
  name text unique not null -- Lidl, Carrefour, Auchan, Leclerc, Intermarché, Aldi, Monoprix, Picard...
);

create table if not exists ingredients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  rayon text not null, -- proteines, feculents, legumes, fruits, laitiers, surgeles, sauces, snacks, epices
  unit text not null   -- g, ml, piece, cs, cc
);

create table if not exists ingredient_prices (
  id uuid primary key default gen_random_uuid(),
  ingredient_id uuid references ingredients(id) on delete cascade,
  store_id uuid references stores(id) on delete set null,
  estimated_price numeric(6,2) not null, -- estimation modifiable, jamais un prix garanti exact
  updated_at timestamptz not null default now()
);

create table if not exists recipes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  categories text[] not null, -- petit-dejeuner, dejeuner, diner, collation, post-training, rapide, meal-prep
  tags text[] not null default '{}',
  portions int not null default 1,
  prep_time_min int not null,
  difficulty text not null, -- facile, moyen, avance
  calories int not null,
  protein numeric(5,1) not null,
  carbs numeric(5,1) not null,
  fat numeric(5,1) not null,
  cheaper_option text,
  fancier_option text,
  quick_option text,
  created_at timestamptz not null default now()
);

create table if not exists recipe_ingredients (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid references recipes(id) on delete cascade,
  ingredient_id uuid references ingredients(id) on delete restrict,
  quantity numeric(7,2) not null,
  unit text not null
);

create table if not exists recipe_ratings (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid references recipes(id) on delete cascade,
  user_id uuid references users(id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  saved boolean not null default false,
  created_at timestamptz not null default now(),
  unique (recipe_id, user_id)
);

create table if not exists pantry_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  ingredient_id uuid references ingredients(id) on delete set null,
  name text not null, -- libellé libre si pas mappé à un ingrédient connu
  quantity numeric(7,2),
  unit text,
  expires_on date,
  created_at timestamptz not null default now()
);

create table if not exists meal_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  recipe_id uuid references recipes(id) on delete cascade,
  planned_date date not null,
  meal_slot text not null -- petit-dejeuner, dejeuner, diner, collation
);

create table if not exists shopping_lists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists shopping_list_items (
  id uuid primary key default gen_random_uuid(),
  shopping_list_id uuid references shopping_lists(id) on delete cascade,
  ingredient_id uuid references ingredients(id) on delete set null,
  name text not null,
  quantity numeric(7,2) not null,
  unit text not null,
  estimated_price numeric(6,2) not null,
  store_id uuid references stores(id) on delete set null,
  checked boolean not null default false
);

create table if not exists monthly_budgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  month date not null, -- premier jour du mois
  monthly_budget numeric(7,2) not null,
  spent numeric(7,2) not null default 0,
  unique (user_id, month)
);

create table if not exists expense_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  shopping_list_id uuid references shopping_lists(id) on delete set null,
  amount numeric(7,2) not null,
  spent_at timestamptz not null default now()
);
