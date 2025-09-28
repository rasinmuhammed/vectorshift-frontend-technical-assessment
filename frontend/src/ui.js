import React, { useRef, useCallback, useState, useEffect } from 'react';
import ReactFlow, { Controls, MiniMap, useReactFlow, ReactFlowProvider } from 'reactflow';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';
import { useTheme } from './App';
import { 
  FiMaximize2, 
  FiMinimize2, 
  FiZoomIn, 
  FiZoomOut, 
  FiMove
} from 'react-icons/fi';

// Node components
import { InputNode } from './nodes/inputNode';
import { LLMNode } from './nodes/llmNode';
import { OutputNode } from './nodes/outputNode';
import { TextNode } from './nodes/textNode';
import { ApiNode } from './nodes/ApiNode';
import { FilterNode } from './nodes/FilterNode';
import { TransformNode } from './nodes/TransformNode';
import { DatabaseNode } from './nodes/DatabaseNode';
import { ConditionalNode } from './nodes/ConditionalNode';

import 'reactflow/dist/style.css';
import './App.css';

const nodeTypes = {
  customInput: InputNode,
  llm: LLMNode,
  customOutput: OutputNode,
  text: TextNode,
  api: ApiNode,
  filter: FilterNode,
  transform: TransformNode,
  database: DatabaseNode,
  conditional: ConditionalNode,
};

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  reactFlowInstance: state.reactFlowInstance,
  setReactFlowInstance: state.setReactFlowInstance,
});

// Top Right Controls
const TopRightControls = () => {
  const { fitView, zoomIn, zoomOut } = useReactFlow();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { isMobile } = useTheme();

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const iconProps = { size: isMobile ? 12 : 14 };

  return (
    <div className="top-right-controls">
      <button onClick={() => zoomIn()} title="Zoom In">
        <FiZoomIn {...iconProps} />
      </button>
      <button onClick={() => zoomOut()} title="Zoom Out">
        <FiZoomOut {...iconProps} />
      </button>
      <button onClick={() => fitView({ padding: 0.1, duration: 800 })} title="Fit View">
        <FiMove {...iconProps} />
      </button>
      <button onClick={handleFullscreen} title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}>
        {isFullscreen ? <FiMinimize2 {...iconProps} /> : <FiMaximize2 {...iconProps} />}
      </button>
    </div>
  );
};

