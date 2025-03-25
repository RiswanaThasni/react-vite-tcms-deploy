import React from "react";

const Card = ({ children, className, onClick, title, progress }) => {
  return (
    <div
      className={`p-4 shadow-lg rounded-lg cursor-pointer hover:shadow-xl transition flex flex-col items-center justify-between ${className}`}
      onClick={onClick}
    >
      {/* Title */}
      <h3 className="text-lg  font-semibold text-current">{title}</h3>

      {/* Content */}
      <div className="flex-grow flex items-center justify-center">{children}</div>

      {/* Progress Bar */}
      {progress !== undefined && (
        <div className="w-full mt-2">
          <p className="text-sm text-white text-center">{progress}%</p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
            <div
              className="h-2 rounded-full bg-gray-300 transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Card;
