select avg(rating) from ratings where movie_id in
(select id from movies where year = '2012');

-- select avg(rating) from ratings, movies where movies.year='2012' and ratings.movie_id=movies.id;
