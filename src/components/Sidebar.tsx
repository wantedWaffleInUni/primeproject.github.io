import React from 'react'
import './Sidebar.css'
import CreateTags from './CreateTags'

interface SidebarProps
{
    onHomeClick: () => void
}

const Sidebar: React.FC<SidebarProps> = ({onHomeClick}) => 
{
    const homeButtonClick = () =>
    {
        // Function for home button
        alert('You are on the home page')

        // Apply button logic here
        onHomeClick()
        
    }

    return (
        <aside className = "sidebar">
            <nav>
                <ul>
                    <li>
                        <a href="">
                        <button onClick={homeButtonClick} className="sidebar-button">Home</button>
                        </a>
                    </li>
                    <li>
                        <button className="sidebar-button" disabled>Archive</button> 
                    </li>
                    <li>
                        <button className="sidebar-button" disabled>Backlog</button>
                    </li>
                </ul>
                {/* <CreateTags /> */}
            </nav>
        </aside>
    )
}

export default Sidebar