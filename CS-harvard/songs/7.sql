select avg(energy) from songs, artists
where
songs.artist_id=artists.id
and
artists.name="Drake";
