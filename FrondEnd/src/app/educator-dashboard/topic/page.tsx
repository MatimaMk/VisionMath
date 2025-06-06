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
  Popconfirm,
  message,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

import { ColumnsType } from "antd/es/table";
import { difficultLevel } from "@/enums/difficultLevel";
import styles from "./styles/topicsManagement.module.css";

import { useTopicActions, useTopicState } from "@/provider/topic-Provider";
import { ITopic } from "@/provider/topic-Provider/context";

const { Option } = Select;
const { TextArea } = Input;

const TopicsManagement: React.FC = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTopic, setEditingTopic] = useState<ITopic | null>(null);
  const [searchText, setSearchText] = useState("");

  const { isPending, isSuccess, isError, topics } = useTopicState();
  const { getAllTopics, createTopic, updateTopic, deleteTopic } =
    useTopicActions();

  useEffect(() => {
    getAllTopics();
  }, []);

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

  // Filter the topics based on search text manually instead of relying on Table's built-in filtering
  const filteredTopics = React.useMemo(() => {
    // Ensure topics is an array before attempting to filter
    const topicsArray = Array.isArray(topics) ? topics : [];

    if (!searchText || topicsArray.length === 0) {
      return topicsArray;
    }

    return topicsArray.filter(
      (topic) =>
        topic &&
        topic.topicTittle &&
        topic.topicTittle.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [topics, searchText]);

  const columns: ColumnsType<ITopic> = [
    {
      title: "Title",
      dataIndex: "topicTittle",
      key: "topicTittle",
      // Remove the filteredValue and onFilter properties
      sorter: (a, b) =>
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
      render: (time: number) => (time ? `${time}` : "-"),
      sorter: (a, b) => {
        if (a.estimatedTime === undefined || a.estimatedTime === null)
          return -1;
        if (b.estimatedTime === undefined || b.estimatedTime === null) return 1;
        return a.estimatedTime - b.estimatedTime;
      },
    },
    {
      title: "Difficulty Level",
      dataIndex: "difficultLevel",
      key: "difficultLevel",
      render: (level: difficultLevel) => {
        const levelMap: Record<difficultLevel, string> = {
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
      onFilter: (value, record) => record.difficultLevel === value,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
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

  const showCreateModal = () => {
    form.resetFields();
    setEditingTopic(null);
    setIsModalVisible(true);
  };

  const handleEdit = (topic: ITopic) => {
    setEditingTopic(topic);
    form.setFieldsValue({
      topicTittle: topic.topicTittle,
      description: topic.description,
      estimatedTime: topic.estimatedTime, // Now expecting a number
      difficultLevel: topic.difficultLevel,
    });
    setIsModalVisible(true);
  };

  const handleDelete = (topic: ITopic) => {
    if (topic.id) {
      deleteTopic(topic.id);
    }
  };

  const handleFormSubmit = () => {
    form.validateFields().then((values) => {
      const topicData: ITopic = {
        ...values,
        // No conversion needed for estimatedTime as it's already a number
      };

      if (editingTopic && editingTopic.id) {
        updateTopic({ ...topicData, id: editingTopic.id });
      } else {
        createTopic(topicData);
      }
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingTopic(null);
  };

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
        dataSource={filteredTopics} // Use the filtered topics
        rowKey={(record) =>
          record?.id || Math.random().toString(36).substr(2, 9)
        } // Ensure valid row keys
        loading={isPending}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50"],
        }}
        className={styles.topicsTable}
        // expandable={false} // Completely disable expandable functionality
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
            label="Estimated Time (hours)"
            rules={[
              { required: true, message: "Please enter the estimated time" },
              {
                type: "number",
                min: 0,
                message: "Time must be a positive number",
              },
            ]}
          >
            <Input
              type="number"
              placeholder="Enter estimated time in hours"
              suffix="hours"
              min={0}
              step={0.5}
              className={styles.timeInput}
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
