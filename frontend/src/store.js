import { create } from 'zustand';
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  MarkerType,
} from 'reactflow';

const useStore = create((set, get) => ({
  nodes: [],
  edges: [],
  nodeIDs: {},
  reactFlowInstance: null,

  setReactFlowInstance: (instance) => {
    set({ reactFlowInstance: instance });
  },

  getNodeID: (type) => {
    const newIDs = { ...get().nodeIDs };
    if (newIDs[type] === undefined) {
      newIDs[type] = 0;
    }
    newIDs[type] += 1;
    set({ nodeIDs: newIDs });
    return `${type}-${newIDs[type]}`;
  },

  addNode: (node) => {
    set({
      nodes: [...get().nodes, node],
    });
  },

  deleteNode: (nodeId) => {
    const { nodes, edges } = get();
    
    // Remove the node
    const updatedNodes = nodes.filter(node => node.id !== nodeId);
    
    // Remove all edges connected to this node
    const updatedEdges = edges.filter(edge => 
      edge.source !== nodeId && edge.target !== nodeId
    );
    
    set({
      nodes: updatedNodes,
      edges: updatedEdges,
    });
  },

  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },

  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  onConnect: (connection) => {
    const edge = {
      ...connection,
      type: 'smoothstep',
      animated: false,
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 16,
        height: 16,
      },
      style: {
        strokeWidth: 2,
        strokeDasharray: '6,3',
      },
    };
    set({
      edges: addEdge(edge, get().edges),
    });
  },

  updateNodeField: (nodeId, fieldName, fieldValue) => {
    const { nodes } = get();
    const updatedNodes = nodes.map((node) => {
      if (node.id === nodeId) {
        return {
          ...node,
          data: {
            ...node.data,
            [fieldName]: fieldValue,
          },
        };
      }
      return node;
    });
    set({ nodes: updatedNodes });
  },
  
  updateNodeDimensions: (nodeId, dimensions) => {
    const { nodes } = get();
    const updatedNodes = nodes.map((node) => {
      if (node.id === nodeId) {
        return {
          ...node,
          style: { ...node.style, ...dimensions },
        };
      }
      return node;
    });
    set({ nodes: updatedNodes });
  },


  // Helper function to get all nodes and edges for export/validation
  getFlow: () => {
    const { nodes, edges } = get();
    return { nodes, edges };
  },

  // Clear all nodes and edges
  clearFlow: () => {
    set({
      nodes: [],
      edges: [],
      nodeIDs: {},
    });
  },

  // Load a flow (useful for importing)
  loadFlow: (flowData) => {
    if (flowData.nodes && flowData.edges) {
      set({
        nodes: flowData.nodes,
        edges: flowData.edges,
      });
    }
  },

  // Get node by ID
  getNode: (nodeId) => {
    const { nodes } = get();
    return nodes.find(node => node.id === nodeId);
  },

  // Update entire node
  updateNode: (nodeId, updates) => {
    const { nodes } = get();
    const updatedNodes = nodes.map((node) => {
      if (node.id === nodeId) {
        return {
          ...node,
          ...updates,
        };
      }
      return node;
    });
    set({ nodes: updatedNodes });
  },
}));

export { useStore };