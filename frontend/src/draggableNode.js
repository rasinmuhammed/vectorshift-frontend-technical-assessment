// draggableNode.js - VectorShift Style Draggable Nodes

export const DraggableNode = ({ type, label, description }) => {
  const onDragStart = (event, nodeType) => {
    const appData = { nodeType };
    event.target.style.cursor = 'grabbing';
    event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
    event.dataTransfer.effectAllowed = 'move';
  };

  const getNodeIcon = (type) => {
    const icons = {
      'customInput': '📄',
      'customOutput': '📤',
      'text': '📝',
      'llm': '🤖',
      'api': '🔗',
      'filter': '🔍',
      'transform': '⚡',
      'database': '🗄️',
      'conditional': '🔀'
    };
    return icons[type] || '⚙️';
  };

  const getNodeColor = (type) => {
    const colors = {
      'customInput': '#3b82f6',
      'customOutput': '#10b981', 
      'text': '#8b5cf6',
      'llm': '#f59e0b',
      'api': '#ef4444',
      'filter': '#06b6d4',
      'transform': '#84cc16',
      'database': '#6366f1',
      'conditional': '#f97316'
    };
    return colors[type] || '#64748b';
  };

  return (
    <div
      className="draggable-node"
      onDragStart={(event) => onDragStart(event, type)}
      onDragEnd={(event) => (event.target.style.cursor = 'grab')}
      style={{
        cursor: 'grab'
      }}
      draggable
    >
      <div 
        className="draggable-node-icon"
        style={{
          background: getNodeColor(type)
        }}
      >
        {getNodeIcon(type)}
      </div>
      
      <div className="draggable-node-title">
        {label}
      </div>
      
      <div className="draggable-node-desc">
        {description}
      </div>
    </div>
  );
};