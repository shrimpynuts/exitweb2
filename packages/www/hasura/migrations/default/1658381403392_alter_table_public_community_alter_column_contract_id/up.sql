ALTER TABLE "public"."community" ALTER COLUMN "contract_id" TYPE integer;
ALTER TABLE "public"."community" ALTER COLUMN "contract_id" drop default;
alter table "public"."community" alter column "contract_id" drop not null;
