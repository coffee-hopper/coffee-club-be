import { Migration } from '@mikro-orm/migrations';

export class Migration20250718083241 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "invoice" drop constraint "invoice_payment_id_foreign";`);

    this.addSql(`alter table "invoice" drop constraint "invoice_payment_id_unique";`);
    this.addSql(`alter table "invoice" drop column "payment_id";`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "invoice" add column "payment_id" int null;`);
    this.addSql(`alter table "invoice" add constraint "invoice_payment_id_foreign" foreign key ("payment_id") references "payment" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "invoice" add constraint "invoice_payment_id_unique" unique ("payment_id");`);
  }

}
