-- CreateTable
CREATE TABLE "ClassMaster" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "class_name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ClassMaster_class_name_key" ON "ClassMaster"("class_name");
