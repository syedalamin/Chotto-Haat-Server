-- AlterTable
ALTER TABLE "users" ALTER COLUMN "needPasswordChange" DROP NOT NULL,
ALTER COLUMN "needPasswordChange" SET DEFAULT true,
ALTER COLUMN "status" DROP NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
