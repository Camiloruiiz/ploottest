create extension if not exists "pgcrypto";

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null,
  price_cents integer not null check (price_cents >= 0),
  stock integer not null check (stock >= 0),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  user_email text not null,
  status text not null,
  total_cents integer not null check (total_cents >= 0),
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id),
  product_name text not null,
  quantity integer not null check (quantity > 0),
  unit_price_cents integer not null check (unit_price_cents >= 0),
  subtotal_cents integer not null check (subtotal_cents >= 0)
);

alter table public.orders add column if not exists user_email text;
alter table public.order_items add column if not exists product_name text;

create index if not exists idx_orders_user_id_created_at on public.orders(user_id, created_at desc);
create index if not exists idx_order_items_order_id on public.order_items(order_id);

alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

drop policy if exists "products are readable by anyone" on public.products;
create policy "products are readable by anyone"
on public.products
for select
to anon, authenticated
using (true);

drop policy if exists "users can read own orders" on public.orders;
create policy "users can read own orders"
on public.orders
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "users can read own order items" on public.order_items;
create policy "users can read own order items"
on public.order_items
for select
to authenticated
using (
  exists (
    select 1
    from public.orders o
    where o.id = order_id
      and o.user_id = auth.uid()
  )
);

create or replace function public.checkout_order(
  p_user_id uuid,
  p_user_email text,
  p_items jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_auth_user_id uuid := auth.uid();
  v_order_id uuid;
  v_created_at timestamptz := timezone('utc', now());
  v_order jsonb;
begin
  if v_auth_user_id is null or p_user_id is null or p_user_email is null or btrim(p_user_email) = '' then
    return jsonb_build_object(
      'ok', false,
      'error_code', 'auth_required',
      'error_message', 'Authentication is required.',
      'error_detail', null
    );
  end if;

  if v_auth_user_id <> p_user_id then
    return jsonb_build_object(
      'ok', false,
      'error_code', 'forbidden',
      'error_message', 'You cannot create orders for another user.',
      'error_detail', null
    );
  end if;

  if p_items is null or jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
    return jsonb_build_object(
      'ok', false,
      'error_code', 'invalid_payload',
      'error_message', 'An order must include at least one item.',
      'error_detail', null
    );
  end if;

  with requested_items as (
    select
      (item->>'product_id')::uuid as product_id,
      ((item->>'quantity')::integer) as quantity
    from jsonb_array_elements(p_items) as item
  ),
  invalid_items as (
    select *
    from requested_items
    where product_id is null or quantity is null or quantity <= 0
  )
  select
    case when exists(select 1 from invalid_items) then
      jsonb_build_object(
        'ok', false,
        'error_code', 'invalid_payload',
        'error_message', 'Order items must include a valid product_id and quantity.',
        'error_detail', null
      )
    else null end
  into v_order;

  if v_order is not null then
    return v_order;
  end if;

  with requested_items as (
    select
      (item->>'product_id')::uuid as product_id,
      ((item->>'quantity')::integer) as quantity
    from jsonb_array_elements(p_items) as item
  ),
  normalized_items as (
    select product_id, sum(quantity)::integer as quantity
    from requested_items
    group by product_id
  ),
  missing_products as (
    select n.product_id
    from normalized_items n
    left join public.products p on p.id = n.product_id
    where p.id is null
  )
  select
    case when exists(select 1 from missing_products) then
      jsonb_build_object(
        'ok', false,
        'error_code', 'product_not_found',
        'error_message', 'One or more products were not found.',
        'error_detail', jsonb_build_object(
          'product_id', (select product_id from missing_products limit 1)
        )
      )
    else null end
  into v_order;

  if v_order is not null then
    return v_order;
  end if;

  with requested_items as (
    select
      (item->>'product_id')::uuid as product_id,
      ((item->>'quantity')::integer) as quantity
    from jsonb_array_elements(p_items) as item
  ),
  normalized_items as (
    select product_id, sum(quantity)::integer as quantity
    from requested_items
    group by product_id
  ),
  locked_products as (
    select p.id, p.name, p.price_cents, p.stock, n.quantity
    from public.products p
    join normalized_items n on n.product_id = p.id
    for update
  ),
  insufficient_stock as (
    select *
    from locked_products
    where stock < quantity
  )
  select
    case when exists(select 1 from insufficient_stock) then
      jsonb_build_object(
        'ok', false,
        'error_code', 'stock_insufficient',
        'error_message', 'Insufficient stock for ' || (select name from insufficient_stock limit 1) || '.',
        'error_detail', jsonb_build_object(
          'product_id', (select id from insufficient_stock limit 1),
          'requested_quantity', (select quantity from insufficient_stock limit 1),
          'available_stock', (select stock from insufficient_stock limit 1)
        )
      )
    else null end
  into v_order;

  if v_order is not null then
    return v_order;
  end if;

  insert into public.orders (id, user_id, user_email, status, total_cents, created_at)
  select
    gen_random_uuid(),
    p_user_id,
    p_user_email,
    'confirmed',
    coalesce(sum(p.price_cents * n.quantity), 0),
    v_created_at
  from (
    select
      (item->>'product_id')::uuid as product_id,
      sum((item->>'quantity')::integer)::integer as quantity
    from jsonb_array_elements(p_items) as item
    group by (item->>'product_id')::uuid
  ) n
  join public.products p on p.id = n.product_id
  returning id into v_order_id;

  insert into public.order_items (
    order_id,
    product_id,
    product_name,
    quantity,
    unit_price_cents,
    subtotal_cents
  )
  select
    v_order_id,
    p.id,
    p.name,
    n.quantity,
    p.price_cents,
    p.price_cents * n.quantity
  from (
    select
      (item->>'product_id')::uuid as product_id,
      sum((item->>'quantity')::integer)::integer as quantity
    from jsonb_array_elements(p_items) as item
    group by (item->>'product_id')::uuid
  ) n
  join public.products p on p.id = n.product_id;

  update public.products p
  set
    stock = p.stock - n.quantity,
    updated_at = v_created_at
  from (
    select
      (item->>'product_id')::uuid as product_id,
      sum((item->>'quantity')::integer)::integer as quantity
    from jsonb_array_elements(p_items) as item
    group by (item->>'product_id')::uuid
  ) n
  where p.id = n.product_id;

  select jsonb_build_object(
    'ok', true,
    'order', jsonb_build_object(
      'id', o.id,
      'user_id', o.user_id,
      'user_email', o.user_email,
      'status', o.status,
      'total_cents', o.total_cents,
      'created_at', o.created_at,
      'items', coalesce((
        select jsonb_agg(jsonb_build_object(
          'id', oi.id,
          'order_id', oi.order_id,
          'product_id', oi.product_id,
          'quantity', oi.quantity,
          'unit_price_cents', oi.unit_price_cents,
          'subtotal_cents', oi.subtotal_cents,
          'product_name', oi.product_name
        ) order by oi.id)
        from public.order_items oi
        where oi.order_id = o.id
      ), '[]'::jsonb)
    )
  )
  into v_order
  from public.orders o
  where o.id = v_order_id;

  return v_order;
end;
$$;

grant execute on function public.checkout_order(uuid, text, jsonb) to authenticated;
