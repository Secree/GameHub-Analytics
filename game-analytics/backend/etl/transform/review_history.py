def transform_review_history(game):

    return {

        "appid": game["appid"],

        "positive_reviews": game["positive_reviews"],

        "negative_reviews": game["negative_reviews"]
    }