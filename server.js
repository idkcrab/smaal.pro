const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid'); // npm install uuid
const app = express();
app.use(express.json());
app.use(express.static('.')); // serve static files

const DATA_FILE = path.join(__dirname, 'data.json');

// Initialize data.json if not exists
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ questions: [] }));
}

// Get all questions
app.get('/questions', (req, res) => {
    const data = JSON.parse(fs.readFileSync(DATA_FILE));
    res.json(data);
});

// Add new question
app.post('/add-question', (req, res) => {
    const { question } = req.body;
    if(!question) return res.status(400).send('Question required');

    const data = JSON.parse(fs.readFileSync(DATA_FILE));
    data.questions.push({ id: uuidv4(), text: question, votes: 0 });
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    res.json(data.questions);
});

// Vote on a question
app.post('/vote', (req, res) => {
    const { id } = req.body;
    const data = JSON.parse(fs.readFileSync(DATA_FILE));
    const q = data.questions.find(q => q.id === id);
    if(q) {
        q.votes += 1;
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
        res.json(data.questions);
    } else res.status(404).send('Question not found');
});

// Delete a question
app.post('/delete-question', (req, res) => {
    const { id } = req.body;
    const data = JSON.parse(fs.readFileSync(DATA_FILE));
    const index = data.questions.findIndex(q => q.id === id);
    if(index !== -1) {
        data.questions.splice(index, 1);
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
        res.json(data.questions);
    } else {
        res.status(404).send('Question not found');
    }
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
