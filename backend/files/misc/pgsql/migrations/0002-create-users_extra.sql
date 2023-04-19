

create table "users_extra" (
  "user" varchar(256) not null,
  "type" varchar(45) not null,
  "value" varchar(1024) not null,
  primary key ("user", "type"),
  constraint "users_extra_fky" foreign key ("user") references "users" ("username") on delete cascade
);
create index "users_extra_fky_idx" on "users_extra" ("user");
