import type { UmiApiRequest, UmiApiResponse } from 'umi';
import prisma from '../client';

export default async function (req: UmiApiRequest, res: UmiApiResponse) {
  try {
    if (req.method === 'GET') {
      const connection = await prisma.connection.findUnique({
        where: { id: +req.params.connectionId },
      });
      if (connection) {
        res.status(200).json(connection);
      } else {
        res.status(404).json({ errorMessage: 'Connection not found' });
      }
    } else if (req.method === 'PATCH') {
      const connection = await prisma.connection.update({
        where: { id: +req.params.connectionId },
        data: req.body,
      });
      if (connection) {
        res.status(200).json(connection);
      } else {
        res.status(404).json({ errorMessage: 'Connection not found' });
      }
    } else if (req.method === 'DELETE') {
      const connection = await prisma.connection.delete({
        where: { id: +req.params.connectionId },
      });
      if (connection) {
        res.status(200).json(connection);
      } else {
        res.status(404).json({ errorMessage: 'Connection not found' });
      }
    } else {
      res.status(405).json({ errorMessage: 'Method not allowed' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ errorMessage: 'Internal Server Error' });
  }
}
