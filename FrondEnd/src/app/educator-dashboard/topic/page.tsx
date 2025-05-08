"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Select,
  DatePicker,
  Popconfirm,
  message,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

import { difficultLevel } from "@/enums/difficultLevel";
import styles from "./styles/topicsManagement.module.css";
import dayjs from "dayjs";
import { useTopicActions, useTopicState } from "@/provider/topic-Provider";
import { ITopic } from "@/provider/topic-Provider/context";

const { Option } = Select;
const { TextArea } = Input;

const TopicsManagement: React.FC = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTopic, setEditingTopic] = useState<ITopic | null>(null);
  const [searchText, setSearchText] = useState("");

  // Access topics state and actions
  const { isPending, isSuccess, isError, topics } = useTopicState();
  const { getAllTopics, createTopic, updateTopic, deleteTopic } =
    useTopicActions();

  // Load topics when component mounts
  useEffect(() => {
    getAllTopics();
  }, []);

  // Handle success and error states
  useEffect(() => {
    if (isSuccess && !isPending) {
      message.success(
        editingTopic
          ? "Topic updated successfully!"
          : "Operation completed successfully!"
      );
      if (isModalVisible) {
        setIsModalVisible(false);
        form.resetFields();
        setEditingTopic(null);
      }
    }

    if (isError && !isPending) {
      message.error("An error occurred. Please try again.");
    }
  }, [isPending, isSuccess, isError]);

  // Table columns definition
  const columns = [
    {
      title: "Title",
      dataIndex: "topicTittle",
      key: "topicTittle",
      filteredValue: searchText ? [searchText] : null,
      onFilter: (value: string | number | symbol, record: ITopic) =>
        record.topicTittle
          ?.toLowerCase()
          .includes(String(value).toLowerCase()) || false,
      sorter: (a: ITopic, b: ITopic) =>
        (a.topicTittle || "").localeCompare(b.topicTittle || ""),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Estimated Time",
      dataIndex: "estimatedTime",
      key: "estimatedTime",
      render: (estimatedTime: Date) =>
        estimatedTime ? dayjs(estimatedTime).format("YYYY-MM-DD HH:mm") : "-",
      sorter: (a: ITopic, b: ITopic) => {
        if (!a.estimatedTime) return -1;
        if (!b.estimatedTime) return 1;
        return (
          new Date(a.estimatedTime).getTime() -
          new Date(b.estimatedTime).getTime()
        );
      },
    },
    {
      title: "Difficulty Level",
      dataIndex: "difficultLevel",
      key: "difficultLevel",
      render: (level: difficultLevel) => {
        const levelMap = {
          [difficultLevel.Easy]: "Easy",
          [difficultLevel.Medium]: "Medium",
          [difficultLevel.Difficult]: "Hard",
        };
        return levelMap[level] || "-";
      },
      filters: [
        { text: "Easy", value: difficultLevel.Easy },
        { text: "Medium", value: difficultLevel.Medium },
        { text: "Hard", value: difficultLevel.Difficult },
      ],
      onFilter: (value: number, record: ITopic) =>
        record.difficultLevel === value,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: ITopic) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            className={styles.editButton}
          />
          <Popconfirm
            title="Are you sure you want to delete this topic?"
            onConfirm={() => handleDelete(record)}
            okText="Yes"
            cancelText="No"
            icon={<ExclamationCircleOutlined style={{ color: "red" }} />}
          >
            <Button
              danger
              icon={<DeleteOutlined />}
              className={styles.deleteButton}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Handle opening modal for creating a new topic
  const showCreateModal = () => {
    form.resetFields();
    setEditingTopic(null);
    setIsModalVisible(true);
  };

  // Handle editing a topic
  const handleEdit = (topic: ITopic) => {
    setEditingTopic(topic);
    form.setFieldsValue({
      topicTittle: topic.topicTittle,
      description: topic.description,
      estimatedTime: topic.estimatedTime ? dayjs(topic.estimatedTime) : null,
      difficultLevel: topic.difficultLevel,
    });
    setIsModalVisible(true);
  };

  // Handle deleting a topic
  const handleDelete = (topic: ITopic) => {
    if (topic.id) {
      deleteTopic(topic.id);
    }
  };

  // Handle form submission
  const handleFormSubmit = () => {
    form.validateFields().then((values) => {
      const topicData: ITopic = {
        ...values,
        estimatedTime: values.estimatedTime
          ? values.estimatedTime.toDate()
          : undefined,
      };

      if (editingTopic && editingTopic.id) {
        updateTopic({ ...topicData, id: editingTopic.id });
      } else {
        createTopic(topicData);
      }
    });
  };

  // Handle modal closing
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingTopic(null);
  };

  // Handle search input change
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  return (
    <div className={styles.topicsContainer}>
      <div className={styles.topicsHeader}>
        <h1 className={styles.topicsTitle}>Topics Management</h1>
        <div className={styles.topicsActions}>
          <Input
            placeholder="Search topics..."
            value={searchText}
            onChange={handleSearch}
            className={styles.searchInput}
            allowClear
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={showCreateModal}
            className={styles.addButton}
          >
            Add Topic
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={topics || []}
        rowKey="id"
        loading={isPending}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50"],
        }}
        className={styles.topicsTable}
      />

      <Modal
        title={editingTopic ? "Edit Topic" : "Create New Topic"}
        open={isModalVisible}
        onOk={handleFormSubmit}
        onCancel={handleCancel}
        confirmLoading={isPending}
        okText={editingTopic ? "Update" : "Create"}
        width={700}
        maskClosable={false}
      >
        <Form form={form} layout="vertical" className={styles.topicForm}>
          <Form.Item
            name="topicTittle"
            label="Topic Title"
            rules={[{ required: true, message: "Please enter a title" }]}
          >
            <Input placeholder="Enter topic title" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please enter a description" }]}
          >
            <TextArea
              placeholder="Enter topic description"
              rows={4}
              showCount
              maxLength={500}
            />
          </Form.Item>

          <Form.Item
            name="estimatedTime"
            label="Estimated Time"
            rules={[
              { required: true, message: "Please select an estimated time" },
            ]}
          >
            <DatePicker
              showTime
              format="YYYY-MM-DD HH:mm"
              placeholder="Select date and time"
              className={styles.datePicker}
            />
          </Form.Item>

          <Form.Item
            name="difficultLevel"
            label="Difficulty Level"
            rules={[
              { required: true, message: "Please select a difficulty level" },
            ]}
          >
            <Select placeholder="Select difficulty level">
              <Option value={difficultLevel.Easy}>Easy</Option>
              <Option value={difficultLevel.Medium}>Medium</Option>
              <Option value={difficultLevel.Difficult}>Hard</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TopicsManagement;
