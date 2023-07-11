import { request } from 'umi';
import type { Prisma } from '@prisma/client';

export async function listConnections(params, options?: Record<string, any>) {
  return request('/api/connections', {
    method: 'GET',
    params,
    ...(options || {}),
  });
}

export async function createConnection(
  body: Prisma.ConnectionCreateInput,
  options?: Record<string, any>,
) {
  return request('/api/connections', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function getConnection(
  params: {
    connectionId: number;
  },
  options?: Record<string, any>,
) {
  const { connectionId, ...queryParams } = params;
  return request(`/api/connections/${connectionId}`, {
    method: 'GET',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

export async function updateConnection(
  params: {
    connectionId: number;
  },
  body: Prisma.ConnectionUpdateInput,
  options?: Record<string, any>,
) {
  const { connectionId, ...queryParams } = params;
  return request(`/api/connections/${connectionId}`, {
    method: 'PATCH',
    params: {
      ...queryParams,
    },
    data: body,
    ...(options || {}),
  });
}

export async function deleteConnection(
  params: {
    connectionId: number;
  },
  options?: Record<string, any>,
) {
  const { connectionId, ...queryParams } = params;
  return request(`/api/v1/connections/${connectionId}`, {
    method: 'DELETE',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

export async function executeSql(
  params: {
    connectionId: number;
  },
  body: {
    sql: string;
  },
  options?: Record<string, any>,
) {
  const { connectionId, ...queryParams } = params;
  return request(`/api/connections/${connectionId}/executeSql`, {
    method: 'POST',
    params: {
      ...queryParams,
    },
    data: body,
    ...(options || {}),
  });
}

export async function executeText(
  params: {
    connectionId: number;
  },
  body: {
    text: string;
  },
  options?: Record<string, any>,
) {
  const { connectionId, ...queryParams } = params;
  return request(`/api/connections/${connectionId}/executeText`, {
    method: 'POST',
    params: {
      ...queryParams,
    },
    data: body,
    ...(options || {}),
  });
}
