import React, { useState } from "react";
import { Button, Modal, Form, Input, message } from "antd";

const TodoDialog = ({ theme, status, onTodoAdded }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const BASE_URL = import.meta.env.VITE_REACT_APP_BASE_URL;

  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    form.submit();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleFormSubmit = async (values) => {
    setLoading(true);
    try {
      const newTask = { ...values, taskStatus: status }; 
      // console.log(newTask);
      const response = await fetch(`${BASE_URL}/task/add`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
      });
      // console.log(response);
      if (!response.ok) {
        throw new Error("Failed to create task");
      }

      // console.log(response);
      const data = await response.json();

      message.success("Task created successfully!");
      onTodoAdded(data); // Callback to update parent state
      handleCancel(); // Close modal and reset form
    } catch (error) {
      console.error("Error creating todo:", error);
      message.error("Failed to create task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        type="primary"
        onClick={showModal}
        style={{
          background: theme === "light" ? "#F2F2F2" : "#2A2B2F",
          color: theme === "light" ? "#2A2B2F" : "#F2F2F2",
        }}
      >
        Add new task
      </Button>

      <Modal
        title={`Add New Task to "${status}"`}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
          <Form.Item
            label="Task Description"
            name="taskDescription"
            rules={[{ required: true, message: "Please enter a task description" }]}
          >
            <Input placeholder="Enter task description" />
          </Form.Item>

          <Form.Item
            label="Client"
            name="client"
            rules={[{ required: true, message: "Please enter the client name" }]}
          >
            <Input placeholder="Enter client name" />
          </Form.Item>

          <Form.Item
            label="Deadline"
            name="taskDeadline"
            rules={[{ required: true, message: "Please enter a deadline" }]}
          >
            <Input type="date" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default TodoDialog;
