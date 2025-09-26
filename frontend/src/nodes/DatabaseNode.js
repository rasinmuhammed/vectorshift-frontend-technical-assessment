import { BaseNode } from './BaseNode.js';
import { useStore } from '../store';

export const DatabaseNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);

  const nodeConfig = {
    type: 'database',
    title: 'Database',
    description: 'Database operations',
    width: 200,
    height: 160,
    fields: [
      {
        name: 'operation',
        label: 'Operation',
        type: 'select',
        default: 'select',
        options: [
          { value: 'select', label: 'SELECT' },
          { value: 'insert', label: 'INSERT' },
          { value: 'update', label: 'UPDATE' },
          { value: 'delete', label: 'DELETE' }
        ]
      },
      {
        name: 'table',
        label: 'Table',
        type: 'text',
        default: 'users',
        placeholder: 'Table name'
      },
      {
        name: 'query',
        label: 'Query',
        type: 'textarea',
        default: 'SELECT * FROM users',
        placeholder: 'SQL query'
      }
    ],
    inputs: [
      { id: 'params', label: 'Parameters' }
    ],
    outputs: [
      { id: 'result', label: 'Result' }
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