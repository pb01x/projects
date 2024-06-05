select title, rating from movies , ratings
where movies.year='2010' AND ratings.rating>0 AND ratings.movie_id=movies.id order by rating desc, title asc;
