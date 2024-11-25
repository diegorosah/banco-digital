import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'primereact/button';
import '../assets/styles/components/Sidebar.css';

const Sidebar = () => {
    return (
        <div className="sidebar">
            <h2>Menu</h2>
            <ul>
                <li>
                    <Link to="/dashboard">
                        <Button label="Dashboard" className="sidebar-button" />
                    </Link>
                </li>
                <li>
                    <Link to="/transfer">
                        <Button label="Transferência" className="sidebar-button" />
                    </Link>
                </li>
                <li>
                    <Link to="/statement">
                        <Button label="Extrato" className="sidebar-button" />
                    </Link>
                </li>
                <li>
                    <Link to="/loans">
                        <Button label="Empréstimos" className="sidebar-button" />
                    </Link>
                </li>
                <li>
                    <Link to="/loans">
                        <Button label="Empréstimos" className="sidebar-button" />
                    </Link>
                </li>
                <li>
                    <Link to="/investments">
                        <Button label="Investimentos" className="sidebar-button" />
                    </Link>
                </li>
                <li>
                    <Link to="/profile">
                        <Button label="Perfil" className="sidebar-button" />
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
