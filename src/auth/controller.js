import axios from 'axios';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { services } from '../shared/services/index.js';
import { config } from '../../config/index.js';

const prisma = new PrismaClient();

const login = async (req, res) => {
  const { username, password } = req.body;
  if (!username) return services.response.send({ res, code: 400, error: 'username is required' });
  if (!password) return services.response.send({ res, code: 400, error: 'password is required' });
  const employee = (await axios.get(`http://82.29.197.244:8080/employees/${username}`)).data.data;
  if (!employee || !employee.is_active) return services.response.send({ res, code: 404, error: 'invalid credentials' });
  const user = await prisma.user.findFirst({ where: { employee_id: employee._id, app_id: password }, include: { role: true } });
  if (!user) return services.response.send({ res, code: 404, error: 'invalid credentials' });
  const access_token = jwt.sign({ id: user.id }, config.jwt.key, { expiresIn: '1h' });
  const refresh_token = jwt.sign({ id: user.id }, config.jwt.key, { expiresIn: '7d' });
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
  const user = await prisma.user.findFirst({ where: { id: decoded.id }, include: { role: true } });
  if (!user) return services.response.send({ res, code: 404, error: 'user not found' });
  const employee = (await axios.get(`http://82.29.197.244:8080/employees/${user.employee_id}`)).data.data;
  const data = { employee, role: user.role };
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
