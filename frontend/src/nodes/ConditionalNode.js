import { BaseNode } from './BaseNode.js';
import { useStore } from '../store';

export const ConditionalNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);

  const nodeConfig = {
    type: 'conditional',
    title: 'Conditional',
    description: 'Conditional logic branching',
    width: 200,
    height: 120,
    fields: [
      {
        name: 'condition',
        label: 'Condition',
        type: 'text',
        default: 'input > 0',
        placeholder: 'Boolean expression'
      }
    ],
    inputs: [
      { id: 'input', label: 'Input' }
    ],
    outputs: [
      { id: 'true', label: 'True' },
      { id: 'false', label: 'False' }
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