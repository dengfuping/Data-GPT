import useDocumentTitle from '@/hooks/useDocumentTitle';
import * as ConnectionController from '@/services/ConnectionController';
import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Space,
  Table,
} from '@oceanbase/design';
import { PageContainer } from '@oceanbase/ui';
import type { Connection } from '@prisma/client';
import { useRequest } from 'ahooks';
import React, { useState } from 'react';
import { history } from 'umi';

interface IndexProps {}

const Index: React.FC<IndexProps> = () => {
  useDocumentTitle('Connection List');

  const [form] = Form.useForm();
  const { validateFields } = form;
  const [open, setOpen] = useState(false);
  const [connection, setConnection] = useState<Connection>();

  const {
    data: connectionList,
    refresh: listConnectionsRefresh,
    loading: connectionListLoading,
  } = useRequest(ConnectionController.listConnections, {
    defaultParams: [{}],
  });

  const { run: createConnection, loading: createLoading } = useRequest(
    ConnectionController.createConnection,
    {
      manual: true,
      onSuccess: () => {
        message.success('Connection created success');
        setOpen(false);
        listConnectionsRefresh();
      },
    },
  );

  const { run: updateConnection, loading: updateLoading } = useRequest(
    ConnectionController.updateConnection,
    {
      manual: true,
      onSuccess: () => {
        message.success('Connection updated success');
        setOpen(false);
        listConnectionsRefresh();
      },
    },
  );

  const { runAsync: deleteConnection } = useRequest(
    ConnectionController.deleteConnection,
    {
      manual: true,
      onSuccess: () => {
        message.success('Connection deleted success');
        listConnectionsRefresh();
      },
    },
  );

  const columns = [
    {
      dataIndex: 'name',
      title: 'Name',
      render: (text: string, record: Connection) => (
        <a
          onClick={() => {
            history.push(`/connection/${record.id}`);
          }}
        >
          {text}
        </a>
      ),
    },
    {
      dataIndex: 'id',
      title: 'ID',
    },
    {
      dataIndex: 'host',
      title: 'Host',
    },
    {
      dataIndex: 'port',
      title: 'Port',
    },
    {
      dataIndex: 'user',
      title: 'User',
    },
    {
      dataIndex: 'operation',
      title: 'Operation',
      render: (text: string, record: Connection) => (
        <Space size={16}>
          <a
            onClick={() => {
              setConnection(record);
              setOpen(true);
            }}
          >
            Update
          </a>
          <a
            onClick={() => {
              Modal.confirm({
                title: `Are you sure to delete ${record.name}?`,
                onOk: () => {
                  return deleteConnection({ connectionId: record.id });
                },
              });
            }}
          >
            Delete
          </a>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer
      header={{
        title: 'Connection',
        extra: (
          <Space>
            <Button
              type="primary"
              onClick={() => {
                setOpen(true);
              }}
            >
              Create Connection
            </Button>
          </Space>
        ),
      }}
    >
      <Card bordered={false}>
        <Table
          loading={connectionListLoading}
          columns={columns}
          dataSource={connectionList}
          rowKey={(record) => record.id}
        />
      </Card>
      <Modal
        title={connection ? `Update ${connection.name}` : 'Create Connection'}
        open={open}
        onCancel={() => {
          setOpen(false);
          setConnection(undefined);
        }}
        onOk={() => {
          validateFields().then((values) => {
            if (connection) {
              updateConnection(
                {
                  connectionId: connection.id,
                },
                values,
              );
            } else {
              createConnection(values);
            }
          });
        }}
        confirmLoading={createLoading || updateLoading}
      >
        <Form
          layout="vertical"
          form={form}
          preserve={false}
          requiredMark="optional"
        >
          <Form.Item
            label="Name"
            name="name"
            initialValue={connection?.name}
            rules={[
              {
                required: true,
                message: 'Please enter name',
              },
            ]}
          >
            <Input placeholder="Name" />
          </Form.Item>
          <Form.Item
            label="Host"
            name="host"
            initialValue={connection?.host}
            rules={[
              {
                required: true,
                message: 'Please enter host',
              },
            ]}
          >
            <Input placeholder="Host" />
          </Form.Item>
          <Form.Item
            label="Port"
            name="port"
            initialValue={connection?.port || 2883}
            rules={[
              {
                required: true,
                message: 'Please enter port',
              },
            ]}
          >
            <InputNumber placeholder="Port" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            label="User"
            name="user"
            initialValue={connection?.user}
            rules={[
              {
                required: true,
                message: 'Please enter user',
              },
            ]}
          >
            <Input placeholder="User" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            initialValue={connection?.password}
          >
            <Input.Password
              visibilityToggle={true}
              autoComplete="new-password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item
            label="Database"
            name="database"
            initialValue={connection?.database}
            rules={[
              {
                required: true,
                message: 'Please enter user',
              },
            ]}
          >
            <Input placeholder="Database" />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default Index;
