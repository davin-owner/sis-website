drop trigger if exists "appointments_updated_at" on "public"."appointments";

drop trigger if exists "update_daily_tasks_updated_at" on "public"."daily_tasks";

drop trigger if exists "update_reminders_updated_at" on "public"."reminders";

drop policy "Users can delete accomplishments for their shops" on "public"."accomplishments";

drop policy "Users can insert accomplishments for their shops" on "public"."accomplishments";

drop policy "Users can view accomplishments for their shops" on "public"."accomplishments";

drop policy "users_delete_appointments" on "public"."appointments";

drop policy "users_insert_appointments" on "public"."appointments";

drop policy "users_read_appointments" on "public"."appointments";

drop policy "users_update_appointments" on "public"."appointments";

drop policy "Users can delete tasks for their shops" on "public"."daily_tasks";

drop policy "Users can insert tasks for their shops" on "public"."daily_tasks";

drop policy "Users can update tasks for their shops" on "public"."daily_tasks";

drop policy "Users can view tasks for their shops" on "public"."daily_tasks";

drop policy "Users can delete reminders for their shops" on "public"."reminders";

drop policy "Users can insert reminders for their shops" on "public"."reminders";

drop policy "Users can update reminders for their shops" on "public"."reminders";

drop policy "Users can view reminders for their shops" on "public"."reminders";

revoke delete on table "public"."accomplishments" from "anon";

revoke insert on table "public"."accomplishments" from "anon";

revoke references on table "public"."accomplishments" from "anon";

revoke select on table "public"."accomplishments" from "anon";

revoke trigger on table "public"."accomplishments" from "anon";

revoke truncate on table "public"."accomplishments" from "anon";

revoke update on table "public"."accomplishments" from "anon";

revoke delete on table "public"."accomplishments" from "authenticated";

revoke insert on table "public"."accomplishments" from "authenticated";

revoke references on table "public"."accomplishments" from "authenticated";

revoke select on table "public"."accomplishments" from "authenticated";

revoke trigger on table "public"."accomplishments" from "authenticated";

revoke truncate on table "public"."accomplishments" from "authenticated";

revoke update on table "public"."accomplishments" from "authenticated";

revoke delete on table "public"."accomplishments" from "service_role";

revoke insert on table "public"."accomplishments" from "service_role";

revoke references on table "public"."accomplishments" from "service_role";

revoke select on table "public"."accomplishments" from "service_role";

revoke trigger on table "public"."accomplishments" from "service_role";

revoke truncate on table "public"."accomplishments" from "service_role";

revoke update on table "public"."accomplishments" from "service_role";

revoke delete on table "public"."appointments" from "anon";

revoke insert on table "public"."appointments" from "anon";

revoke references on table "public"."appointments" from "anon";

revoke select on table "public"."appointments" from "anon";

revoke trigger on table "public"."appointments" from "anon";

revoke truncate on table "public"."appointments" from "anon";

revoke update on table "public"."appointments" from "anon";

revoke delete on table "public"."appointments" from "authenticated";

revoke insert on table "public"."appointments" from "authenticated";

revoke references on table "public"."appointments" from "authenticated";

revoke select on table "public"."appointments" from "authenticated";

revoke trigger on table "public"."appointments" from "authenticated";

revoke truncate on table "public"."appointments" from "authenticated";

revoke update on table "public"."appointments" from "authenticated";

revoke delete on table "public"."appointments" from "service_role";

revoke insert on table "public"."appointments" from "service_role";

revoke references on table "public"."appointments" from "service_role";

revoke select on table "public"."appointments" from "service_role";

revoke trigger on table "public"."appointments" from "service_role";

revoke truncate on table "public"."appointments" from "service_role";

revoke update on table "public"."appointments" from "service_role";

revoke delete on table "public"."daily_tasks" from "anon";

revoke insert on table "public"."daily_tasks" from "anon";

revoke references on table "public"."daily_tasks" from "anon";

