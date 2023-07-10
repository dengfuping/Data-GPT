import useDocumentTitle from '@/hooks/useDocumentTitle';
import * as InstanceController from '@/services/oda/InstanceController';
import {
  DatabaseOutlined,
  FieldBinaryOutlined,
  FieldNumberOutlined,
  FieldStringOutlined,
  FieldTimeOutlined,
  TableOutlined,
} from '@ant-design/icons';
import { Card, Col, Input, Row, Tree } from '@oceanbase/design';
import { PageContainer } from '@oceanbase/ui';
import { useRequest } from 'ahooks';
import type { DataNode } from '@oceanbase/design/es/tree';
import { toLower } from 'lodash';
import React, { useState } from 'react';
import { history } from 'umi';
import SqlEditor from './SqlEditor';

interface InstanceProps {
  match: {
    params: {
      instanceId: number;
    };
  };
}

const Instance: React.FC<InstanceProps> = ({
  match: {
    params: { instanceId },
  },
}) => {
  useDocumentTitle('实例详情');

  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState(false);

  // 获取实例详情
  const { data: instanceData, refresh: getInstanceRefresh } = useRequest(
    InstanceController.getInstance,
    {
      defaultParams: [
        {
          instanceId,
        },
      ],
      onSuccess: (res) => {
        if (res.success) {
          const databaseNames =
            res.data?.databases?.map((item) => item.name) || [];
          setExpandedKeys(databaseNames);
        }
      },
    },
  );
  const instance = instanceData?.data || {};

  const dataTypeIconList = [
    {
      dataTypes: [
        'tinyint',
        'smallint',
        'mediumint',
        'int',
        'bigint',
        'float',
        'double',
        'double precision',
        'real',
        'decimal',
        'bit',
        'serial',
        'bool',
        'boolean',
        'dec',
        'fixed',
        'numeric',
      ],
      icon: <FieldNumberOutlined />,
    },
    {
      dataTypes: [
        'char',
        'varchar',
        'tinytext',
        'mediumtext',
        'text',
        'longtext',
        'enum',
        'set',
      ],
      icon: <FieldStringOutlined />,
    },
    {
      dataTypes: [
        'tinyblob',
        'mediumblob',
        'blob',
        'longblob',
        'binary',
        'varbinary',
      ],
      icon: <FieldBinaryOutlined />,
    },
    {
      dataTypes: ['date', 'datetime', 'timestamp', 'year', 'time'],
      icon: <FieldTimeOutlined />,
    },
  ];

  const treeData =
    instance.databases?.map((database) => ({
      key: database.name,
      title: database.name,
      icon: <DatabaseOutlined />,
      children:
        database.tables?.map((table) => ({
          key: `${database.name}-${table.name}`,
          title: table.name,
          icon: <TableOutlined />,
          children: table.columns?.map((column) => ({
            key: `${database.name}-${table.name}-${column.name}`,
            title: column.name,
            icon: dataTypeIconList.find((item) =>
              item.dataTypes.includes(toLower(column.dataType)),
            )?.icon,
          })),
        })) || [],
    })) || [];

  const dataList: { key: React.Key; title: string }[] = [];
  const generateList = (data: DataNode[]) => {
    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      const { key } = node;
      dataList.push({ key, title: key as string });
      if (node.children) {
        generateList(node.children);
      }
    }
  };
  generateList(treeData);

  const getParentKey = (key: React.Key, tree: DataNode[]): React.Key => {
    let parentKey: React.Key;
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node.children) {
        if (node.children.some((item) => item.key === key)) {
          parentKey = node.key;
        } else if (getParentKey(key, node.children)) {
          parentKey = getParentKey(key, node.children);
        }
      }
    }
    return parentKey!;
  };

  return (
    <PageContainer
      header={{
        title: instance.name,
        onBack: () => {
          history.goBack();
        },
        breadcrumb: {
          items: [
            {
              title: '实例列表',
              path: '/instance',
            },
            {
              title: '实例详情',
            },
          ],
        },
      }}
    >
      <Row gutter={16}>
        <Col span={6}>
          <Card
            bordered={false}
            style={{
              minHeight: 'calc(100vh - 148px - 24px)',
            }}
          >
            <Input.Search
              size="middle"
              allowClear={true}
              style={{ marginBottom: 8 }}
              placeholder="Search"
              onChange={(e) => {
                const searchValue = e.target.value;
                const newExpandedKeys = dataList
                  .map((item) => {
                    if (item.title?.includes(searchValue)) {
                      return getParentKey(item.key, treeData);
                    }
                    return null;
                  })
                  .filter((item, i, self) => item && self.indexOf(item) === i);
                setExpandedKeys(newExpandedKeys as React.Key[]);
                setAutoExpandParent(true);
              }}
            />
            <Tree.DirectoryTree
              showIcon={true}
              defaultExpandParent={true}
              onExpand={(newExpandKeys) => {
                setExpandedKeys(newExpandKeys);
                setAutoExpandParent(false);
              }}
              expandedKeys={expandedKeys}
              autoExpandParent={autoExpandParent}
              treeData={treeData}
            />
          </Card>
        </Col>
        <Col span={18}>
          <SqlEditor
            instanceId={instanceId}
            instance={instance}
            onSuccess={() => {
              getInstanceRefresh();
            }}
          />
        </Col>
      </Row>
    </PageContainer>
  );
};

export default Instance;
