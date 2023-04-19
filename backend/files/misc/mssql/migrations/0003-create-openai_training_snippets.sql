
create table ml_types(
  type nvarchar(256) not null,
  model nvarchar(1024) not null,
  max_tokens int not null,
  temperature decimal(3,2) not null,
  constraint pk_ml_types primary key clustered(type asc)
);

go

create table ml_training_snippets(
  id int not null identity(1,1),
  created datetime not null default getutcdate(),
  type nvarchar(256) not null default 'hl',
  pushed bit not null default 0,
  uri nvarchar(1024) null,
  prompt ntext not null,
  completion ntext not null,
  constraint pk_ml_training_snippets primary key clustered(id asc)
);


go


alter table ml_training_snippets
  add foreign key ([type])
  references ml_types(type)
  on delete cascade;
