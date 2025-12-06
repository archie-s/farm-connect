import React from "react"; export const Progress = ({ value }) => <div className="h-2 bg-gray-200 rounded"><div className="h-full bg-green-600 rounded" style={{ width: `${value}%` }}></div></div>;
