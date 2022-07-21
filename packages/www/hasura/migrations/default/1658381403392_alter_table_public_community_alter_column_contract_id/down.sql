alter table "public"."community" alter column "contract_id" set not null;
alter table "public"."community" alter column "contract_id" set default nextval('community_contract_id_seq'::regclass);
ALTER TABLE "public"."community" ALTER COLUMN "contract_id" TYPE integer;
