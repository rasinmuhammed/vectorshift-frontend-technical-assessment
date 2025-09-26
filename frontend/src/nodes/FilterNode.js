import { BaseNode } from './BaseNode.js';
import { useStore } from '../store';

export const FilterNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);

  const nodeConfig = {
    type: 'filter',
    title: 'Filter',
    description: 'Filter data based on conditions',
    width: 200,
    height: 140,
    fields: [
      {
        name: 'condition',
        label: 'Condition',
        type: 'select',
        default: 'equals',
        options: [
          { value: 'equals', label: 'Equals' },
          { value: 'contains', label: 'Contains' },
          { value: 'greater_than', label: 'Greater Than' },
          { value: 'less_than', label: 'Less Than' }
        ]
      },
      {
        name: 'value',
        label: 'Value',
        type: 'text',
        default: '',
        placeholder: 'Comparison value'
      }
    ],
    inputs: [
      { id: 'input', label: 'Input' }
    ],
    outputs: [
      { id: 'passed', label: 'Passed' },
      { id: 'failed', label: 'Failed' }
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