revoke select on table "public"."daily_tasks" from "anon";

revoke trigger on table "public"."daily_tasks" from "anon";

revoke truncate on table "public"."daily_tasks" from "anon";

revoke update on table "public"."daily_tasks" from "anon";

revoke delete on table "public"."daily_tasks" from "authenticated";

revoke insert on table "public"."daily_tasks" from "authenticated";

revoke references on table "public"."daily_tasks" from "authenticated";

revoke select on table "public"."daily_tasks" from "authenticated";

revoke trigger on table "public"."daily_tasks" from "authenticated";

revoke truncate on table "public"."daily_tasks" from "authenticated";

revoke update on table "public"."daily_tasks" from "authenticated";

revoke delete on table "public"."daily_tasks" from "service_role";

revoke insert on table "public"."daily_tasks" from "service_role";

revoke references on table "public"."daily_tasks" from "service_role";

revoke select on table "public"."daily_tasks" from "service_role";

revoke trigger on table "public"."daily_tasks" from "service_role";

revoke truncate on table "public"."daily_tasks" from "service_role";

revoke update on table "public"."daily_tasks" from "service_role";

revoke delete on table "public"."leads" from "anon";

revoke insert on table "public"."leads" from "anon";

revoke references on table "public"."leads" from "anon";

revoke select on table "public"."leads" from "anon";

revoke trigger on table "public"."leads" from "anon";

revoke truncate on table "public"."leads" from "anon";

revoke update on table "public"."leads" from "anon";

revoke delete on table "public"."leads" from "authenticated";

revoke insert on table "public"."leads" from "authenticated";

revoke references on table "public"."leads" from "authenticated";

revoke select on table "public"."leads" from "authenticated";

revoke trigger on table "public"."leads" from "authenticated";

revoke truncate on table "public"."leads" from "authenticated";

revoke update on table "public"."leads" from "authenticated";

revoke delete on table "public"."leads" from "service_role";

revoke insert on table "public"."leads" from "service_role";

revoke references on table "public"."leads" from "service_role";

revoke select on table "public"."leads" from "service_role";

revoke trigger on table "public"."leads" from "service_role";

revoke truncate on table "public"."leads" from "service_role";

revoke update on table "public"."leads" from "service_role";

revoke delete on table "public"."reminders" from "anon";

revoke insert on table "public"."reminders" from "anon";

revoke references on table "public"."reminders" from "anon";

revoke select on table "public"."reminders" from "anon";

revoke trigger on table "public"."reminders" from "anon";

revoke truncate on table "public"."reminders" from "anon";

revoke update on table "public"."reminders" from "anon";

revoke delete on table "public"."reminders" from "authenticated";

revoke insert on table "public"."reminders" from "authenticated";

revoke references on table "public"."reminders" from "authenticated";

revoke select on table "public"."reminders" from "authenticated";

revoke trigger on table "public"."reminders" from "authenticated";

revoke truncate on table "public"."reminders" from "authenticated";

revoke update on table "public"."reminders" from "authenticated";

revoke delete on table "public"."reminders" from "service_role";

revoke insert on table "public"."reminders" from "service_role";

revoke references on table "public"."reminders" from "service_role";

revoke select on table "public"."reminders" from "service_role";

revoke trigger on table "public"."reminders" from "service_role";

revoke truncate on table "public"."reminders" from "service_role";

revoke update on table "public"."reminders" from "service_role";

revoke delete on table "public"."shop_leads" from "anon";

revoke insert on table "public"."shop_leads" from "anon";

revoke references on table "public"."shop_leads" from "anon";

revoke select on table "public"."shop_leads" from "anon";

revoke trigger on table "public"."shop_leads" from "anon";

revoke truncate on table "public"."shop_leads" from "anon";

revoke update on table "public"."shop_leads" from "anon";

revoke delete on table "public"."shop_leads" from "authenticated";

revoke insert on table "public"."shop_leads" from "authenticated";

