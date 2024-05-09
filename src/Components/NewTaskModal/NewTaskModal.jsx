import React, { useState, useEffect, useRef } from "react";
import Modal from 'react-modal';
import base from '../../api/base';
import './NewTaskModal.css';

Modal.setAppElement('#root');

const NewTaskModal = ({ isOpen, onRequestClose, onSubmit }) => {
    const [users, setUsers] = useState([]);
    const [userRecords, setUserRecords] = useState([]);
    const selectedUserRef = useRef();
    const taskNameRef = useRef();
    const taskNotesRef = useRef();
    
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const userRecordsList = await base('Users').select({ fields: ['Name'] }).all();
                const userList = userRecords.map(record => record.get('Name'));
                setUsers(userList);
                setUserRecords(userRecordsList);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, [userRecords]);
    
    const handleSubmit = (e) => {
        e.preventDefault();
        
        try {
            const selectedUserName = selectedUserRef.current.value;
            const selectedUserRecord = userRecords.find(record => record.get('Name') === selectedUserName);

            if (!selectedUserRecord) {
                console.error("No user selected");
                return;
            }

            const selectedUserId = selectedUserRecord.id;
            const taskName = taskNameRef.current.value;
            const taskNotes = taskNotesRef.current.value;

            base('Tasks').create({
                Name: taskName,
                Notes: taskNotes,
                Status: 'Todo',
                User: [selectedUserId],
                function(err, records) {
                    if(err) {
                        console.log(err);
                        return;
                    }
                }
            });

            console.log('Task created successfully!');

            taskNameRef.current.value = '';
            taskNotesRef.current.value = '';
            selectedUserRef.current.value = '';
            onRequestClose();
        } catch(error) {
            console.error('Error creating task:', error);
        }
    };

    return (
        <Modal className="wrapper-modal" isOpen={isOpen} onRequestClose={onRequestClose}>
            <div className="modal-form">
            <h2>Create New Task</h2>
            <form>
                <label>
                    Task Name:
                    <input type="text" ref={taskNameRef} />
                </label>
                <br />
                <label>
                    Task Notes:
                    <textarea ref={taskNotesRef} />
                </label>
                <br />
                <label>
                    User: 
                    <select ref={selectedUserRef}>
                        <option value="">Select User</option>
                        {users.map((user, index) => (
                            <option key={index} value={user}>{user}</option>
                        ))}
                    </select>
                </label>
                <br />
                <button type="submit" onClick={(e) => { handleSubmit(e) }}>Create Task</button>
                <h3>Hit escape to exit</h3>
            </form>
            </div>
        </Modal>
    )
    
}

export default NewTaskModal;