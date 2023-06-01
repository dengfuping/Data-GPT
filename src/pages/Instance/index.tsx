import useDocumentTitle from '@/hooks/useDocumentTitle';
import * as InstanceController from '@/services/oda/InstanceController';
import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  PageContainer,
  Space,
  Table,
} from '@oceanbase/design';
import { useRequest } from 'ahooks';
import React, { useState } from 'react';
import { history } from 'umi';

interface InstanceProps {}

const Instance: React.FC<InstanceProps> = () => {
  useDocumentTitle('实例列表');

  const [form] = Form.useForm();
  const { validateFields } = form;
  const [open, setOpen] = useState(false);
  const [instance, setInstance] = useState();

  // 获取实例列表
  const {
    data: instanceListData,
    refresh: listInstancesRefresh,
    loading: instanceListLoading,
  } = useRequest(InstanceController.listInstances, {
    defaultParams: [{}],
  });
  const instanceList = instanceListData?.data?.list || [];

  // 新建实例
  const { run: createInstance, loading: createLoading } = useRequest(
    InstanceController.createInstance,
    {
      manual: true,
      onSuccess: (res) => {
        if (res.success) {
          message.success('实例新建成功');
          setOpen(false);
          listInstancesRefresh();
        }
      },
    },
  );

  // 编辑实例
  const { run: updateInstance, loading: updateLoading } = useRequest(
    InstanceController.updateInstance,
    {
      manual: true,
      onSuccess: (res) => {
        if (res.success) {
          message.success('实例编辑成功');
          setOpen(false);
          listInstancesRefresh();
        }
      },
    },
  );

  // 删除实例
  const { runAsync: deleteInstance } = useRequest(
    InstanceController.deleteInstance,
    {
      manual: true,
      onSuccess: (res) => {
        if (res.success) {
          message.success('实例删除成功');
          listInstancesRefresh();
        }
      },
    },
  );

  const columns = [
    {
      dataIndex: 'name',
      title: '实例名称',
      render: (text: string, record) => (
        <a
          onClick={() => {
            history.push(`/instance/${record.id}`);
          }}
        >
          {text}
        </a>
      ),
    },
    {
      dataIndex: 'id',
      title: '实例 ID',
    },
    {
      dataIndex: 'host',
      title: '实例地址',
    },
    {
      dataIndex: 'port',
      title: '实例端口',
    },
    {
      dataIndex: 'user',
      title: '实例用户',
    },
    {
      dataIndex: 'operation',
      title: '操作',
      render: (text: string, record) => (
        <Space>
          <a
            onClick={() => {
              setInstance(record);
              setOpen(true);
            }}
          >
            编辑
          </a>
          <a
            onClick={() => {
              Modal.confirm({
                title: `确定删除实例 ${record.name} 吗？`,
                onOk: () => {
                  return deleteInstance({ instanceId: record.id });
                },
              });
            }}
          >
            删除
          </a>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer
      header={{
        title: '实例',
        extra: (
          <Space>
            <Button
              type="primary"
              onClick={() => {
                setOpen(true);
              }}
            >
              新建实例
            </Button>
          </Space>
        ),
      }}
    >
      <Card bordered={false}>
        <Table
          loading={instanceListLoading}
          columns={columns}
          dataSource={instanceList}
          rowKey={(record) => record.id}
        />
      </Card>
      <Modal
        title={instance ? `编辑实例 ${instance.name}` : '添加实例'}
        open={open}
        onCancel={() => {
          setOpen(false);
          setInstance(undefined);
        }}
        onOk={() => {
          validateFields().then((values) => {
            if (instance) {
              updateInstance(
                {
                  instanceId: instance.id,
                },
                values,
              );
            } else {
              createInstance(values);
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
            label="实例名"
            name="name"
            initialValue={instance?.name}
            rules={[
              {
                required: true,
                message: '请输入实例名',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="连接地址"
            name="host"
            initialValue={instance?.host}
            rules={[
              {
                required: true,
                message: '请输入连接地址',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="端口"
            name="port"
            initialValue={instance?.port || 2883}
            rules={[
              {
                required: true,
                message: '请输入端口',
              },
            ]}
          >
            <InputNumber />
          </Form.Item>
          <Form.Item
            label="用户名"
            name="user"
            initialValue={instance?.user}
            rules={[
              {
                required: true,
                message: '请输入用户名',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="密码"
            name="password"
            initialValue={instance?.password}
            rules={[
              {
                required: true,
                message: '请输入密码',
              },
            ]}
          >
            <Input.Password
              visibilityToggle={true}
              autoComplete="new-password"
            />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default Instance;
