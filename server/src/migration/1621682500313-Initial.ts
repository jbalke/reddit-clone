import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1621682500313 implements MigrationInterface {
  name = 'Initial1621682500313';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying NOT NULL, "username_lookup" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "tokenVersion" integer NOT NULL DEFAULT 0, "verified" boolean NOT NULL DEFAULT false, "lastPostAt" TIMESTAMP WITH TIME ZONE, "lastActiveAt" TIMESTAMP WITH TIME ZONE, "isAdmin" boolean NOT NULL DEFAULT false, "bannedUntil" TIMESTAMP WITH TIME ZONE, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_36d9d047aac50b0bd6f440adff7" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_5b71ce75727123308ad66eb47e" ON "users" ("username_lookup") `
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_95fbb16a9904930cce45cb6739" ON "users" ("email") `
    );
    await queryRunner.query(
      `CREATE TABLE "upvotes" ("value" integer NOT NULL, "userId" uuid NOT NULL, "postId" integer NOT NULL, CONSTRAINT "PK_e749ce5f1ff3a8e8b1d950bb8cc" PRIMARY KEY ("userId", "postId"))`
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_e749ce5f1ff3a8e8b1d950bb8c" ON "upvotes" ("userId", "postId") `
    );
    await queryRunner.query(
      `CREATE TABLE "posts" ("id" SERIAL NOT NULL, "title" text, "text" text NOT NULL, "authorId" uuid NOT NULL, "originalPostId" integer, "parentId" integer, "level" integer NOT NULL DEFAULT 0, "replies" integer NOT NULL DEFAULT 0, "score" integer NOT NULL DEFAULT 0, "voteCount" integer NOT NULL DEFAULT 0, "isLocked" boolean NOT NULL DEFAULT false, "flaggedAt" TIMESTAMP WITH TIME ZONE, "isPinned" boolean NOT NULL DEFAULT false, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_892da5966ca2bf17893c4927507" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5deec1c8653c3d8674e7818ab5" ON "posts" ("originalPostId") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_58319c38ff4aa6a8aa304dab71" ON "posts" ("createdAt") `
    );
    await queryRunner.query(
      `ALTER TABLE "upvotes" ADD CONSTRAINT "FK_ca6221e8fe6774d38cd370077e9" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "upvotes" ADD CONSTRAINT "FK_d6b81da8eba446df490032749d4" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "posts" ADD CONSTRAINT "FK_297855a4a75a7d22a861c64b73d" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "posts" ADD CONSTRAINT "FK_5deec1c8653c3d8674e7818ab5c" FOREIGN KEY ("originalPostId") REFERENCES "posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "posts" ADD CONSTRAINT "FK_31296a813514442ab6085c8ca45" FOREIGN KEY ("parentId") REFERENCES "posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `CREATE TABLE "query-result-cache" ("id" SERIAL NOT NULL, "identifier" character varying, "time" bigint NOT NULL, "duration" integer NOT NULL, "query" text NOT NULL, "result" text NOT NULL, CONSTRAINT "PK_6b450123547e4828c1b8264f870" PRIMARY KEY ("id"))`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "query-result-cache"`);
    await queryRunner.query(
      `ALTER TABLE "posts" DROP CONSTRAINT "FK_31296a813514442ab6085c8ca45"`
    );
    await queryRunner.query(
      `ALTER TABLE "posts" DROP CONSTRAINT "FK_5deec1c8653c3d8674e7818ab5c"`
    );
    await queryRunner.query(
      `ALTER TABLE "posts" DROP CONSTRAINT "FK_297855a4a75a7d22a861c64b73d"`
    );
    await queryRunner.query(
      `ALTER TABLE "upvotes" DROP CONSTRAINT "FK_d6b81da8eba446df490032749d4"`
    );
    await queryRunner.query(
      `ALTER TABLE "upvotes" DROP CONSTRAINT "FK_ca6221e8fe6774d38cd370077e9"`
    );
    await queryRunner.query(`DROP INDEX "IDX_58319c38ff4aa6a8aa304dab71"`);
    await queryRunner.query(`DROP INDEX "IDX_5deec1c8653c3d8674e7818ab5"`);
    await queryRunner.query(`DROP TABLE "posts"`);
    await queryRunner.query(`DROP INDEX "IDX_e749ce5f1ff3a8e8b1d950bb8c"`);
    await queryRunner.query(`DROP TABLE "upvotes"`);
    await queryRunner.query(`DROP INDEX "IDX_95fbb16a9904930cce45cb6739"`);
    await queryRunner.query(`DROP INDEX "IDX_5b71ce75727123308ad66eb47e"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