revoke references on table "public"."shop_leads" from "authenticated";

revoke select on table "public"."shop_leads" from "authenticated";

revoke trigger on table "public"."shop_leads" from "authenticated";

revoke truncate on table "public"."shop_leads" from "authenticated";

revoke update on table "public"."shop_leads" from "authenticated";

revoke delete on table "public"."shop_leads" from "service_role";

revoke insert on table "public"."shop_leads" from "service_role";

revoke references on table "public"."shop_leads" from "service_role";

revoke select on table "public"."shop_leads" from "service_role";

revoke trigger on table "public"."shop_leads" from "service_role";

revoke truncate on table "public"."shop_leads" from "service_role";

revoke update on table "public"."shop_leads" from "service_role";

revoke delete on table "public"."shop_tasks" from "anon";

revoke insert on table "public"."shop_tasks" from "anon";

revoke references on table "public"."shop_tasks" from "anon";

revoke select on table "public"."shop_tasks" from "anon";

revoke trigger on table "public"."shop_tasks" from "anon";

revoke truncate on table "public"."shop_tasks" from "anon";

revoke update on table "public"."shop_tasks" from "anon";

revoke delete on table "public"."shop_tasks" from "authenticated";

revoke insert on table "public"."shop_tasks" from "authenticated";

revoke references on table "public"."shop_tasks" from "authenticated";

revoke select on table "public"."shop_tasks" from "authenticated";

revoke trigger on table "public"."shop_tasks" from "authenticated";

revoke truncate on table "public"."shop_tasks" from "authenticated";

revoke update on table "public"."shop_tasks" from "authenticated";

revoke delete on table "public"."shop_tasks" from "service_role";

revoke insert on table "public"."shop_tasks" from "service_role";

revoke references on table "public"."shop_tasks" from "service_role";

revoke select on table "public"."shop_tasks" from "service_role";

revoke trigger on table "public"."shop_tasks" from "service_role";

revoke truncate on table "public"."shop_tasks" from "service_role";

revoke update on table "public"."shop_tasks" from "service_role";

revoke delete on table "public"."shop_usage" from "anon";

revoke insert on table "public"."shop_usage" from "anon";

revoke references on table "public"."shop_usage" from "anon";

revoke select on table "public"."shop_usage" from "anon";

revoke trigger on table "public"."shop_usage" from "anon";

revoke truncate on table "public"."shop_usage" from "anon";

revoke update on table "public"."shop_usage" from "anon";

revoke delete on table "public"."shop_usage" from "authenticated";

revoke insert on table "public"."shop_usage" from "authenticated";

revoke references on table "public"."shop_usage" from "authenticated";

revoke select on table "public"."shop_usage" from "authenticated";

revoke trigger on table "public"."shop_usage" from "authenticated";

revoke truncate on table "public"."shop_usage" from "authenticated";

revoke update on table "public"."shop_usage" from "authenticated";

revoke delete on table "public"."shop_usage" from "service_role";

revoke insert on table "public"."shop_usage" from "service_role";

revoke references on table "public"."shop_usage" from "service_role";

revoke select on table "public"."shop_usage" from "service_role";

revoke trigger on table "public"."shop_usage" from "service_role";

revoke truncate on table "public"."shop_usage" from "service_role";

revoke update on table "public"."shop_usage" from "service_role";

revoke delete on table "public"."shop_users" from "anon";

revoke insert on table "public"."shop_users" from "anon";

revoke references on table "public"."shop_users" from "anon";

revoke select on table "public"."shop_users" from "anon";

revoke trigger on table "public"."shop_users" from "anon";

revoke truncate on table "public"."shop_users" from "anon";

revoke update on table "public"."shop_users" from "anon";

revoke delete on table "public"."shop_users" from "authenticated";

revoke insert on table "public"."shop_users" from "authenticated";

revoke references on table "public"."shop_users" from "authenticated";

