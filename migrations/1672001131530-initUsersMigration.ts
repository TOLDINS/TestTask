import { MigrationInterface, QueryRunner } from 'typeorm';

export class initUsersMigration1672001131530 implements MigrationInterface {
  name = 'initUsersMigration1672001131530';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "status" character varying NOT NULL DEFAULT 'active', CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_065d4d8f3b5adb4a08841eae3c" ON "users" ("name") `,
    );
    await queryRunner.query(`INSERT INTO users (name, status) 
    VALUES 
        ('AXEL', 'active'),
        ('Annie', 'active'),
        ('Ace', 'not_active'),
        ('Zelda', 'active'),
        ('Diesel', 'active')`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_065d4d8f3b5adb4a08841eae3c"`,
    );
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
