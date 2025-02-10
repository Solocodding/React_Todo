import React,{useState} from "react";
import { Button, Modal, Form, Input, message } from "antd";
export default function Sharewith({theme, item, setShowOptions}){
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk =() =>{
        form.submit();  
        setShowOptions(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
        setShowOptions(false);
    };
    const handleFormSubmit = async (values) => {
        // console.log(values);
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8181/task/sharewith/${item._id}`,{
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            });
            const data = await response.json();
            if(!response.ok){
                message.error(data.message);
                return;
            }    

            message.success("task is accessible to desired user!");
            handleCancel(); // Close modal and reset form
            setShowOptions(false); //close options (update, delete)
        } catch (error) {
            console.error("Error updating task:", error); 
            message.error("Failed to update task. Please try again.");
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
                    color: theme === "light" ? "#2A2B2F" : "#F2F2F2",
                  }}
            >
                Sharewith
            </Button>

            <Modal
                title="Share with"
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
                        label="Team Member Email"
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: "Please enter user email",
                            },
                        ]}
                    >
                        <Input placeholder="Enter user email" type="email"/>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}