revoke select on table "public"."shop_users" from "authenticated";

revoke trigger on table "public"."shop_users" from "authenticated";

revoke truncate on table "public"."shop_users" from "authenticated";

revoke update on table "public"."shop_users" from "authenticated";

revoke delete on table "public"."shop_users" from "service_role";

revoke insert on table "public"."shop_users" from "service_role";

revoke references on table "public"."shop_users" from "service_role";

revoke select on table "public"."shop_users" from "service_role";

revoke trigger on table "public"."shop_users" from "service_role";

revoke truncate on table "public"."shop_users" from "service_role";

revoke update on table "public"."shop_users" from "service_role";

revoke delete on table "public"."shop_workers" from "anon";

revoke insert on table "public"."shop_workers" from "anon";

revoke references on table "public"."shop_workers" from "anon";

revoke select on table "public"."shop_workers" from "anon";

revoke trigger on table "public"."shop_workers" from "anon";

revoke truncate on table "public"."shop_workers" from "anon";

revoke update on table "public"."shop_workers" from "anon";

revoke delete on table "public"."shop_workers" from "authenticated";

revoke insert on table "public"."shop_workers" from "authenticated";

revoke references on table "public"."shop_workers" from "authenticated";

revoke select on table "public"."shop_workers" from "authenticated";

revoke trigger on table "public"."shop_workers" from "authenticated";

revoke truncate on table "public"."shop_workers" from "authenticated";

revoke update on table "public"."shop_workers" from "authenticated";

revoke delete on table "public"."shop_workers" from "service_role";

revoke insert on table "public"."shop_workers" from "service_role";

revoke references on table "public"."shop_workers" from "service_role";

revoke select on table "public"."shop_workers" from "service_role";

revoke trigger on table "public"."shop_workers" from "service_role";

revoke truncate on table "public"."shop_workers" from "service_role";

revoke update on table "public"."shop_workers" from "service_role";

revoke delete on table "public"."shops_tables" from "anon";

revoke insert on table "public"."shops_tables" from "anon";

revoke references on table "public"."shops_tables" from "anon";

revoke select on table "public"."shops_tables" from "anon";

revoke trigger on table "public"."shops_tables" from "anon";

revoke truncate on table "public"."shops_tables" from "anon";

revoke update on table "public"."shops_tables" from "anon";

revoke delete on table "public"."shops_tables" from "authenticated";

revoke insert on table "public"."shops_tables" from "authenticated";

revoke references on table "public"."shops_tables" from "authenticated";

revoke select on table "public"."shops_tables" from "authenticated";

revoke trigger on table "public"."shops_tables" from "authenticated";

revoke truncate on table "public"."shops_tables" from "authenticated";

revoke update on table "public"."shops_tables" from "authenticated";

revoke delete on table "public"."shops_tables" from "service_role";

revoke insert on table "public"."shops_tables" from "service_role";

revoke references on table "public"."shops_tables" from "service_role";

revoke select on table "public"."shops_tables" from "service_role";

revoke trigger on table "public"."shops_tables" from "service_role";

revoke truncate on table "public"."shops_tables" from "service_role";

revoke update on table "public"."shops_tables" from "service_role";

revoke delete on table "public"."waitlist" from "anon";

revoke insert on table "public"."waitlist" from "anon";

revoke references on table "public"."waitlist" from "anon";

revoke select on table "public"."waitlist" from "anon";

revoke trigger on table "public"."waitlist" from "anon";

revoke truncate on table "public"."waitlist" from "anon";

revoke update on table "public"."waitlist" from "anon";

revoke delete on table "public"."waitlist" from "authenticated";

revoke insert on table "public"."waitlist" from "authenticated";

revoke references on table "public"."waitlist" from "authenticated";

revoke select on table "public"."waitlist" from "authenticated";

revoke trigger on table "public"."waitlist" from "authenticated";

revoke truncate on table "public"."waitlist" from "authenticated";

