import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

const data = [
    {
        game: "Game 1",
        players: 1320000,
        rating: 95
    },
    {
        game: "Game 2",
        players: 720000,
        rating: 90
    },
    {
        game: "Game 3",
        players: 185000,
        rating: 88
    }
]

const GameChart_Bar = () => {
    return (
        <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="game" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="players" fill="#8884d8" />
            </BarChart>
        </ResponsiveContainer>
    )
}

export default GameChart_Bar;