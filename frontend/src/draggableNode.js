import React from 'react';
import {
  FiLogIn, FiLogOut, FiType, FiCpu, FiGitPullRequest,
  FiFilter, FiCode, FiDatabase, FiGitBranch, FiGlobe
} from 'react-icons/fi';

import './App.css';

export const DraggableNode = ({ type, label, description }) => {
  const onDragStart = (event, nodeType) => {
    // Prevent default to ensure proper drag behavior
    event.stopPropagation();
    
    const appData = { nodeType };
    
    // Set drag data
    event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
    event.dataTransfer.effectAllowed = 'move';
    
    // Visual feedback
    event.target.style.cursor = 'grabbing';
    event.target.style.opacity = '0.8';
    
    const dragImage = event.target.cloneNode(true);
    dragImage.style.transform = 'rotate(5deg)';
    dragImage.style.opacity = '0.8';
    document.body.appendChild(dragImage);
    event.dataTransfer.setDragImage(dragImage, 
      event.target.offsetWidth / 2, 
      event.target.offsetHeight / 2
    );
    
    // Clean up the temporary drag image
    setTimeout(() => {
      document.body.removeChild(dragImage);
    }, 0);
  };

  const onDragEnd = (event) => {
    // Reset visual state
    event.target.style.cursor = 'grab';
    event.target.style.opacity = '1';
  };

  const onDrag = (event) => {
    // Prevent default behavior during drag
    event.preventDefault();
  };

  // Handle touch events for mobile
  const onTouchStart = (event) => {
    // Store touch data for potential drag simulation
    const touch = event.touches[0];
    event.target.dataset.startX = touch.clientX;
    event.target.dataset.startY = touch.clientY;
    event.target.dataset.isDragging = 'false';
    
    // Visual feedback
    event.target.style.transform = 'scale(1.05)';
  };

  const onTouchMove = (event) => {
    const touch = event.touches[0];
    const startX = parseFloat(event.target.dataset.startX);
    const startY = parseFloat(event.target.dataset.startY);
    
    const deltaX = Math.abs(touch.clientX - startX);
    const deltaY = Math.abs(touch.clientY - startY);
    
    // If moved significantly, consider it a drag
    if (deltaX > 10 || deltaY > 10) {
      event.target.dataset.isDragging = 'true';
      event.preventDefault(); // Prevent scrolling
      
      // Visual feedback
      event.target.style.opacity = '0.8';
      event.target.style.transform = 'scale(1.05) rotate(2deg)';
    }
  };

  const onTouchEnd = (event) => {
    // Reset visual state
    event.target.style.transform = 'scale(1)';
    event.target.style.opacity = '1';
    
    const isDragging = event.target.dataset.isDragging === 'true';
    
    if (isDragging) {
      // Simulate drop on the canvas
      const touch = event.changedTouches[0];
      const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
      
      // Check if dropped on canvas
      const canvas = elementBelow?.closest('.pipeline-canvas');
      if (canvas) {
        // Create a synthetic drop event
        const syntheticEvent = new CustomEvent('nodeDropFromTouch', {
          detail: {
            nodeType: type,
            x: touch.clientX,
            y: touch.clientY,
            canvasElement: canvas
          },
          bubbles: true
        });
        canvas.dispatchEvent(syntheticEvent);
      }
    }
    
    // Clean up
    delete event.target.dataset.startX;
    delete event.target.dataset.startY;
    delete event.target.dataset.isDragging;
  };

  const getNodeIcon = (type) => {
    const iconProps = { size: 14, style: { color: 'currentColor' } }; 
    const icons = {
      'customInput': <FiLogIn {...iconProps} />,
      'customOutput': <FiLogOut {...iconProps} />,
      'text': <FiType {...iconProps} />,
      'llm': <FiCpu {...iconProps} />,
      'api': <FiGlobe {...iconProps} />,
      'filter': <FiFilter {...iconProps} />,
      'transform': <FiCode {...iconProps} />,
      'database': <FiDatabase {...iconProps} />,
      'conditional': <FiGitBranch {...iconProps} />
    };
    return icons[type] || <FiGitPullRequest {...iconProps} />;
  };

  return (
    <div
      className="draggable-node"
      draggable={true}
      onDragStart={(event) => onDragStart(event, type)}
      onDragEnd={onDragEnd}
      onDrag={onDrag}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      role="button"
      tabIndex={0}
      aria-label={`Drag ${label} node to canvas`}
    >
      <div className={`draggable-node-icon node-type--${type}`}>
        {getNodeIcon(type)}
      </div>
      <div className="draggable-node-info">
        <div className="draggable-node-label">{label}</div>
        <div className="draggable-node-description">{description}</div>
      </div>
    </div>
  );
};