import React, { useState, useEffect } from 'react';
import './TaskList.css';
import base from '../../api/base';
import { IoIosAddCircleOutline, IoIosRefresh } from "react-icons/io";
import { MdDeleteForever } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import NewTaskModal from '../NewTaskModal/NewTaskModal';
import SearchModal from '../SearchModal/SearchModal';

export const TaskList = () => {
    const[tasks, setTasks] = useState([]);
    const[isModalOpen, setIsModalOpen] = useState(false);
    const[searchStatus, setSearchStatus] = useState('');
    const[filteredTasks, setFilteredTasks] = useState([]);
    const[showSearchModal, setShowSearchModal] = useState(false);
    
    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSubmitTask = (task) => {
        console.log('New Task:', task);
        setIsModalOpen(false);
    }

    const handleDeleteTask = async (taskId) => {
        try {
            await base('Tasks').destroy(taskId);

            setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId))

            console.log("Task deleted!");
        } catch (error) {
            console.error('Error deleting task:', error )
        }
    }

    const handleStatusChange = async (taskId, newStatus) => {
        try {
            await base('Tasks').update(taskId, {
                Status: newStatus,
            });

            setTasks(prevTasks => prevTasks.map(task => task.id === taskId ? { ...task, status: newStatus} : task));

            console.log('Task status updated successfully!');
        } catch (error) {
            console.error("Error updating task status:", error);
        }
    };

    const handleRefresh = async () => {
        try {
            const records = await base('Tasks').select({
                view: 'Grid view',
                fields: ['Name', 'Notes', 'Attachments', 'Status', 'User'],
            }).all();

            const tasksData = await Promise.all(records.map(async (record) => {
                const assignedUserIds = record.get('User') || [];
                const assignedUsers = await Promise.all(assignedUserIds.map(async (userId) => {
                    const userRecord = await base('Users').find(userId);
                    return userRecord.get('Name')
                }));

                return {
                    id: record.id,
                    name: record.get('Name'),
                    notes: record.get('Notes'),
                    status: record.get('Status'),
                    assignedUsers,
                    attachements: record.get('Attachments') || [],
                };
            }));

            setTasks(tasksData);

            console.log("Tasks refreshed successfully!");
        } catch (error) {
            console.error("Error refreshing tasks:", error);
        }
    };

    useEffect(() => {
        handleRefresh();
    }, []);

    useEffect(() => {
        const filteredTasks = searchStatus ? tasks.filter(task => task.status === searchStatus) : tasks;
        setFilteredTasks(filteredTasks);
    }, [searchStatus, tasks])

    return (
        <div className='wrapper'>
            <div className='header'>
                <h1>Task List</h1>
                <button onClick={handleOpenModal}><IoIosAddCircleOutline /></button>
                <button onClick={() => { setShowSearchModal(true); console.log(showSearchModal);}}><CiSearch /></button>
                <button onClick={handleRefresh}><IoIosRefresh /></button>
            </div>
            <div className='Modal'>
                <NewTaskModal isOpen={isModalOpen} onRequestClose={handleCloseModal} onSubmit={handleSubmitTask} />
            </div>
            <div className='Modal'>
                <SearchModal isOpen={showSearchModal} onClose={() => setShowSearchModal(false)} onSelectStatus={(status) => setSearchStatus(status)}/>
            </div>

            <ul className='new-task'>
                {filteredTasks.map(task => (
                    <li key={task.id}>
                        <div className='task-header'>
                            <h3>{task.name}</h3>
                            <div className='buttons-container'>
                                <button onClick={() => handleDeleteTask(task.id)}><MdDeleteForever /></button>
                            </div>
                        </div>
                        <p>{task.notes}</p>
                        <select className='status-select' value={task.status} onChange={(e) => handleStatusChange(task.id, e.target.value)}>
                            <option className='Todo' value="Todo">Todo</option>
                            <option className='In-progress' value="In progress">In Progress</option>
                            <option className='Done' value="Done">Done</option>
                        </select>
                        <p>Assigned Users: {task.assignedUsers}</p>
                        <ul className='attachments'>
                            {task.attachements.map((attachment, index) => (
                                <li key={index}>
                                    <a href={attachment.url} target='_blank' rel='noopener noreferrer'>{attachment.filename}</a>
                                    {attachment.thumbnails && (
                                        <div>
                                            <img className='thumbnail' src={attachment.thumbnails.small.url} alt="Thumbnail" />
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    )
}
