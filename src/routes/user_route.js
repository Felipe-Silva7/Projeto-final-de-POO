// src/routes/index.js
import { Router } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// recria __filename e __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const user_route = new Router();

user_route.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'templates', 'login.html'));
});

export default user_route;
