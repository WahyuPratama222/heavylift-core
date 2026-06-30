-- AlterEnum
ALTER TYPE "PackageStatus" ADD VALUE 'pending_payment';
COMMIT;
-- AlterTable
ALTER TABLE "member_packages" ALTER COLUMN "status" SET DEFAULT 'pending_payment';