// Main Flow Component
const PipelineFlow = () => {
  const reactFlowWrapper = useRef(null);
  const { isDark, isMobile } = useTheme();
  const [viewport, setViewport] = useState({ x: 0, y: 0, zoom: 0.75 });

  const {
    nodes,
    edges,
    getNodeID,
    addNode,
    onNodesChange,
    onEdgesChange,
    onConnect,
    reactFlowInstance,
    setReactFlowInstance,
  } = useStore(selector, shallow);

  // Enhanced drop handler
  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();

      if (!reactFlowInstance || !reactFlowWrapper.current) return;

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const appDataText = event.dataTransfer.getData('application/reactflow');

      if (!appDataText) return;

      let appData;
      try {
        appData = JSON.parse(appDataText);
      } catch (e) {
        console.error('Failed to parse drag data:', e);
        return;
      }

      const type = appData?.nodeType;
      if (typeof type === 'undefined' || !type) return;

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const nodeID = getNodeID(type);
      const newNode = {
        id: nodeID,
        type,
        position,
        data: { id: nodeID, nodeType: type },
      };
      
      addNode(newNode);
    },
    [reactFlowInstance, addNode, getNodeID]
  );

  // Enhanced drag over handler
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Handle touch-based drops
  const handleTouchDrop = useCallback(
    (event) => {
      const { nodeType, x, y, canvasElement } = event.detail;
      
      if (!reactFlowInstance || !canvasElement) return;

      const canvasBounds = canvasElement.getBoundingClientRect();
      const position = reactFlowInstance.project({
        x: x - canvasBounds.left,
        y: y - canvasBounds.top,
      });

      const nodeID = getNodeID(nodeType);
      const newNode = {
        id: nodeID,
        type: nodeType,
        position,
        data: { id: nodeID, nodeType },
      };
      
      addNode(newNode);
    },
    [reactFlowInstance, addNode, getNodeID]
  );

  // Enhanced initialization
  const onInit = useCallback((instance) => {
    setReactFlowInstance(instance);
    
    // Set initial viewport after a brief delay to ensure proper rendering
    setTimeout(() => {
      instance.setViewport({ 
        x: isMobile ? 50 : 100, 
        y: isMobile ? 50 : 100, 
        zoom: isMobile ? 0.6 : 0.75 
      });
    }, 100);
  }, [setReactFlowInstance, isMobile]);

  const onMoveEnd = useCallback((event, newViewport) => {
    setViewport(newViewport);
  }, []);

  // Add event listener for touch drops
  useEffect(() => {
    const canvas = reactFlowWrapper.current;
    if (canvas) {
      canvas.addEventListener('nodeDropFromTouch', handleTouchDrop);
      return () => {
        canvas.removeEventListener('nodeDropFromTouch', handleTouchDrop);
      };
    }
  }, [handleTouchDrop]);

  const connectionLineStyle = {
    stroke: isDark ? '#a78bfa' : '#60a5fa',
    strokeWidth: 3,
    strokeDasharray: '8,4',
    filter: isDark 
      ? 'drop-shadow(0 0 6px #a78bfa) drop-shadow(0 0 12px rgba(167, 139, 250, 0.4))'
      : 'drop-shadow(0 0 4px #60a5fa) drop-shadow(0 0 8px rgba(96, 165, 250, 0.3))',
    animation: 'dashFlow 1.5s linear infinite',
  };

  const defaultEdgeOptions = {
    type: 'smoothstep',
    style: {
      stroke: isDark ? '#a78bfa' : '#60a5fa',
      strokeWidth: 3,
      strokeDasharray: '8,4',
      filter: isDark 
        ? 'drop-shadow(0 0 6px #a78bfa) drop-shadow(0 0 12px rgba(167, 139, 250, 0.4))'
        : 'drop-shadow(0 0 4px #60a5fa) drop-shadow(0 0 8px rgba(96, 165, 250, 0.3))',
      animation: 'dashFlow 1.5s linear infinite',
    },
    markerEnd: {
      type: 'arrowclosed',
      color: isDark ? '#a78bfa' : '#60a5fa',

    },
    animated: true, // Enable built-in animation
  };

  const edgeTypes = {
    default: {
      ...defaultEdgeOptions,
    }
  };

  return (
    <div 
      ref={reactFlowWrapper} 
      className="pipeline-canvas"
      style={{ 
        width: '100%', 
        height: '100%',
        backgroundImage: `radial-gradient(circle, ${isDark ? '#a78bfa' : '#60a5fa'} 0.5px, transparent 0.5px)`,
        backgroundSize: isMobile ? '15px 15px' : '20px 20px',
        backgroundPosition: '0 0'
      }}
    >
      <ReactFlow
        style={{
          width: '100%',
          height: '100%'
        }}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onInit={onInit}
        onMoveEnd={onMoveEnd}
        nodeTypes={nodeTypes}
        connectionLineStyle={connectionLineStyle}
        defaultEdgeOptions={defaultEdgeOptions}
        proOptions={{ hideAttribution: true }}
        fitView={false}
        attributionPosition="bottom-left"
        minZoom={isMobile ? 0.3 : 0.2}
        maxZoom={isMobile ? 2.0 : 2.5}
        defaultViewport={{ 
          x: isMobile ? 50 : 100, 
          y: isMobile ? 50 : 100, 
          zoom: isMobile ? 0.6 : 0.75 
        }}
        snapToGrid={true}
        snapGrid={[10, 10]}
        nodesDraggable={true}
        nodesConnectable={true}
        elementsSelectable={true}
        selectNodesOnDrag={false}
        panOnDrag={true}
        panOnScroll={false}
        panOnScrollMode="free"
        zoomOnScroll={true}
        zoomOnDoubleClick={false}
        preventScrolling={true}
        panOnScrollSpeed={0.5}
        zoomOnPinch={true}
      >
        <Controls
          showZoom={true}
          showFitView={true}
          showInteractive={true}
          fitViewOptions={{ padding: 0.1, duration: 800 }}
          position="bottom-left"
          style={{
            background: isDark 
              ? 'rgba(31, 27, 46, 0.9)' 
              : 'rgba(255, 255, 255, 0.9)',
            border: `1px solid ${isDark ? '#2d1b69' : '#e2e8f0'}`,
            borderRadius: '10px',
            backdropFilter: 'blur(20px)',
          }}
        />

        <MiniMap
          nodeStrokeWidth={2}
          nodeColor={isDark ? '#a78bfa' : '#60a5fa'}
          nodeStrokeColor={isDark ? '#c4b5fd' : '#93c5fd'}
          nodeBorderRadius={6}
          maskColor={isDark ? 'rgba(10, 10, 15, 0.6)' : 'rgba(248, 250, 252, 0.6)'}
          maskStrokeColor={isDark ? '#2d1b69' : '#e2e8f0'}
          maskStrokeWidth={1}
          position="bottom-right"
          zoomable
          pannable
          style={{
            width: isMobile ? 120 : 180,
            height: isMobile ? 80 : 120,
            background: isDark 
              ? 'rgba(31, 27, 46, 0.9)' 
              : 'rgba(255, 255, 255, 0.9)',
            border: `1px solid ${isDark ? '#2d1b69' : '#e2e8f0'}`,
            borderRadius: '10px',
            backdropFilter: 'blur(20px)',
          }}
        />

        <TopRightControls />
      </ReactFlow>

      {/* Decorative background elements */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: isMobile ? '60px' : '100%',
        height: isMobile ? '60px' : '100%',
        background: `radial-gradient(circle at top left, ${
          isDark ? 'rgba(167, 139, 250, 0.08)' : 'rgba(96, 165, 250, 0.04)'
        } 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />
      
      <div style={{
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: isMobile ? '60px' : '80px',
        height: isMobile ? '60px' : '80px',
        background: `radial-gradient(circle at bottom right, ${
          isDark ? 'rgba(167, 139, 250, 0.08)' : 'rgba(96, 165, 250, 0.04)'
        } 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      {/*  CSS for better edge animations */}
      <style jsx>{`
        @keyframes dashFlow {
          0% {
            stroke-dashoffset: 0;
          }
          100% {
            stroke-dashoffset: -12;
          }
        }

        /* Override ReactFlow edge styles */
        .react-flow__edge-path {
          stroke: ${isDark ? '#a78bfa' : '#60a5fa'} !important;
          stroke-width: 3 !important;
          stroke-dasharray: 8,4 !important;
          filter: ${isDark 
            ? 'drop-shadow(0 0 6px #a78bfa) drop-shadow(0 0 12px rgba(167, 139, 250, 0.4)) !important'
            : 'drop-shadow(0 0 4px #60a5fa) drop-shadow(0 0 8px rgba(96, 165, 250, 0.3)) !important'};
          animation: dashFlow 1.5s linear infinite !important;
        }

    
        .react-flow__edge:hover .react-flow__edge-path {
          stroke-width: 4 !important;
          filter: ${isDark 
            ? 'drop-shadow(0 0 8px #a78bfa) drop-shadow(0 0 16px rgba(167, 139, 250, 0.6)) !important'
            : 'drop-shadow(0 0 6px #60a5fa) drop-shadow(0 0 12px rgba(96, 165, 250, 0.5)) !important'};
        }

        /* Connection line styling */
        .react-flow__connectionline {
          stroke: ${isDark ? '#a78bfa' : '#60a5fa'} !important;
          stroke-width: 3 !important;
          stroke-dasharray: 8,4 !important;
          filter: ${isDark 
            ? 'drop-shadow(0 0 6px #a78bfa) drop-shadow(0 0 12px rgba(167, 139, 250, 0.4)) !important'
            : 'drop-shadow(0 0 4px #60a5fa) drop-shadow(0 0 8px rgba(96, 165, 250, 0.3)) !important'};
          animation: dashFlow 1.5s linear infinite !important;
        }

        /* Enhanced edge markers */
        .react-flow__arrowhead {
          fill: ${isDark ? '#a78bfa' : '#60a5fa'} !important;
          filter: ${isDark 
            ? 'drop-shadow(0 0 4px #a78bfa) !important'
            : 'drop-shadow(0 0 2px #60a5fa) !important'};
        }

        /* Node handle glow effects */
        .react-flow__handle {
          background: ${isDark ? '#1f1b2e' : '#ffffff'} !important;
          border: 2px solid ${isDark ? '#a78bfa' : '#60a5fa'} !important;
          box-shadow: 0 0 8px ${isDark ? 'rgba(167, 139, 250, 0.5)' : 'rgba(96, 165, 250, 0.4)'} !important;
          transition: all 0.2s ease !important;
        }

        .react-flow__handle:hover {
          transform: scale(1.2) !important;
          box-shadow: 0 0 12px ${isDark ? 'rgba(167, 139, 250, 0.7)' : 'rgba(96, 165, 250, 0.6)'} !important;
        }

        .react-flow__handle.connecting {
          background: ${isDark ? '#a78bfa' : '#60a5fa'} !important;
          box-shadow: 0 0 16px ${isDark ? 'rgba(167, 139, 250, 0.8)' : 'rgba(96, 165, 250, 0.7)'} !important;
        }

        /* Mobile optimizations */
        @media (max-width: 767px) {
          .react-flow__edge-path {
            stroke-width: 2 !important;
            stroke-dasharray: 6,3 !important;
          }
          
          .react-flow__edge:hover .react-flow__edge-path {
            stroke-width: 3 !important;
          }
          
          .react-flow__handle {
            width: 12px !important;
            height: 12px !important;
          }
        }

        /* High contrast mode */
        @media (prefers-contrast: high) {
          .react-flow__edge-path {
            stroke-width: 4 !important;
            filter: none !important;
          }
          
          .react-flow__handle {
            border-width: 3px !important;
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export const PipelineUI = () => {
  return (
    <ReactFlowProvider>
      <PipelineFlow />
    </ReactFlowProvider>
  );
};