import type { UmiApiRequest, UmiApiResponse } from 'umi';
import bcrypt from 'bcryptjs';
import { omit } from 'lodash';
import prisma from '../client';

export default async function (req: UmiApiRequest, res: UmiApiResponse) {
  try {
    if (req.method === 'GET') {
      const connections = await prisma.connection.findMany({});
      res.status(200).json(connections);
    } else if (req.method === 'POST') {
      const connection = await prisma.connection.create({
        data: {
          ...omit(req.body, 'password'),
          passwordHash: bcrypt.hashSync(req.body?.password, 10),
        },
      });
      res.status(200).json(connection);
    } else {
      res.status(405).json({ errorMessage: 'Method not allowed' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ errorMessage: 'Internal Server Error' });
  }
}
