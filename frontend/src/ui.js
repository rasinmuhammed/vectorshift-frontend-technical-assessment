// frontend/src/ui.js
import { useRef, useCallback } from 'react';
import ReactFlow, { Controls, Background, MiniMap } from 'reactflow';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';
import { useTheme } from './App'; // Import useTheme

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

export const PipelineUI = () => {
  const reactFlowWrapper = useRef(null);
  const { isDark } = useTheme(); // Get theme state

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

  return (
    <div className="pipeline-canvas" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onInit={setReactFlowInstance}
        nodeTypes={nodeTypes}
        proOptions={{ hideAttribution: true }}
        connectionLineStyle={{
          stroke: isDark ? '#94a3b8' : '#a1a1aa',
          strokeWidth: 2,
        }}
        defaultEdgeOptions={{
          type: 'smoothstep',
          style: {
            stroke: isDark ? '#64748b' : '#9ca3af',
            strokeWidth: 2,
          },
          markerEnd: {
            type: 'arrowclosed',
            color: isDark ? '#64748b' : '#9ca3af',
          },
        }}
        fitView
      >
        {/* Background dots */}
        <Background
          variant="dots"
          gap={24}
          size={1}
          color={isDark ? '#8b5cf6' : '#374151'}
        />

        {/* Controls fixed bottom-left */}
        <Controls />

        {/* MiniMap fixed above controls bottom-left */}
        <MiniMap nodeStrokeWidth={3} zoomable pannable />
      </ReactFlow>
    </div>
  );
};
