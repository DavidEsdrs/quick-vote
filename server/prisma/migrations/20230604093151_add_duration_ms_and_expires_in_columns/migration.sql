/*
  Warnings:

  - Added the required column `duration_ms` to the `polls` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expires_in` to the `polls` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_polls" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "duration_ms" INTEGER NOT NULL,
    "expires_in" DATETIME NOT NULL
);
INSERT INTO "new_polls" ("createdAt", "id", "title") SELECT "createdAt", "id", "title" FROM "polls";
DROP TABLE "polls";
ALTER TABLE "new_polls" RENAME TO "polls";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
