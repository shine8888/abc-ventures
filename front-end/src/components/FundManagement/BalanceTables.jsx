import React, { useState, useRef, useContext, useEffect } from 'react';

import { Table, Button, Form, Input, message } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import UserService from '../../services/user.service';

import './BalanceTables.styles.scss';

const EditableContext = React.createContext(null);

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);

  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

const BalanceTables = () => {
  const [datasource, setDataSource] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const data = await UserService.getListFunds();
      const mappingKeyForData = data.data.map((e, index) => {
        return { ...e, key: index };
      });
      setDataSource(mappingKeyForData);
    };
    getData();
  }, []);

  const handleDelete = (itemKey) => {
    const newDatasource = datasource.filter(({ key }) => key !== itemKey);

    setDataSource(newDatasource);
  };

  const handleAddNewFund = () => {
    const newData = {
      key: Date.now(),
      name: 'New Fund',
      investmentBalance: 0,
      description: 'description',
      isVentureFunds: true,
    };

    setDataSource([...datasource, newData]);
  };

  const handleSave = (row) => {
    const newData = [...datasource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    setDataSource(newData);
  };

  const updateListFunds = async () => {
    const result = await UserService.updateListFunds({ listFunds: datasource });

    if (result.status === 200 || result.status === 201) {
      message.success('Update list funds success ');
    }
  };

  const defaultColumns = [
    {
      title: 'Fund Name',
      dataIndex: 'name',
      key: 'name',
      editable: true,
    },
    {
      title: 'Investment Balance',
      dataIndex: 'investmentBalance',
      key: 'investmentBalance',
      editable: true,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      editable: true,
    },
    {
      title: '',
      dataIndex: 'operation',
      render: (_, record) => (
        <DeleteOutlined onClick={() => handleDelete(record.key)} />
      ),
    },
  ];

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  return (
    <div>
      <Table
        components={components}
        columns={columns}
        dataSource={datasource}
        scroll={{ y: 800 }}
      />
      <div className="buttons-container">
        <Button type="primary" onClick={handleAddNewFund}>
          Add new fund
        </Button>
        <Button type="primary" onClick={updateListFunds}>
          Save
        </Button>
      </div>
    </div>
  );
};

export default BalanceTables;
