SELECT g.appid, g.name, t.tag_name, gt.votes
FROM gamehub_analytics.games AS g
LEFT JOIN gamehub_analytics.game_tags AS gt USING(appid)
LEFT JOIN gamehub_analytics.tags AS t USING(tag_id)
ORDER BY appid;