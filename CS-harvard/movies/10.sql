select name from people where id in
(select person_id from directors where movie_id in
(select id from movies, ratings where rating>=9 and movies.id=ratings.movie_id ));