revoke update on table "public"."waitlist" from "authenticated";

revoke delete on table "public"."waitlist" from "service_role";

revoke insert on table "public"."waitlist" from "service_role";

revoke references on table "public"."waitlist" from "service_role";

revoke select on table "public"."waitlist" from "service_role";

revoke trigger on table "public"."waitlist" from "service_role";

revoke truncate on table "public"."waitlist" from "service_role";

revoke update on table "public"."waitlist" from "service_role";

alter table "public"."accomplishments" drop constraint "accomplishments_created_by_user_id_fkey";

alter table "public"."accomplishments" drop constraint "accomplishments_shop_id_fkey";

alter table "public"."appointments" drop constraint "appointments_client_id_fkey";

alter table "public"."appointments" drop constraint "appointments_shop_id_fkey";

alter table "public"."appointments" drop constraint "appointments_worker_id_fkey";

alter table "public"."appointments" drop constraint "check_appointment_times";

alter table "public"."daily_tasks" drop constraint "daily_tasks_created_by_user_id_fkey";

alter table "public"."daily_tasks" drop constraint "daily_tasks_shop_id_fkey";

alter table "public"."reminders" drop constraint "reminders_created_by_user_id_fkey";

alter table "public"."reminders" drop constraint "reminders_shop_id_fkey";

alter table "public"."reminders" drop constraint "reminders_type_check";

alter table "public"."shop_leads" drop constraint "shop_leads_worker_id_fkey";

alter table "public"."shop_leads" drop constraint "valid_pipeline_stage";

drop function if exists "public"."update_appointments_updated_at"();

drop function if exists "public"."update_updated_at_column"();

alter table "public"."accomplishments" drop constraint "accomplishments_pkey";

alter table "public"."appointments" drop constraint "appointments_pkey";

alter table "public"."daily_tasks" drop constraint "daily_tasks_pkey";

alter table "public"."reminders" drop constraint "reminders_pkey";

drop index if exists "public"."accomplishments_pkey";

drop index if exists "public"."appointments_pkey";

drop index if exists "public"."daily_tasks_pkey";

drop index if exists "public"."idx_accomplishments_date";

drop index if exists "public"."idx_accomplishments_shop_id";

drop index if exists "public"."idx_appointments_client_id";

drop index if exists "public"."idx_appointments_date";

drop index if exists "public"."idx_appointments_date_worker";

drop index if exists "public"."idx_appointments_shop_id";

drop index if exists "public"."idx_appointments_status";

drop index if exists "public"."idx_appointments_worker_id";

drop index if exists "public"."idx_daily_tasks_done";

drop index if exists "public"."idx_daily_tasks_shop_id";

drop index if exists "public"."idx_reminders_completed";

drop index if exists "public"."idx_reminders_due_date";

drop index if exists "public"."idx_reminders_shop_id";

drop index if exists "public"."idx_reminders_type";

drop index if exists "public"."idx_shop_leads_pipeline";

drop index if exists "public"."idx_shop_leads_worker_id";

drop index if exists "public"."reminders_pkey";

drop table "public"."accomplishments";

drop table "public"."appointments";

drop table "public"."daily_tasks";

drop table "public"."reminders";

create table "public"."shop_appointments" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone not null default now(),
    "scheduled_for" timestamp without time zone,
    "name" text,
    "prefered_artist" text,
    "shop_id" uuid
);


alter table "public"."shop_appointments" enable row level security;

create table "public"."shop_invites" (
    "id" uuid not null default gen_random_uuid(),
    "invite_code" text not null,
    "shop_id" uuid,
    "email" text,
    "role" text,
    "status" text not null default 'pending'::text,
    "expires_at" timestamp with time zone,
    "used_at" timestamp without time zone,
    "used_by" uuid,
    "created_by" uuid,
    "created_at" timestamp with time zone not null
);


alter table "public"."shop_invites" enable row level security;

alter table "public"."shop_leads" drop column "pipeline_stage";

