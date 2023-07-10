import Chart from '@/components/Chart';
import * as InstanceController from '@/services/oda/InstanceController';
import {
  CaretRightOutlined,
  HistoryOutlined,
  PieChartOutlined,
  TableOutlined,
} from '@oceanbase/icons';
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Select,
  Space,
  Spin,
  Table,
} from '@oceanbase/design';
import { sortByMoment, sortByNumber, sortByString } from '@oceanbase/util';
import { useRequest } from 'ahooks';
import { isNaN, isNumber, toNumber, uniqueId } from 'lodash';
import React, { useEffect, useState } from 'react';
import MonacoEditor from 'react-monaco-editor';

interface SqlEditorProps {
  instanceId: number;
  instance: any;
  onSuccess?: () => void;
}

function customeToNumber(value?: string | number) {
  const numberValue = toNumber(value);
  return isNumber(numberValue) && !isNaN(numberValue) ? toNumber(value) : value;
}

const SqlEditor: React.FC<SqlEditorProps> = ({
  instanceId,
  instance,
  onSuccess,
}) => {
  const [text, setText] = useState('');
  const [sql, setSql] = useState('');
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [tabKey, setTabKey] = useState('table');

  const [form] = Form.useForm();
  const { getFieldValue, getFieldsValue, setFieldsValue } = form;

  // 执行 SQL
  const { run: executeText, loading: executeTextLoading } = useRequest(
    InstanceController.executeText,
    {
      manual: true,
      onSuccess: (res) => {
        if (res.success) {
          setSql(res?.data?.sql);
          setDataSource(res?.data?.rows || []);
          if (onSuccess) {
            onSuccess();
          }
        }
      },
    },
  );
  // 执行 SQL
  const { run: executeSql, loading: executeSqlLoading } = useRequest(
    InstanceController.executeSql,
    {
      manual: true,
      onSuccess: (res) => {
        if (res.success) {
          setDataSource(res?.data?.rows || []);
          if (onSuccess) {
            onSuccess();
          }
        }
      },
    },
  );

  const columns = Object.keys(dataSource?.[0] || {}).map((key) => ({
    dataIndex: key,
    title: key,
    sorter: (a, b) =>
      // 数字
      isNumber(a[key]) || isNumber(b[key])
        ? sortByNumber(a, b, key)
        : // 日期时间
        isNumber(Date.parse(a[key])) || isNumber(Date.parse(b[key]))
        ? sortByMoment(a, b, key)
        : sortByString(a, b, key),
  }));

  const executionColumns = [
    {
      dataIndex: 'id',
      title: 'ID',
      width: 120,
    },
    {
      dataIndex: 'database',
      title: 'Database',
    },
    {
      dataIndex: 'text',
      title: 'Text',
      ellipsis: true,
      render: (value: string) => (
        <a
          onClick={() => {
            setText(value);
            executeText(
              {
                instanceId,
              },
              {
                text: value,
              },
            );
          }}
        >
          {value}
        </a>
      ),
    },
    {
      dataIndex: 'sql',
      title: 'SQL',
      ellipsis: true,
      render: (value: string) => (
        <a
          onClick={() => {
            setSql(value);
            executeSql(
              {
                instanceId,
              },
              {
                sql: value,
              },
            );
          }}
        >
          {value}
        </a>
      ),
    },
    {
      dataIndex: 'createTime',
      title: 'Create Time',
    },
  ];

  const updateFields = () => {
    const { chartType } = getFieldsValue();
    setFieldsValue({
      xField:
        // 对于条形图，默认的 x、y 字段正好相反
        chartType === 'Bar' ? columns?.[1]?.dataIndex : columns?.[0]?.dataIndex,
      yField:
        chartType === 'Bar' ? columns?.[0]?.dataIndex : columns?.[1]?.dataIndex,
      // Pie
      angleField: columns?.[1]?.dataIndex,
      colorField: columns?.[0]?.dataIndex,
    });
  };

  useEffect(() => {
    updateFields();
  }, [columns]);

  return (
    <Space
      direction="vertical"
      size={16}
      style={{
        width: '100%',
      }}
    >
      <Card bordered={false}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 16,
          }}
        >
          <Button
            loading={executeSqlLoading}
            disabled={!sql}
            type="primary"
            icon={
              <CaretRightOutlined
                style={{
                  fontSize: 16,
                }}
              />
            }
            onClick={() => {
              executeSql(
                {
                  instanceId,
                },
                {
                  sql,
                  database: 'zhuyue',
                },
              );
            }}
            style={{
              marginRight: 48,
            }}
          >
            执行 SQL
          </Button>
          <Input.Search
            value={text}
            onChange={(e) => {
              setText(e.target.value);
            }}
            enterButton={
              <Button
                loading={executeTextLoading}
                disabled={!text}
                type="primary"
                onClick={() => {
                  executeText(
                    {
                      instanceId,
                    },
                    {
                      text,
                      database: 'zhuyue',
                    },
                  );
                }}
              >
                查询
              </Button>
            }
          />
        </div>
        <MonacoEditor
          width="100%"
          height="120"
          language="sql"
          value={sql}
          options={{
            selectOnLineNumbers: true,
            minimap: {
              enabled: false,
            },
          }}
          onChange={(newSql) => {
            setSql(newSql);
          }}
        />
      </Card>
      <Card
        bordered={false}
        tabList={[
          {
            key: 'table',
            tab: (
              <span>
                <TableOutlined />
                Table
              </span>
            ),
          },
          {
            key: 'chart',
            tab: (
              <span>
                <PieChartOutlined />
                Chart
              </span>
            ),
          },
          {
            key: 'execution',
            tab: (
              <span>
                <HistoryOutlined />
                History
              </span>
            ),
          },
        ]}
        activeTabKey={tabKey}
        onTabChange={(key) => {
          setTabKey(key);
        }}
      >
        {tabKey === 'table' && (
          <Table
            loading={executeSqlLoading || executeTextLoading}
            size="small"
            bordered={true}
            dataSource={dataSource}
            columns={columns}
            rowKey={() => uniqueId()}
            pagination={{
              pageSize: 5,
            }}
          />
        )}
        {tabKey === 'chart' && (
          <div>
            <Form layout="horizontal" form={form}>
              <Row gutter={16}>
                <Col span={6}>
                  <Form.Item
                    label="图表类型"
                    name="chartType"
                    initialValue="Column"
                  >
                    <Select
                      onChange={() => {
                        setTimeout(() => {
                          updateFields();
                        }, 0);
                      }}
                      showSearch={true}
                      optionFilterProp="children"
                    >
                      <Select.Option value="Line">折线图</Select.Option>
                      <Select.Option value="Area">面积图</Select.Option>
                      <Select.Option value="Column">柱状图</Select.Option>
                      <Select.Option value="Bar">条形图</Select.Option>
                      <Select.Option value="Pie">饼图</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Form.Item noStyle shouldUpdate>
                  {() => {
                    return (
                      getFieldValue('chartType') !== 'Pie' && (
                        <Col span={6}>
                          <Form.Item label="xField" name="xField">
                            <Select
                              showSearch={true}
                              optionFilterProp="children"
                            >
                              {columns.map((column) => (
                                <Select.Option
                                  key={column.dataIndex}
                                  value={column.dataIndex}
                                >
                                  {column.title}
                                </Select.Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>
                      )
                    );
                  }}
                </Form.Item>
                <Form.Item noStyle shouldUpdate>
                  {() => {
                    return (
                      getFieldValue('chartType') !== 'Pie' && (
                        <Col span={6}>
                          <Form.Item label="yField" name="yField">
                            <Select
                              showSearch={true}
                              optionFilterProp="children"
                            >
                              {columns.map((column) => (
                                <Select.Option
                                  key={column.dataIndex}
                                  value={column.dataIndex}
                                >
                                  {column.title}
                                </Select.Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>
                      )
                    );
                  }}
                </Form.Item>
                <Form.Item noStyle shouldUpdate>
                  {() => {
                    return (
                      getFieldValue('chartType') !== 'Pie' && (
                        <Col span={6}>
                          <Form.Item label="seriesField" name="seriesField">
                            <Select
                              allowClear={true}
                              showSearch={true}
                              optionFilterProp="children"
                            >
                              {columns.map((column) => (
                                <Select.Option
                                  key={column.dataIndex}
                                  value={column.dataIndex}
                                >
                                  {column.title}
                                </Select.Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>
                      )
                    );
                  }}
                </Form.Item>
                <Form.Item noStyle shouldUpdate>
                  {() => {
                    return (
                      getFieldValue('chartType') === 'Pie' && (
                        <Col span={6}>
                          <Form.Item label="angleField" name="angleField">
                            <Select
                              showSearch={true}
                              optionFilterProp="children"
                            >
                              {columns.map((column) => (
                                <Select.Option
                                  key={column.dataIndex}
                                  value={column.dataIndex}
                                >
                                  {column.title}
                                </Select.Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>
                      )
                    );
                  }}
                </Form.Item>
                <Form.Item noStyle shouldUpdate>
                  {() => {
                    return (
                      getFieldValue('chartType') === 'Pie' && (
                        <Col span={6}>
                          <Form.Item label="colorField" name="colorField">
                            <Select
                              showSearch={true}
                              optionFilterProp="children"
                            >
                              {columns.map((column) => (
                                <Select.Option
                                  key={column.dataIndex}
                                  value={column.dataIndex}
                                >
                                  {column.title}
                                </Select.Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>
                      )
                    );
                  }}
                </Form.Item>
              </Row>
              <Form.Item noStyle shouldUpdate>
                {() => {
                  const {
                    chartType,
                    xField,
                    yField,
                    seriesField,
                    // Pie
                    angleField,
                    colorField,
                  } = getFieldsValue();
                  const data = dataSource.map((item) => {
                    return {
                      ...item,
                      ...(chartType === 'Pie'
                        ? {
                            [angleField]: customeToNumber(item[angleField]),
                          }
                        : {
                            [xField]: customeToNumber(item[xField]),
                            [yField]: customeToNumber(item[yField]),
                          }),
                    };
                  });
                  return (
                    <Spin spinning={executeSqlLoading || executeTextLoading}>
                      <Chart
                        height={260}
                        animation={false}
                        type={chartType}
                        data={data}
                        {...(chartType === 'Pie'
                          ? {
                              // angleField 为空时会导致饼图崩溃，需要使用空字符串进行兜底
                              angleField: angleField || '',
                              colorField,
                            }
                          : {
                              xField,
                              yField,
                              seriesField,
                              isGroup: seriesField ? true : false,
                            })}
                      />
                    </Spin>
                  );
                }}
              </Form.Item>
            </Form>
          </div>
        )}
        {tabKey === 'execution' && (
          <Table
            size="small"
            bordered={true}
            dataSource={instance.executions}
            columns={executionColumns}
            rowKey={(record) => record.id}
            pagination={{
              pageSize: 5,
            }}
          />
        )}
      </Card>
    </Space>
  );
};

export default SqlEditor;
