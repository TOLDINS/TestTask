import { MigrationInterface, QueryRunner } from 'typeorm';

export class initPaymentOrdersMigration1672009235680
  implements MigrationInterface
{
  name = 'initPaymentOrdersMigration1672009235680';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "payment_orders_record" ("id" SERIAL NOT NULL, "user_id" integer NOT NULL, "tarrif_id" integer NOT NULL, "status" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(),  CONSTRAINT "PK_7017b2e2e966654d41d8741bfea" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ec121f23d919aaef6b16406feb" ON "payment_orders_record" ("tarrif_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_orders_record" ADD CONSTRAINT "FK_1139e61fdf998833fc2a63c09fd" FOREIGN KEY ("tarrif_id") REFERENCES "credit_tarrifs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "payment_orders_record" DROP CONSTRAINT "FK_1139e61fdf998833fc2a63c09fd"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_51b8b26ac168fbe7d6f5653e6c"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ec121f23d919aaef6b16406feb"`,
    );
    await queryRunner.query(`DROP TABLE "payment_orders_record"`);
  }
}
