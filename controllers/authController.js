const usuariosRepository = require('../repositories/usuariosRepository');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '1h';

function isStrongPassword(senha) {
	return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(senha);
}

exports.register = async (req, res) => {
	const { nome, email, senha, ...extras } = req.body;
	if (!nome || !email || !senha) {
		return res.status(400).json({ error: 'Nome, email e senha são obrigatórios.' });
	}

	const camposPermitidos = ['nome', 'email', 'senha'];
	const camposRecebidos = Object.keys(req.body);
	const camposExtras = camposRecebidos.filter(c => !camposPermitidos.includes(c));
	if (camposExtras.length > 0) {
		return res.status(400).json({ error: 'Campos extras não permitidos.' });
	}
	if (!isStrongPassword(senha)) {
		return res.status(400).json({ error: 'Senha fraca. Deve ter ao menos 8 caracteres, uma letra minúscula, uma maiúscula, um número e um caractere especial.' });
	}
	const usuarioExistente = await usuariosRepository.findByEmail(email);
	if (usuarioExistente) {
		return res.status(400).json({ error: 'Email já está em uso.' });
	}
	const hash = await bcrypt.hash(senha, 10);
	const usuarioCriado = await usuariosRepository.createUsuario({ nome, email, senha: hash });
	return res.status(201).json(usuarioCriado);
};

exports.login = async (req, res) => {
	const { email, senha } = req.body;
	if (!email || !senha) {
		return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
	}
	const usuario = await usuariosRepository.findByEmail(email);
	if (!usuario) {
		return res.status(401).json({ error: 'Credenciais inválidas.' });
	}
	const senhaValida = await bcrypt.compare(senha, usuario.senha);
	if (!senhaValida) {
		return res.status(401).json({ error: 'Credenciais inválidas.' });
	}
	const token = jwt.sign({ id: usuario.id, email: usuario.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
	return res.status(200).json({ access_token: token });
};

exports.logout = async (req, res) => {
	return res.status(200).json({ message: 'Logout realizado com sucesso.' });
};

exports.deleteUser = async (req, res) => {
	const { id } = req.params;
	const usuario = await usuariosRepository.findById(id);
	if (!usuario) {
		return res.status(404).json({ error: 'Usuário não encontrado.' });
	}
	await usuariosRepository.deleteUsuario(id);
	return res.status(200).json({ message: 'Usuário excluído com sucesso.' });
};

exports.getMe = async (req, res) => {
	const usuario = await usuariosRepository.findById(req.user.id);
	if (!usuario) {
		return res.status(404).json({ error: 'Usuário não encontrado.' });
	}
	res.status(200).json({ id: usuario.id, nome: usuario.nome, email: usuario.email });
};