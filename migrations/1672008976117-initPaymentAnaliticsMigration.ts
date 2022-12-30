import { MigrationInterface, QueryRunner } from 'typeorm';

export class initPaymentAnaliticsMigration1672008976117
  implements MigrationInterface
{
  name = 'initPaymentAnaliticsMigration1672008976117';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "analytics_record" ("id" SERIAL NOT NULL, "user_id" integer NOT NULL, "action_subject_type" character varying NOT NULL, "attributes" jsonb, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_36d5ed285075dd0ceb1426dec7f" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "analytics_record"`);
  }
}
