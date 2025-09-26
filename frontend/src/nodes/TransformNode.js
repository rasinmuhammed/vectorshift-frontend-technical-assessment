import { BaseNode } from './BaseNode.js';
import { useStore } from '../store';

export const TransformNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);

  const nodeConfig = {
    type: 'transform',
    title: 'Transform',
    description: 'Transform data structure',
    width: 220,
    height: 140,
    fields: [
      {
        name: 'operation',
        label: 'Operation',
        type: 'select',
        default: 'map',
        options: [
          { value: 'map', label: 'Map' },
          { value: 'reduce', label: 'Reduce' },
          { value: 'filter', label: 'Filter' },
          { value: 'sort', label: 'Sort' }
        ]
      },
      {
        name: 'expression',
        label: 'Expression',
        type: 'textarea',
        default: 'item => item',
        placeholder: 'Transformation expression'
      }
    ],
    inputs: [
      { id: 'input', label: 'Input' }
    ],
    outputs: [
      { id: 'output', label: 'Output' }
    ]
  };

  return (
    <BaseNode
      id={id}
      data={data}
      nodeConfig={nodeConfig}
      onDataChange={updateNodeField}
    />
  );
};