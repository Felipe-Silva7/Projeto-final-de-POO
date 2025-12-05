const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'db.json');

function _readDb() {
	if (!fs.existsSync(dbPath)) {
		fs.writeFileSync(dbPath, JSON.stringify({ usuarios: [] }, null, 2), 'utf8');
	}
	const raw = fs.readFileSync(dbPath, 'utf8');
	return JSON.parse(raw || '{ "usuarios": [] }');
}

function _writeDb(obj) {
	fs.writeFileSync(dbPath, JSON.stringify(obj, null, 2), 'utf8');
}

module.exports = {
	getUsuarios() {
		const db = _readDb();
		return db.usuarios || [];
	},
	saveUsuario(usuarioObj) {
		const db = _readDb();
		db.usuarios = db.usuarios || [];
		db.usuarios.push(usuarioObj);
		_writeDb(db);
		return usuarioObj;
	},
	overwriteAll(usuarios) {
		_writeDb({ usuarios: usuarios || [] });
	}
};
