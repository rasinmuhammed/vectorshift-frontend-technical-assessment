// ui.js 
// Displays the drag-and-drop UI

import { useState, useRef, useCallback } from 'react';
import ReactFlow, { Controls, Background, MiniMap } from 'reactflow';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';
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

const gridSize = 20;
const proOptions = { hideAttribution: true };
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
});

export const PipelineUI = () => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const {
    nodes,
    edges,
    getNodeID,
    addNode,
    onNodesChange,
    onEdgesChange,
    onConnect
  } = useStore(selector, shallow);

  const getInitNodeData = (nodeID, type) => {
    let nodeData = { id: nodeID, nodeType: `${type}` };
    return nodeData;
  };

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      if (event?.dataTransfer?.getData('application/reactflow')) {
        const appData = JSON.parse(event.dataTransfer.getData('application/reactflow'));
        const type = appData?.nodeType;

        // check if the dropped element is valid
        if (typeof type === 'undefined' || !type) {
          return;
        }

        const position = reactFlowInstance.project({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        });

        const nodeID = getNodeID(type);
        const newNode = {
          id: nodeID,
          type,
          position,
          data: getInitNodeData(nodeID, type),
        };

        addNode(newNode);
      }
    },
    [reactFlowInstance]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  return (
    <div style={{
      height: '70vh',
      background: `
        radial-gradient(ellipse at top, rgba(59, 130, 246, 0.05) 0%, transparent 60%),
        radial-gradient(ellipse at bottom, rgba(147, 51, 234, 0.05) 0%, transparent 60%),
        linear-gradient(180deg, 
          rgba(15, 23, 42, 1) 0%, 
          rgba(30, 41, 59, 1) 25%,
          rgba(51, 65, 85, 1) 50%,
          rgba(30, 41, 59, 1) 75%,
          rgba(15, 23, 42, 1) 100%
        )
      `,
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Sophisticated background elements */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '15%',
        width: '200px',
        height: '200px',
        background: 'radial-gradient(circle, rgba(139, 126, 234, 0.03) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(40px)'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '20%',
        right: '10%',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(196, 181, 253, 0.02) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(60px)'
      }} />

      <div ref={reactFlowWrapper} style={{ width: '100%', height: '100%' }}>
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
          proOptions={proOptions}
          snapGrid={[gridSize, gridSize]}
          connectionLineType='smoothstep'
          connectionLineStyle={{
            stroke: 'rgba(196, 181, 253, 0.6)',
            strokeWidth: 2,
            strokeDasharray: '8,4',
            filter: 'drop-shadow(0 0 4px rgba(196, 181, 253, 0.3))'
          }}
          defaultEdgeOptions={{
            type: 'smoothstep',
            animated: true,
            style: {
              stroke: 'rgba(196, 181, 253, 0.7)',
              strokeWidth: 2,
              strokeDasharray: '8,4',
              filter: 'drop-shadow(0 0 4px rgba(196, 181, 253, 0.3))'
            },
            markerEnd: {
              type: 'arrow',
              color: 'rgba(196, 181, 253, 0.7)',
              width: 20,
              height: 20
            },
          }}
          fitView
          fitViewOptions={{
            padding: 0.1,
            includeHiddenNodes: false
          }}
        >
          <Background 
            color="rgba(148, 163, 184, 0.1)" 
            gap={gridSize}
            size={1}
            style={{
              background: 'transparent'
            }}
          />
          <Controls 
            style={{
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(148, 163, 184, 0.15)',
              borderRadius: '12px',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
            }}
            showZoom={true}
            showFitView={true}
            showInteractive={true}
          />
          <MiniMap 
            style={{
              background: 'rgba(15, 23, 42, 0.9)',
              border: '1px solid rgba(148, 163, 184, 0.15)',
              borderRadius: '8px',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
            }}
            nodeColor={(node) => {
              const colorMap = {
                'customInput': 'rgba(139, 126, 234, 0.8)',
                'customOutput': 'rgba(147, 134, 234, 0.8)',
                'text': 'rgba(167, 139, 250, 0.8)',
                'llm': 'rgba(196, 181, 253, 0.8)',
                'api': 'rgba(183, 148, 244, 0.8)',
                'filter': 'rgba(186, 164, 245, 0.8)',
                'transform': 'rgba(196, 181, 253, 0.8)',
                'database': 'rgba(183, 148, 244, 0.8)',
                'conditional': 'rgba(167, 139, 250, 0.8)'
              };
              return colorMap[node.type] || 'rgba(139, 126, 234, 0.8)';
            }}
            nodeStrokeColor="rgba(196, 181, 253, 0.4)"
            nodeStrokeWidth={2}
            maskColor="rgba(0, 0, 0, 0.7)"
            pannable
            zoomable
          />
        </ReactFlow>
      </div>
    </div>
  )
}