alter table "public"."shop_leads" drop column "sort_order";

alter table "public"."shop_leads" drop column "worker_id";

alter table "public"."shop_leads" alter column "contact_phone" set data type integer using "contact_phone"::integer;

alter table "public"."shop_leads" enable row level security;

alter table "public"."shop_tasks" enable row level security;

alter table "public"."shop_users" enable row level security;

alter table "public"."shop_workers" drop column "color";

alter table "public"."shop_workers" enable row level security;

CREATE UNIQUE INDEX shop_appointments_pkey ON public.shop_appointments USING btree (id);

CREATE UNIQUE INDEX shop_invites_invite_code_key ON public.shop_invites USING btree (invite_code);

CREATE UNIQUE INDEX shop_invites_pkey ON public.shop_invites USING btree (id);

alter table "public"."shop_appointments" add constraint "shop_appointments_pkey" PRIMARY KEY using index "shop_appointments_pkey";

alter table "public"."shop_invites" add constraint "shop_invites_pkey" PRIMARY KEY using index "shop_invites_pkey";

alter table "public"."shop_appointments" add constraint "shop_appointments_shop_id_fkey" FOREIGN KEY (shop_id) REFERENCES shops_tables(shop_id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."shop_appointments" validate constraint "shop_appointments_shop_id_fkey";

alter table "public"."shop_invites" add constraint "role_check" CHECK ((role = ANY (ARRAY['owner'::text, 'admin'::text, 'member'::text]))) not valid;

alter table "public"."shop_invites" validate constraint "role_check";

alter table "public"."shop_invites" add constraint "shop_invites_created_by_fkey" FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."shop_invites" validate constraint "shop_invites_created_by_fkey";

alter table "public"."shop_invites" add constraint "shop_invites_invite_code_key" UNIQUE using index "shop_invites_invite_code_key";

alter table "public"."shop_invites" add constraint "shop_invites_shop_id_fkey" FOREIGN KEY (shop_id) REFERENCES shops_tables(shop_id) ON DELETE CASCADE not valid;

alter table "public"."shop_invites" validate constraint "shop_invites_shop_id_fkey";

alter table "public"."shop_invites" add constraint "shop_invites_used_by_fkey" FOREIGN KEY (used_by) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."shop_invites" validate constraint "shop_invites_used_by_fkey";

alter table "public"."shop_invites" add constraint "status_check" CHECK ((status = ANY (ARRAY['pending'::text, 'accepted'::text, 'expired'::text, 'cancelled'::text]))) not valid;

alter table "public"."shop_invites" validate constraint "status_check";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.user_can_create_shop(check_user_id uuid DEFAULT NULL::uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  target_user_id uuid;
  is_authenticated boolean;
BEGIN
  -- Use provided user_id or current authenticated user
  target_user_id := COALESCE(check_user_id, auth.uid());

  -- Check if user is authenticated
  is_authenticated := (auth.uid() IS NOT NULL);

  -- User must be authenticated to create shops
  RETURN is_authenticated;
END;
$function$
;

create policy "Anyone can view invite by code"
on "public"."shop_invites"
as permissive
for select
to public
using (true);


create policy "Owners can manage their shop invites"
on "public"."shop_invites"
as permissive
for all
to public
using ((EXISTS ( SELECT 1
   FROM shop_users
  WHERE ((shop_users.shop_id = shop_invites.shop_id) AND (shop_users.user_id = auth.uid()) AND (shop_users.role = ANY (ARRAY['owner'::text, 'admin'::text]))))));


create policy "Users can create invites for their shops"
on "public"."shop_invites"
as permissive
for insert
to public
with check ((EXISTS ( SELECT 1
   FROM shop_users
  WHERE ((shop_users.shop_id = shop_invites.shop_id) AND (shop_users.user_id = auth.uid()) AND (shop_users.role = ANY (ARRAY['owner'::text, 'admin'::text]))))));




