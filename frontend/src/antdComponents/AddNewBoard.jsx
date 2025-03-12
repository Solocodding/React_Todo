import {useState} from "react";
import {Button, Modal, Form, Input, message} from "antd";
function AddNewBoard({theme, setTaskBoards}) {

    const [isModalOpen, setIsModalOpen] = useState(false);
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
        // console.log(values);
        try {
            const response = await fetch(`${BASE_URL}/view/add`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            });

            if (response.ok) {
                const data = await response.json();
                message.success("View added successfully!");
                setIsModalOpen(false);
                form.resetFields();
                setTaskBoards(prevBoards => [...prevBoards, values.viewName]);
            } else {
                message.error("Failed to add view. Please try again.");
            }
        } catch (error) {
            console.error("Error adding view:", error);
            message.error("Failed to add view. Please try again."); 
        }
    };

    return (
        <>
            <Button
                type="primary"
                onClick={showModal}
                style={{
                    backgroundColor: theme === "dark" ? "#434343" : "#f0f2f5",
                    color: theme === "dark" ? "#f0f2f5" : "#434343",
                    border: "none",
                    margin: "5px",
                }}
            >
                <p                 
                  className={`flex items-center justify-center w-[28px] h-[28px] rounded-full ${theme === "dark" ? "bg-[rgba(255,255,255,0.1)]" : "bg-[rgba(232,170,170,0.16)]"
                }`}
                >
                          +
                </p>
                Add view
            </Button>
            <Modal
                title="Add New Board"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="Add"
                cancelText="Cancel"
            >
                <Form form={form} onFinish={handleFormSubmit} layout="vertical">    
                    <Form.Item
                        label="View Name"
                        name="viewName"
                        rules={[{required: true, message: "Please enter a view name"}]}
                    >
                        <Input placeholder="View Name" />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}

export default AddNewBoard;