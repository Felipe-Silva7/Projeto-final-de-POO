// server.js
import createApp from './src/app.js';

const app = createApp();
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server rodando em http://localhost:${PORT}`);
});
