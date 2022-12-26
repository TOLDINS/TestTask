import { MigrationInterface, QueryRunner } from 'typeorm';

export class initUsersBalanceRecord1672001309080 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users_balance_record " ("id" SERIAL NOT NULL, "debit" real NOT NULL DEFAULT '0', "credit" real NOT NULL DEFAULT '0', "user_id" integer, CONSTRAINT "REL_6cd4b072974aaa857f36447dda" UNIQUE ("user_id"), CONSTRAINT "PK_51b811c9c6a4443e9c4636c0c23" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_balance_record " ADD CONSTRAINT "FK_6cd4b072974aaa857f36447dda6" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users_balance_record " DROP CONSTRAINT "FK_6cd4b072974aaa857f36447dda6"`,
    );
    await queryRunner.query(`DROP TABLE "users_balance_record "`);
  }
}
