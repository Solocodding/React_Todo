import React,{useState} from "react";
import { Button, Modal, Form, Input, message } from "antd";
export default function DeleteTaskBoard({theme, setTaskBoards, setShowOptions}){
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk =() =>{
        form.submit();  
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    };
    const handleFormSubmit = async (values) => {
        // console.log(values);
        setLoading(true);
        try {
            const TaskBoardToDelete = { ...values};
            // console.log(TaskBoardToDelete.viewName);
            const response = await fetch(`http://localhost:8181/view/delete/${TaskBoardToDelete.viewName}`,{
                method: "DELETE",
                credentials: "include",
            });
            const data = await response.json();
            if(!response.ok){
                message.error(data.message);
                return;
            }    

            message.success("Task board updated successfully!");
            setTaskBoards(prevBoards => prevBoards.filter(board => board !== TaskBoardToDelete.viewName)); // Callback to update parent state
            handleCancel(); // Close modal and reset form
            setShowOptions(false); //close options (update, delete)
        } catch (error) {
            console.error("Error updating task board:", error); 
            message.error("Failed to update task board. Please try again.");
        } finally {
            setLoading(false);      
        }    
    };
    
    return(
        <>
            <Button 
                type="primary" 
                onClick={showModal}
                style={{
                    background: theme === "light" ? "#F2F2F2" : "#2A2B2F",
                    color: "#FB2C36",
                }}
            >
                Delete
            </Button>

            <Modal
                title="Delete Task Board"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                confirmLoading={loading}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleFormSubmit}
                >
                    <Form.Item
                        label="Task Board Name to delete"
                        name="viewName"
                        rules={[
                            {
                                required: true,
                                message: "Please enter task board name",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}