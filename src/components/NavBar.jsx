import React, { useEffect, useState } from "react";
import { getInitials } from "../utils/employee";
import EditUser from "../pages/EditUser";


const NavBar = ({ user }) => {
    const [color, setColor] = useState("");
    const [editMode, setEditMode] = useState(false); // Controla o modo de edição

    // Cores aleatórias
    const getRandomColor = () => {
        const colors = [
            "#FF6347", // Tomato
            "#FF8C00", // Dark Orange
            "#FFD700", // Gold
            "#32CD32", // Lime Green
            "#4682B4", // Steel Blue
            "#6A5ACD", // Slate Blue
            "#FF1493", // Deep Pink
            "#FF4500", // Orange Red
            "#20B2AA", // Light Sea Green
            "#ADFF2F", // Green Yellow
            "#8A2BE2", // Blue Violet
            "#FF69B4", // Hot Pink
        ];
        
        return colors[Math.floor(Math.random() * colors.length)];
    };

    // Define a cor do avatar e salva no localStorage
    useEffect(() => {
        const storedColor = localStorage.getItem("userColor");
        if (storedColor) {
            setColor(storedColor);
        } else {
            const newColor = getRandomColor();
            setColor(newColor);
            localStorage.setItem("userColor", newColor);
        }
    }, []);

    // Alterna o modo de edição
    const toggleEditMode = () => {
        setEditMode(!editMode);
    };

    return (
        <div className={`bg-gray-200 px-8 py-4 transition-all duration-300 ${editMode ? 'min-h-fit' : 'h-24'} flex flex-col items-center justify-start`}>
            {/* Avatar do usuário */}
            {user && (
                <div className="relative mb-4">
                    <div
                        className="border border-gray-300 w-16 h-16 rounded-full flex items-center justify-center text-black text-lg cursor-pointer"
                        style={{ backgroundColor: color }}
                        onClick={toggleEditMode} // Ativa o modo de edição ao clicar
                    >
                        {getInitials(user.email)}
                    </div>
                </div>
            )}

            {/* Exibe o EditUser abaixo do avatar quando o modo de edição estiver ativado */}
            {editMode && (
                <div className="w-full">
                    <EditUser onCancel={toggleEditMode} />
                </div>
            )}
        </div>
    );
};

export default NavBar;
