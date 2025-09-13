/*
  Warnings:

  - Changed the type of `type` on the `Otp` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."OtpCodeType" AS ENUM ('VERIFY_EMAIL', 'RESET_PASSWORD', 'FORGOT_PASSWORD');

-- AlterTable
ALTER TABLE "public"."Otp" DROP COLUMN "type",
ADD COLUMN     "type" "public"."OtpCodeType" NOT NULL;

-- DropEnum
DROP TYPE "public"."OtpType";

-- CreateIndex
CREATE UNIQUE INDEX "Otp_email_code_type_key" ON "public"."Otp"("email", "code", "type");
