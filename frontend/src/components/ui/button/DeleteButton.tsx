import React from 'react';

interface DeleteButtonProps {
    handleDelete: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const DeleteButton = ({handleDelete}:DeleteButtonProps) => {
    return (
         <button
                onClick={(e)=>handleDelete(e)}
                className="ml-4 bg-red-500 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:bg-red-600"
              >
                Delete
              </button>
    );
};

