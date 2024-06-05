select name from people where id in
(select person_id from stars where movie_id in
(select movies.id as idm from movies where year='2004')) order by birth;
