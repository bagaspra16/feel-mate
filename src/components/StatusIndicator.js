import React from 'react';
import { FaMicrophone, FaRobot, FaSpinner } from 'react-icons/fa';

const StatusIndicator = ({ status }) => {
  let icon;
  let text;
  let bgColor;

  switch (status) {
    case 'idle':
      icon = null;
      text = 'Ready';
      bgColor = 'bg-gray-600';
      break;
    case 'listening':
      icon = <FaMicrophone className="mr-2 animate-pulse" />;
      text = 'Listening...';
      bgColor = 'bg-accent';
      break;
    case 'processing':
      icon = <FaSpinner className="mr-2 animate-spin" />;
      text = 'Processing...';
      bgColor = 'bg-amber-500';
      break;
    case 'speaking':
      icon = <FaRobot className="mr-2" />;
      text = 'Speaking...';
      bgColor = 'bg-emerald-600';
      break;
    case 'error':
      icon = <span className="mr-2">❌</span>;
      text = 'Error';
      bgColor = 'bg-red-500';
      break;
    default:
      icon = null;
      text = 'Ready';
      bgColor = 'bg-gray-600';
  }

  return (
    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white ${bgColor}`}>
      {icon}
      {text}
    </div>
  );
};

export default StatusIndicator; 