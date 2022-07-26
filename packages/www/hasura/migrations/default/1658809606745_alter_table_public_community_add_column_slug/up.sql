alter table "public"."community" add column "slug" text
 not null unique;
