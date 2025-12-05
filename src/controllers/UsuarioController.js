import Persistencia  from'../sevices/PersistenciaService';
import Usuario  from'../moels/Usuario';
import UsuarioComRestricoes  from'../moels/UsuarioComRestricoes';
import UsuarioComum  from'../moels/UsuarioComum';
import path  from'path';

class UsuarioController {
	listar() {
		return Persistencia.getUsuarios();
	}

	criar(data) {
		// data: { nome, idade, peso, altura, objetivo, limitacoes, restricoes }
		let inst;
		if (data && Array.isArray(data.restricoes) && data.restricoes.length > 0) {
			inst = new UsuarioComRestricoes(data);
		} else {
			inst = new UsuarioComum(data);
		}
		Persistencia.saveUsuario(inst.toJSON ? inst.toJSON() : inst);
		return inst;
	}

	login(req, res){
		return res.sendFile(path.join(__dirname, 'src', 'views', 'templates', 'login.html'));
	}
}


export default UsuarioController;
