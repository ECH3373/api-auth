import jwt from 'jsonwebtoken';
import { config } from '../../../config/index.js';
import { services } from '../../services/index.js';
import { user as User } from '../user/index.js';
import { role as Role } from '../role/index.js';

const login = async (req, res) => {
  const { username, password } = req.body;

  console.log(config.jwt.key);

  if (!username) return services.response.send({ res, code: 400, error: 'username is required' });
  if (!password) return services.response.send({ res, code: 400, error: 'password is required' });
  const employee = await services.api.get_employee(username);
  if (!employee || !employee.is_active) return services.response.send({ res, code: 401, error: 'invalid credentials' });
  const user = await User.model.findOne({ employee_id: employee._id, app_id: password });
  if (!user) return services.response.send({ res, code: 401, error: 'invalid credentials' });
  const access_token = jwt.sign({ id: user._id }, config.jwt.key, { expiresIn: '1h' });
  const refresh_token = jwt.sign({ id: user._id }, config.jwt.key, { expiresIn: '7d' });
  const data = { access_token, refresh_token };
  return services.response.send({ res, data, message: 'logged' });
};

const refresh = async (req, res) => {
  const { refresh_token } = req.body;
  if (!refresh_token) return services.response.send({ res, code: 400, error: 'refresh_token is required' });
  const decoded = jwt.verify(refresh_token, config.jwt.key);
  const access_token = jwt.sign({ id: decoded.id }, config.jwt.key, { expiresIn: '1h' });
  return services.response.send({ res, data: access_token, message: 'token refreshed' });
};

const me = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return services.response.send({ res, code: 401, error: 'no token provided' });
  const token = authHeader.split(' ')[1];
  const decoded = jwt.verify(token, config.jwt.key);
  const user = await User.model.findById(decoded.id);
  if (!user) return services.response.send({ res, code: 404, error: 'user not found' });
  const employee = await services.api.get_employee(user.employee_id);
  const role = await Role.model.findById(user.role_id);
  const data = { ...employee, role };
  return services.response.send({ res, data, message: 'user found successfull' });
};

const logout = async (req, res) => {
  return services.response.send({ res, message: 'logout' });
};

export const controller = {
  login,
  refresh,
  me,
  logout,
};
