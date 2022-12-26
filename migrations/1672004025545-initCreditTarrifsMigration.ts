import { MigrationInterface, QueryRunner } from 'typeorm';

export class initCreditTarrifsMigration1672004025545
  implements MigrationInterface
{
  name = 'initCreditTarrifsMigration1672004025545';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "credit_tarrifs" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "price" real NOT NULL, "currency" character varying NOT NULL, "credit_count" real NOT NULL, CONSTRAINT "PK_c53f206b32c8312ad68bb7010ea" PRIMARY KEY ("id"))`,
    );

    await queryRunner.query(`INSERT INTO credit_tarrifs (title, price, currency, credit_count) 
        VALUES 
            ('Base',10,'usd',50),
            ('Medium',15,'usd', 75),
            ('Pro',20,'usd',100),
            ('Premium Pro',25,'usd',125)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "credit_tarrifs"`);
  }
}
