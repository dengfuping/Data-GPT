import { request } from 'umi';

export async function listInstances(params, options?: Record<string, any>) {
  return request('/api/v1/instances', {
    method: 'GET',
    params,
    ...(options || {}),
  });
}

export async function createInstance(body, options?: Record<string, any>) {
  return request('/api/v1/instances', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function getInstance(
  params: {
    instanceId: number;
  },
  options?: Record<string, any>,
) {
  const { instanceId, ...queryParams } = params;
  return request(`/api/v1/instances/${instanceId}`, {
    method: 'GET',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

export async function updateInstance(
  params: {
    instanceId: number;
  },
  body,
  options?: Record<string, any>,
) {
  const { instanceId, ...queryParams } = params;
  return request(`/api/v1/instances/${instanceId}`, {
    method: 'PATCH',
    params: {
      ...queryParams,
    },
    data: body,
    ...(options || {}),
  });
}

export async function deleteInstance(
  params: {
    instanceId: number;
  },
  options?: Record<string, any>,
) {
  const { instanceId, ...queryParams } = params;
  return request(`/api/v1/instances/${instanceId}`, {
    method: 'DELETE',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

export async function executeSql(
  params: {
    instanceId: number;
  },
  body: {
    sql: string;
    database?: string;
  },
  options?: Record<string, any>,
) {
  const { instanceId, ...queryParams } = params;
  return request(`/api/v1/instances/${instanceId}/executeSql`, {
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
    instanceId: number;
  },
  body: {
    text: string;
    database?: string;
  },
  options?: Record<string, any>,
) {
  const { instanceId, ...queryParams } = params;
  return request(`/api/v1/instances/${instanceId}/executeText`, {
    method: 'POST',
    params: {
      ...queryParams,
    },
    data: body,
    ...(options || {}),
  });
}
