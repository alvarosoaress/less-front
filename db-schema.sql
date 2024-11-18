CREATE TABLE public.construction (
  id serial PRIMARY KEY,
  code varchar UNIQUE NOT NULL,
  name varchar NOT NULL,
  address varchar
);

create table public.employee (
    id serial primary key,
    name varchar not null,
    role varchar,
    daily_value decimal not null
);

create table public.trabalho (
    id serial primary key,
    id_construction int primary key, foreign key(id_construction) references construction(id),
    id_employee int primary key, foreign key(id_employee) references employee(id),
    data date primary key,
    praticado decimal,
    valor_diaria decimal
)