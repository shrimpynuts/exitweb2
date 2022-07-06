CREATE TABLE "public"."submissions" ("id" serial NOT NULL, "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "commitment" text NOT NULL, "proof_of_interaction" text NOT NULL, "approved" boolean NOT NULL DEFAULT false, "community_id" uuid NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("community_id") REFERENCES "public"."community"("id") ON UPDATE cascade ON DELETE cascade, UNIQUE ("id"));
CREATE OR REPLACE FUNCTION "public"."set_current_timestamp_updated_at"()
RETURNS TRIGGER AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER "set_public_submissions_updated_at"
BEFORE UPDATE ON "public"."submissions"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_submissions_updated_at" ON "public"."submissions" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
