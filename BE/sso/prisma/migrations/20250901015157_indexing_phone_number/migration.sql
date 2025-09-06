-- DropIndex
DROP INDEX "public"."users_phoneNumber_key";

-- CreateIndex
CREATE INDEX "users_phoneNumber_idx" ON "public"."users"("phoneNumber");
