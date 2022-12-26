import { MigrationInterface, QueryRunner } from "typeorm";

export class initPaymentAnaliticsMigration1672008976117 implements MigrationInterface {
    name = 'initPaymentAnaliticsMigration1672008976117'

    public async up(queryRunner: QueryRunner): Promise<void> {
       
        await queryRunner.query(`CREATE TABLE "payment_analitics" ("id" SERIAL NOT NULL, "user_id" integer NOT NULL, "price" real NOT NULL, "currency" character varying NOT NULL, "tarrif_title" character varying NOT NULL, "status" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0430e9cc28c647c175470ecbcb5" PRIMARY KEY ("id"))`);
      
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
   
        await queryRunner.query(`DROP TABLE "payment_analitics"`);
   
    }

}
