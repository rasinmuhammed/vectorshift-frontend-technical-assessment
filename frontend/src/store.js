import { create } from "zustand";
import {
    addEdge,
    applyNodeChanges,
    applyEdgeChanges,
    MarkerType,
  } from 'reactflow';

export const useStore = create((set, get) => ({
    nodes: [],
    edges: [],
    nodeIDs: {}, // FIX: This was missing, causing errors when creating new IDs.
    reactFlowInstance: null, // FIX: We need to store the instance to calculate drop positions.

    // Action to set the React Flow instance once it's initialized.
    setReactFlowInstance: (instance) => set({ reactFlowInstance: instance }),

    getNodeID: (type) => {
        const newIDs = {...get().nodeIDs};
        if (newIDs[type] === undefined) {
            newIDs[type] = 0;
        }
        newIDs[type] += 1;
        set({nodeIDs: newIDs});
        return `${type}-${newIDs[type]}`;
    },
    addNode: (node) => {
        set({
            nodes: [...get().nodes, node]
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
      set({
        edges: addEdge({
          ...connection, 
          type: 'smoothstep', 
          animated: false, // Disabling animation for a cleaner look
          style: get().isDark 
            ? { stroke: '#64748b', strokeWidth: 2 }
            : { stroke: '#9ca3af', strokeWidth: 2 },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: get().isDark ? '#64748b' : '#9ca3af',
          }
        }, get().edges),
      });
    },
    updateNodeField: (nodeId, fieldName, fieldValue) => {
      set({
        nodes: get().nodes.map((node) => {
          if (node.id === nodeId) {
            // This ensures data is properly initialized if it doesn't exist
            const data = node.data ? { ...node.data } : {};
            data[fieldName] = fieldValue;
            node.data = data;
          }
          return node;
        }),
      });
    },
}));
