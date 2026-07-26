import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { getGames } from "../services/games";

export function Games() {

    const [games, setGames] = useState<any[]>([]);

    const [params] = useSearchParams();

    const search = params.get("search") ?? "";

    useEffect(() => {

        getGames(search)
            .then(setGames)
            .catch(console.error);

    }, [search]);

    return (

        <div className="games-page">

            <h1>Games</h1>

            {

                games.length === 0 ?

                <p>No games found.</p>

                :

                <div className="game-grid">

                    {

                        games.map(game => (

                            <div
                                className="game-card"
                                key={game.appid}
                            >

                                <img
                                    src={game.header_image}
                                    alt={game.name}
                                />

                                <h3>{game.name}</h3>

                                <p>{game.genre}</p>

                                <p>

                                    {

                                        game.is_free

                                        ?

                                        "Free"

                                        :

                                        `$${game.price}`

                                    }

                                </p>

                                <p>

                                    {game.reviews.toLocaleString()} Reviews

                                </p>

                            </div>

                        ))

                    }

                </div>

            }

        </div>

    );

}