import { useRef, useCallback, useState } from 'react';
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

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const iconProps = { size: 14 };

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

// Main Flow Component - This contains the ReactFlow logic
const PipelineFlow = () => {
  const reactFlowWrapper = useRef(null);
  const { isDark } = useTheme();
  // eslint-disable-next-line
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
    setTimeout(() => {
      instance.setViewport({ x: 100, y: 100, zoom: 0.75 });
    }, 100);
  }, [setReactFlowInstance]);

  const onMoveEnd = useCallback((event, newViewport) => {
    setViewport(newViewport);
  }, []);

  const connectionLineStyle = {
    stroke: isDark ? '#6913e0' : '#3b82f6',
    strokeWidth: 2,
    strokeDasharray: '6,3', 
    filter: isDark 
      ? 'drop-shadow(0 0 2px #6913e0)'
      : 'drop-shadow(0 0 1px #3b82f6)',
  };

  const defaultEdgeOptions = {
    type: 'smoothstep',
    style: {
      stroke: isDark ? '#6913e0' : '#3b82f6',
      strokeWidth: 2, 
      strokeDasharray: '6,3', 
      filter: isDark 
        ? 'drop-shadow(0 0 2px #6913e0)'
        : 'drop-shadow(0 0 1px #3b82f6)',
    },
    markerEnd: {
      type: 'arrowclosed',
      color: isDark ? '#6913e0' : '#3b82f6',
      width: 16, 
      height: 16, 
    },
    animated: false,
  };

  return (
    <div 
  ref={reactFlowWrapper} 
  style={{ 
    width: '100%', 
    height: '100%',
    backgroundImage: `radial-gradient(circle, ${isDark ? '#6913e0' : '#3b82f6'} 0.5px, transparent 0.5px)`,
    backgroundSize: '20px 20px',
    backgroundPosition: '0 0'
  }}
>
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
        fitView={false} 
        attributionPosition="bottom-left"
        minZoom={0.2} 
        maxZoom={2.5} 
        defaultViewport={{ x: 100, y: 100, zoom: 0.75 }}
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
      >

        <Controls
          showZoom={true}
          showFitView={true}
          showInteractive={true}
          fitViewOptions={{ padding: 0.1, duration: 800 }}
          position="bottom-left"
        />

  
        <MiniMap
          nodeStrokeWidth={2}
          nodeColor={isDark ? '#6913e0' : '#3b82f6'}
          nodeStrokeColor={isDark ? '#a78bfa' : '#93c5fd'}
          nodeBorderRadius={6} 
          maskColor={isDark ? 'rgba(10, 10, 15, 0.6)' : 'rgba(248, 250, 252, 0.6)'}
          maskStrokeColor={isDark ? '#2d1b69' : '#e2e8f0'}
          maskStrokeWidth={1}
          position="bottom-right"
          zoomable
          pannable
          style={{
            width: 180, 
            height: 120,
          }}
        />

        <TopRightControls />
      </ReactFlow>

      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '80px', 
        height: '80px', 
        background: `radial-gradient(circle at top left, ${
          isDark ? 'rgba(105, 19, 224, 0.08)' : 'rgba(59, 130, 246, 0.04)'
        } 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />
      
      <div style={{
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: '80px', 
        height: '80px', 
        background: `radial-gradient(circle at bottom right, ${
          isDark ? 'rgba(105, 19, 224, 0.08)' : 'rgba(59, 130, 246, 0.04)'
        } 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />
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