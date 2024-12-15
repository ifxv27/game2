import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Sample data structures
const cards = [
    {
        id: '1',
        name: "Seductive Sorceress",
        imageUrl: "/cards/card1.jpg",
        category: "Starter Cards",
        type: "Starter Card",
        starRank: 3,
        stats: {
            attack: 15,
            defense: 12,
            health: 100,
            energy: 100
        }
    },
    {
        id: '2',
        name: "Mystic Enchantress",
        imageUrl: "/cards/card2.jpg",
        category: "Starter Cards",
        type: "Starter Card",
        starRank: 3,
        stats: {
            attack: 12,
            defense: 15,
            health: 100,
            energy: 100
        }
    },
    {
        id: '3',
        name: "Shadow Assassin",
        imageUrl: "/cards/card3.jpg",
        category: "Starter Cards",
        type: "Starter Card",
        starRank: 3,
        stats: {
            attack: 18,
            defense: 10,
            health: 90,
            energy: 110
        }
    },
    {
        id: '4',
        name: "Celestial Guardian",
        imageUrl: "/cards/card4.jpg",
        category: "Starter Cards",
        type: "Starter Card",
        starRank: 3,
        stats: {
            attack: 10,
            defense: 18,
            health: 110,
            energy: 90
        }
    }
];

let players = [
    {
        id: 'admin',
        username: 'admin',
        password: 'admin123', // In a real app, this would be hashed
        isAdmin: true,
        stats: {
            level: 99,
            experience: 9999,
            health: 999,
            energy: 999,
            attack: 99,
            defense: 99,
            speed: 99
        },
        selectedCard: '1',
        cards: ['1', '2', '3', '4']
    }
];

// Routes
app.post('/api/players/register', (req, res) => {
    const { username, password, cardId } = req.body;

    // Check if username already exists
    if (players.find(p => p.username === username)) {
        return res.status(400).json({ message: 'Username already exists' });
    }

    // Create new player
    const player = {
        id: Date.now().toString(),
        username,
        password, // In a real app, you'd hash this
        stats: {
            level: 1,
            experience: 0,
            health: 100,
            energy: 100,
            attack: 10,
            defense: 10,
            speed: 10
        },
        selectedCard: cardId,
        cards: [cardId]
    };

    players.push(player);

    // Create a token (in a real app, you'd use JWT)
    const token = player.id;

    res.json({ 
        message: 'Registration successful',
        player: { ...player, password: undefined },
        token 
    });
});

app.post('/api/players/login', (req, res) => {
    const { username, password } = req.body;
    const player = players.find(p => p.username === username && p.password === password);

    if (!player) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create a token (in a real app, you'd use JWT)
    const token = Math.random().toString(36).substring(7);

    res.json({
        message: 'Login successful',
        player: {
            ...player,
            password: undefined // Don't send password back
        },
        token
    });
});

app.get('/api/players/me', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    const player = players.find(p => p.id === token);

    if (!player) {
        return res.status(401).json({ message: 'Invalid token' });
    }

    res.json({ 
        player: { ...player, password: undefined }
    });
});

// Get all cards
app.get('/api/cards', (req, res) => {
    res.json(cards);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
