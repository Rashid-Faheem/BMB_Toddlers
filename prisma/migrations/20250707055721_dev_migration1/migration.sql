-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "SessionMaster" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sessionName" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Student" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "fname" TEXT NOT NULL,
    "mname" TEXT,
    "sex" TEXT NOT NULL,
    "address" TEXT,
    "dob" DATETIME,
    "contactno" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "donation" BOOLEAN NOT NULL DEFAULT false,
    "fcnic" TEXT,
    "mcnic" TEXT,
    "session_id" INTEGER,
    "class_id" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Student_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "SessionMaster" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Student_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "ClassMaster" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PaymentMonth" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "month_name" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "session_id" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PaymentMonth_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "SessionMaster" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "SessionMaster_sessionName_key" ON "SessionMaster"("sessionName");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentMonth_month_name_key" ON "PaymentMonth"("month_name");
