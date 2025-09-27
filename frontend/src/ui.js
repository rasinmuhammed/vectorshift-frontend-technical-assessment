// Enhanced UI Component - Premium Pipeline Builder
import React, { useRef, useCallback, useState } from 'react';
import ReactFlow, { Controls, Background, MiniMap, useReactFlow, ReactFlowProvider } from 'reactflow';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';
import { useTheme } from './App';
import { 
  FiMaximize2, 
  FiMinimize2, 
  FiZoomIn, 
  FiZoomOut, 
  FiMove,
  FiMessageCircle
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

// Custom Zoom Display Component
const ZoomDisplay = ({ zoom }) => {
  const { isDark } = useTheme();
  return (
    <div className="zoom-display">
      {Math.round(zoom * 100)}%
    </div>
  );
};

// Enhanced Top Right Controls - This component will be rendered inside ReactFlow
const TopRightControls = () => {
  const { isDark } = useTheme();
  const { fitView, zoomIn, zoomOut } = useReactFlow();
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const iconProps = { size: 16 };

  return (
    <div className="top-right-controls">
      <button onClick={() => zoomIn()} title="Zoom In">
        <FiZoomIn {...iconProps} />
      </button>
      <button onClick={() => zoomOut()} title="Zoom Out">
        <FiZoomOut {...iconProps} />
      </button>
      <button onClick={() => fitView({ padding: 0.2 })} title="Fit View">
        <FiMove {...iconProps} />
      </button>
      <button onClick={handleFullscreen} title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}>
        {isFullscreen ? <FiMinimize2 {...iconProps} /> : <FiMaximize2 {...iconProps} />}
      </button>
    </div>
  );
};

// Enhanced Chat Button
const ChatButton = () => {
  return (
    <button className="chat-button" title="AI Assistant">
      <FiMessageCircle size={24} />
    </button>
  );
};

// Main Flow Component - This contains the ReactFlow logic
const PipelineFlow = () => {
  const reactFlowWrapper = useRef(null);
  const { isDark } = useTheme();
  const [viewport, setViewport] = useState({ x: 0, y: 0, zoom: 1 });

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

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      if (!reactFlowInstance) return;

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const appDataText = event.dataTransfer.getData('application/reactflow');

      if (!appDataText) return;

      const appData = JSON.parse(appDataText);
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

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onInit = useCallback((instance) => {
    setReactFlowInstance(instance);
  }, [setReactFlowInstance]);

  const onMoveEnd = useCallback((event, newViewport) => {
    setViewport(newViewport);
  }, []);

  // Enhanced connection line style with theme support
  const connectionLineStyle = {
    stroke: isDark ? '#6913e0' : '#3b82f6',
    strokeWidth: 3,
    strokeDasharray: '8,4',
    filter: isDark 
      ? 'drop-shadow(0 0 4px #6913e0) drop-shadow(0 0 2px #6913e0)'
      : 'drop-shadow(0 0 2px #3b82f6)',
  };

  // Enhanced default edge options with theme support
  const defaultEdgeOptions = {
    type: 'smoothstep',
    style: {
      stroke: isDark ? '#6913e0' : '#3b82f6',
      strokeWidth: 3,
      strokeDasharray: '8,4',
      filter: isDark 
        ? 'drop-shadow(0 0 4px #6913e0) drop-shadow(0 0 2px #6913e0)'
        : 'drop-shadow(0 0 2px #3b82f6)',
    },
    markerEnd: {
      type: 'arrowclosed',
      color: isDark ? '#6913e0' : '#3b82f6',
      width: 20,
      height: 20,
    },
    animated: false,
  };

  return (
    <div ref={reactFlowWrapper} style={{ width: '100%', height: '100%' }}>
      <ReactFlow
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
        fitView
        attributionPosition="bottom-left"
        minZoom={0.1}
        maxZoom={4}
        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
        snapToGrid={true}
        snapGrid={[15, 15]}
      >
        {/* Enhanced Background with theme support */}
        <Background
          variant="dots"
          gap={24}
          size={1.5}
          color={isDark ? 'rgba(105, 19, 224, 0.3)' : 'rgba(59, 130, 246, 0.2)'}
          style={{
            background: isDark 
              ? 'radial-gradient(circle at 50% 50%, rgba(105, 19, 224, 0.05) 0%, transparent 50%)'
              : 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.03) 0%, transparent 50%)'
          }}
        />

        {/* Enhanced Controls with custom styling */}
        <Controls
          showZoom={true}
          showFitView={true}
          showInteractive={true}
          fitViewOptions={{ padding: 0.2 }}
          position="bottom-left"
        />

        {/* Enhanced MiniMap with theme support */}
        <MiniMap
          nodeStrokeWidth={3}
          nodeColor={isDark ? '#6913e0' : '#3b82f6'}
          nodeStrokeColor={isDark ? '#a78bfa' : '#93c5fd'}
          nodeBorderRadius={8}
          maskColor={isDark ? 'rgba(10, 10, 15, 0.6)' : 'rgba(248, 250, 252, 0.6)'}
          maskStrokeColor={isDark ? '#2d1b69' : '#e2e8f0'}
          maskStrokeWidth={1}
          position="bottom-right"
          zoomable
          pannable
          style={{
            width: 200,
            height: 150,
          }}
        />

        {/* Components that need ReactFlow context */}
        <TopRightControls />
      </ReactFlow>

      {/* Components outside ReactFlow context */}
      <ZoomDisplay zoom={viewport.zoom} />
      <ChatButton />
      
      {/* Subtle corner decorations for premium feel */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100px',
        height: '100px',
        background: `radial-gradient(circle at top left, ${
          isDark ? 'rgba(105, 19, 224, 0.1)' : 'rgba(59, 130, 246, 0.05)'
        } 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />
      
      <div style={{
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: '100px',
        height: '100px',
        background: `radial-gradient(circle at bottom right, ${
          isDark ? 'rgba(105, 19, 224, 0.1)' : 'rgba(59, 130, 246, 0.05)'
        } 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />
    </div>
  );
};

// Main PipelineUI component wrapped with ReactFlowProvider
export const PipelineUI = () => {
  return (
    <ReactFlowProvider>
      <PipelineFlow />
    </ReactFlowProvider>
  );
};