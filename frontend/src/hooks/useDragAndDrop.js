import { useState } from 'react';

export function useDragAndDrop(onDrop) {
  const [isDragging, setIsDragging] = useState(false);
  const handleDragStart = (e, data) => {
    setIsDragging(true);
    e.dataTransfer.setData('application/json', JSON.stringify(data));
  };
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const data = JSON.parse(e.dataTransfer.getData('application/json'));
    onDrop(data, e.target);
  };
  return { isDragging, handleDragStart, handleDragOver, handleDrop };
}