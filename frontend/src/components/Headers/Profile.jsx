import { useState, useEffect } from 'react'
import { Modal, Button, message } from 'antd';
import logo from '../../assets/Sidebar/logo.svg'

export default function Profile({ theme }) {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [user, setUser] = useState(storedUser);

    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleClose = () => {
        setIsModalOpen(false);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const validExtensions = ['.jpg', '.jpeg'];
        const fileName = file.name.toLowerCase();

        if (!validExtensions.some(ext => fileName.endsWith(ext))) {
            message.error('Only JPG files are allowed!');
            e.target.value = '';
            return;
        }

        const userId = user.id;
        console.log(userId); //////////////////
        const formData = new FormData();
        formData.append('userId', userId);
        formData.append('image', file);

        fetch('http://localhost:8181/profile/uploadPhoto', {
            method: 'POST',
            body: formData,
        })
            .then(response => response.json())
            .then(data => {
                const updatedUser = { ...user, profilePic: `/uploads/${user.id}.jpg` };
                setUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
            })
            .catch(error => {
                console.error('Error uploading image:', error);
            });
        // handleClose();
    };

    return (
        <>
            <Button
                style={{
                    width: "34px",
                    height: "34px",
                    background: "#E5FA58",
                    borderRadius: "50px",
                    padding: 0, // Ensure no extra padding
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
                type="primary"
                onClick={showModal}
            >
                <img
                    className="w-full h-full rounded-full"
                    src={`http://localhost:8181${user.profilePic}`}
                    alt="User Profile"
                    style={{ width: "100%", height: "100%", borderRadius: "50%" }}
                />
            </Button>


            <Modal
                title="Profile"
                open={isModalOpen}
                onCancel={handleClose}
                footer={null}
            >
                <div className="container flex ">
                    <div className="flex flex-col left-container gap-2">
                        <img
                            className="w-[100px] h-[100px] rounded-full"
                            src={`http://localhost:8181${user.profilePic}`}
                            alt="User Profile"
                        />
                        <h3>{user.username || 'Guest'}</h3>
                        <label className="upload-btn">
                            <input
                                type="file"
                                onChange={handleFileChange}
                                accept=".jpg, .jpeg"
                                required
                            />
                            <Button
                                type='primary'
                                className='rounded-2xl'
                            // onClick={handleFileChange}
                            >
                                Update Photo
                            </Button>
                        </label>
                    </div>

                    <div className="right-container">
                        <div className="detail">
                            {/* <h2>Name:</h2> */}
                            <p>Name: {user.username}</p>
                        </div>
                        <div className="detail">
                            <h2>Email:{user.email}</h2>
                        </div>
                        <div>
                            <button >Change Password</button>
                        </div>
                    </div>
                </div>

            </Modal>
        </>
    )
}