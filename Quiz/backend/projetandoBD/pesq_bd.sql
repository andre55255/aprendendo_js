create table quiz (
	id serial not null primary key,
	nome varchar(255) not null
);

create table respostas(
	id serial not null primary key,
	descricao varchar(5000) not null,
	correta bool not null
);

create table perguntas (
	id serial not null primary key,
	descricao varchar(5000) not null
);

create table perguntas_respostas (
	id serial not null primary key,
	id_quiz integer not null,
	foreign key(id_quiz) references quiz(id),
	id_respostas integer not null,
	foreign key(id_respostas) references respostas(id),
	id_perguntas integer not null,
	foreign key(id_perguntas) references perguntas(id)
);

insert into quiz(nome) values ('Teste');

insert into perguntas(descricao) values ('Em que ano nasceu Napoleão Bonaparte?');

insert into respostas(descricao, correta) values ('1856', false);
insert into respostas(descricao, correta) values ('1846', false);
insert into respostas(descricao, correta) values ('1859', false);
insert into respostas(descricao, correta) values ('1875', true);

insert into perguntas_respostas(id_quiz, id_respostas, id_perguntas) values (1, 13, 3);
insert into perguntas_respostas(id_quiz, id_respostas, id_perguntas) values (1, 14, 3);
insert into perguntas_respostas(id_quiz, id_respostas, id_perguntas) values (1, 15, 3);
insert into perguntas_respostas(id_quiz, id_respostas, id_perguntas) values (1, 16, 3);

select
	q.nome as "Quiz",
	p.descricao as "Perguntas",
	r.descricao as "Respostas",
	r.correta as "Correta"
from
	perguntas_respostas pq,
	quiz q,
	respostas r,
	perguntas p
where
	pq.id_quiz = q.id and
	pq.id_respostas = r.id and
	pq.id_perguntas = p.id;