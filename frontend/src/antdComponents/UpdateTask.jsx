import React, { useState } from "react";
import { Button, Modal, Form, Input, message } from "antd";

const UpdateTask = ({ theme, item, setTasks, setShowOptions }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();

  const showModal = () => {
    form.setFieldsValue(item); // Set initial values to the form
    setIsModalOpen(true);
  };

  const handleOk = () => {
    form.submit();
    setShowOptions(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setShowOptions(false);
  };

  const handleFormSubmit = async (values) => {
    setLoading(true);
    try {
      const newTask = { ...values }; 
    //   console.log(newTask);
    //   console.log(item._id);
      const response = await fetch(`http://localhost:8181/task/update/${item._id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
      });

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      const data = await response.json();

      message.success("Task updated successfully!");
      setTasks(prevTasks => prevTasks.map(task => (task._id === data._id ? data : task))); // Callback to update parent state
      handleCancel(); // Close modal and reset form
      setShowOptions(false); //close options (update, delete)
    } catch (error) {
      console.error("Error updating task:", error);
      message.error("Failed to update task. Please try again.");
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
        Update
      </Button>

      <Modal
        title={`Update Task`}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={loading}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
          initialValues={item} // Set initial values of the form
        >
          <Form.Item
            label="Task Description"
            name="taskDescription"
            rules={[{ required: true, message: "Please enter a task description" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Client"
            name="client"
            rules={[{ required: true, message: "Please enter the client name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Deadline"
            name="taskDeadline"
            rules={[{ required: true, message: "Please enter a deadline" }]}
          >
            <Input type="date" />
          </Form.Item>

          <Form.Item
            label="Task Status"
            name="taskStatus"
            rules={[
              { required: true, message: "Please enter task status" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Task Progress"
            name="taskProgress"
            rules={[
              { required: true, message: "Please enter task status" },
            ]}
          >
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default UpdateTask;
