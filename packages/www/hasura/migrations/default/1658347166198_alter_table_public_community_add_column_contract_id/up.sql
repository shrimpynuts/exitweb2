alter table "public"."community" add column "contract_id" serial
 not null unique;
