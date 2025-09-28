import {
  FiLogIn, FiLogOut, FiType, FiCpu, FiGitPullRequest,
  FiFilter, FiCode, FiDatabase, FiGitBranch, FiGlobe
} from 'react-icons/fi';

import './App.css'

export const DraggableNode = ({ type, label, description }) => {
  const onDragStart = (event, nodeType) => {
    const appData = { nodeType };
    event.target.style.cursor = 'grabbing';
    event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
    event.dataTransfer.effectAllowed = 'move';
  };

  const getNodeIcon = (type) => {
    const iconProps = { size: 4, style: { color: 'currentColor' } };
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
      onDragStart={(event) => onDragStart(event, type)}
      onDragEnd={(event) => (event.target.style.cursor = 'grab')}
      draggable
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