create or replace view "public"."user_relationships" as  SELECT wu1.user_id AS user1,
    wu2.user_id AS user2,
    count(*) AS shared_watchlist_count
   FROM (watchlists_users wu1
     JOIN watchlists_users wu2 ON ((wu1.watchlist_id = wu2.watchlist_id)))
  WHERE (wu1.user_id < wu2.user_id)
  GROUP BY wu1.user_id, wu2.user_id
  ORDER BY (count(*)) DESC;



