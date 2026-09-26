CREATE TABLE "property" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "property_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"checkInDate" timestamp NOT NULL,
	"checkOutDate" timestamp NOT NULL
);
