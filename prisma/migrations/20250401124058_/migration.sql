/*
  Warnings:

  - You are about to drop the column `taskId` on the `categories` table. All the data in the column will be lost.
  - Added the required column `color` to the `categories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `task_id` to the `categories` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "categories" DROP CONSTRAINT "categories_taskId_fkey";

-- AlterTable
ALTER TABLE "categories" DROP COLUMN "taskId",
ADD COLUMN     "color" TEXT NOT NULL,
ADD COLUMN     "task_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
