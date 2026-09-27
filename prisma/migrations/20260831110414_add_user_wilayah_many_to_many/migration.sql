-- CreateTable
CREATE TABLE "UserWilayah" (
    "userId" TEXT NOT NULL,
    "wilayahId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserWilayah_pkey" PRIMARY KEY ("userId","wilayahId")
);

-- AddForeignKey
ALTER TABLE "UserWilayah" ADD CONSTRAINT "UserWilayah_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserWilayah" ADD CONSTRAINT "UserWilayah_wilayahId_fkey" FOREIGN KEY ("wilayahId") REFERENCES "Wilayah"("id") ON DELETE CASCADE ON UPDATE CASCADE;
