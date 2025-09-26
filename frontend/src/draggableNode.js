// draggableNode.js - Sophisticated Draggable Nodes

export const DraggableNode = ({ type, label, description }) => {
  const onDragStart = (event, nodeType) => {
    const appData = { nodeType };
    event.target.style.cursor = 'grabbing';
    event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
    event.dataTransfer.effectAllowed = 'move';
  };

  const getNodeGradient = (type) => {
    const gradients = {
      'customInput': 'linear-gradient(135deg, rgba(139, 126, 234, 0.15) 0%, rgba(88, 86, 214, 0.25) 100%)',
      'customOutput': 'linear-gradient(135deg, rgba(147, 134, 234, 0.15) 0%, rgba(99, 102, 241, 0.25) 100%)',
      'text': 'linear-gradient(135deg, rgba(167, 139, 250, 0.15) 0%, rgba(124, 58, 237, 0.25) 100%)',
      'llm': 'linear-gradient(135deg, rgba(196, 181, 253, 0.15) 0%, rgba(139, 92, 246, 0.25) 100%)',
      'api': 'linear-gradient(135deg, rgba(183, 148, 244, 0.15) 0%, rgba(147, 51, 234, 0.25) 100%)',
      'filter': 'linear-gradient(135deg, rgba(186, 164, 245, 0.15) 0%, rgba(124, 58, 237, 0.25) 100%)',
      'transform': 'linear-gradient(135deg, rgba(196, 181, 253, 0.15) 0%, rgba(109, 40, 217, 0.25) 100%)',
      'database': 'linear-gradient(135deg, rgba(183, 148, 244, 0.15) 0%, rgba(88, 28, 135, 0.25) 100%)',
      'conditional': 'linear-gradient(135deg, rgba(167, 139, 250, 0.15) 0%, rgba(107, 33, 168, 0.25) 100%)'
    };
    return gradients[type] || gradients.customInput;
  };

  const getAccentColor = (type) => {
    const colors = {
      'customInput': 'rgba(139, 126, 234, 0.6)',
      'customOutput': 'rgba(147, 134, 234, 0.6)',
      'text': 'rgba(167, 139, 250, 0.6)',
      'llm': 'rgba(196, 181, 253, 0.6)',
      'api': 'rgba(183, 148, 244, 0.6)',
      'filter': 'rgba(186, 164, 245, 0.6)',
      'transform': 'rgba(196, 181, 253, 0.6)',
      'database': 'rgba(183, 148, 244, 0.6)',
      'conditional': 'rgba(167, 139, 250, 0.6)'
    };
    return colors[type] || colors.customInput;
  };

  return (
    <div
      className={type}
      onDragStart={(event) => onDragStart(event, type)}
      onDragEnd={(event) => (event.target.style.cursor = 'grab')}
      style={{
        cursor: 'grab',
        width: '130px',
        height: '80px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: '12px 16px',
        borderRadius: '8px',
        background: getNodeGradient(type),
        border: `1px solid ${getAccentColor(type)}`,
        backdropFilter: 'blur(8px)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto, sans-serif',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: `
          0 4px 12px rgba(0, 0, 0, 0.15),
          0 1px 3px rgba(0, 0, 0, 0.1),
          inset 0 1px 0 rgba(255, 255, 255, 0.05)
        `
      }}
      onMouseEnter={(e) => {
        e.target.style.transform = 'translateY(-2px) scale(1.02)';
        e.target.style.boxShadow = `
          0 8px 24px rgba(0, 0, 0, 0.2),
          0 2px 6px rgba(0, 0, 0, 0.15),
          0 0 0 1px ${getAccentColor(type)},
          inset 0 1px 0 rgba(255, 255, 255, 0.1)
        `;
        e.target.style.background = getNodeGradient(type).replace('0.15', '0.25').replace('0.25', '0.35');
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'translateY(0) scale(1)';
        e.target.style.boxShadow = `
          0 4px 12px rgba(0, 0, 0, 0.15),
          0 1px 3px rgba(0, 0, 0, 0.1),
          inset 0 1px 0 rgba(255, 255, 255, 0.05)
        `;
        e.target.style.background = getNodeGradient(type);
      }}
      draggable
    >
      {/* Subtle inner highlight */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
        borderRadius: '8px 8px 0 0'
      }} />
      
      {/* Node Label */}
      <div style={{
        fontSize: '13px',
        fontWeight: '600',
        color: '#f8fafc',
        marginBottom: '2px',
        letterSpacing: '0.025em',
        lineHeight: '1.2'
      }}>
        {label}
      </div>
      
      {/* Node Description */}
      <div style={{
        fontSize: '10px',
        color: 'rgba(226, 232, 240, 0.7)',
        fontWeight: '400',
        lineHeight: '1.3',
        letterSpacing: '0.025em'
      }}>
        {description}
      </div>

      {/* Drag indicator */}
      <div style={{
        position: 'absolute',
        top: '8px',
        right: '8px',
        width: '16px',
        height: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
        opacity: 0.4
      }}>
        <div style={{
          width: '100%',
          height: '1px',
          background: 'rgba(226, 232, 240, 0.5)',
          borderRadius: '1px'
        }} />
        <div style={{
          width: '100%',
          height: '1px',
          background: 'rgba(226, 232, 240, 0.5)',
          borderRadius: '1px'
        }} />
        <div style={{
          width: '100%',
          height: '1px',
          background: 'rgba(226, 232, 240, 0.5)',
          borderRadius: '1px'
        }} />
      </div>
    </div>
  );
};