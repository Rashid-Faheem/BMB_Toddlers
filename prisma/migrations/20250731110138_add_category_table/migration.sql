-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_StudentClass" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "student_id" INTEGER NOT NULL,
    "class_id" INTEGER NOT NULL,
    "session_id" INTEGER NOT NULL,
    "section" TEXT NOT NULL DEFAULT 'A',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "feeAmt" REAL NOT NULL DEFAULT 0.0,
    "passed" BOOLEAN NOT NULL DEFAULT false,
    "remarks" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "StudentClass_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "SessionMaster" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "StudentClass_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "ClassMaster" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "StudentClass_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Student" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_StudentClass" ("active", "class_id", "createdAt", "feeAmt", "id", "passed", "remarks", "session_id", "student_id", "updatedAt") SELECT "active", "class_id", "createdAt", "feeAmt", "id", "passed", "remarks", "session_id", "student_id", "updatedAt" FROM "StudentClass";
DROP TABLE "StudentClass";
ALTER TABLE "new_StudentClass" RENAME TO "StudentClass";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
