import React  from "react";
import './SearchModal.css';

const SearchModal = ({ isOpen, onClose, onSelectStatus }) => {
    return (
        <div className={`search-modal ${isOpen ? 'open' : ''}`}>
            <div className="modal-content">
                <h2>Select Status</h2>
                <select className="status-select" onChange={(e) => onSelectStatus(e.target.value)}>
                    <option className="all-statueses" value="">All Statuses</option>
                    <option className="Todo" value="Todo">Todo</option>
                    <option className="In-progress" value="In progress">In Progress</option>
                    <option className="Done" value="Done">Done</option>
                </select>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default SearchModal;