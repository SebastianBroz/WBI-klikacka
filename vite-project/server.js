import express from 'express';
import cors from 'cors';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DATA_FILE = resolve(__dirname, 'server-data.json');
const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(resolve(__dirname, 'dist')));
app.use(express.static(resolve(__dirname, 'public')));

const defaultState = {
    leaderboard: [],
    saves: {},
};

async function loadState() {
    try {
        const raw = await fs.readFile(DATA_FILE, 'utf-8');
        return JSON.parse(raw);
    } catch (error) {
        return { ...defaultState };
    }
}

async function saveState(state) {
    await fs.writeFile(DATA_FILE, JSON.stringify(state, null, 2), 'utf-8');
}

function normalizeName(name) {
    return String(name || '').trim().slice(0, 32);
}

app.get('/api/status', async (req, res) => {
    res.json({ status: 'ok', version: '1.0.0' });
});

app.get('/api/leaderboard', async (req, res) => {
    const state = await loadState();
    const sorted = [...(state.leaderboard || [])]
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);
    res.json(sorted);
});

app.post('/api/save', async (req, res) => {
    const { name, score, prestigeLevel, saveData, plantData } = req.body || {};
    const safeName = normalizeName(name);

    if (!safeName) {
        return res.status(400).json({ error: 'Missing player name' });
    }

    const numericScore = Number(score) || 0;
    const numericPrestige = Number(prestigeLevel) || 0;
    const state = await loadState();
    const now = new Date().toISOString();

    const existing = state.leaderboard.find(entry => entry.name === safeName);
    if (existing) {
        existing.score = Math.max(existing.score, numericScore);
        existing.prestige = Math.max(existing.prestige, numericPrestige);
        existing.updatedAt = now;
    } else {
        state.leaderboard.push({ name: safeName, score: numericScore, prestige: numericPrestige, updatedAt: now });
    }

    state.leaderboard = state.leaderboard
        .sort((a, b) => b.score - a.score)
        .slice(0, 50);

    state.saves[safeName] = {
        name: safeName,
        score: numericScore,
        prestigeLevel: numericPrestige,
        saveData: saveData || {},
        plantData: plantData || null,
        updatedAt: now,
    };

    await saveState(state);
    res.json({ success: true, leaderboard: state.leaderboard.slice(0, 10) });
});

app.get('/api/save/:name', async (req, res) => {
    const safeName = normalizeName(req.params.name);
    if (!safeName) {
        return res.status(400).json({ error: 'Invalid player name' });
    }

    const state = await loadState();
    const save = state.saves?.[safeName];
    if (!save) {
        return res.status(404).json({ error: 'Save not found' });
    }

    res.json(save);
});

app.get('*', (req, res) => {
    const indexPath = resolve(__dirname, 'dist', 'index.html');
    res.sendFile(indexPath, (err) => {
        if (err) {
            res.status(404).json({ error: 'Not found' });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server save API listening on http://localhost:${PORT}`);
});
