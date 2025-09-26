import { BaseNode } from './BaseNode.js';
import { useStore } from '../store';

export const ApiNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);

  const nodeConfig = {
    type: 'api',
    title: 'API Call',
    description: 'Make HTTP requests',
    width: 220,
    height: 160,
    fields: [
      {
        name: 'url',
        label: 'URL',
        type: 'text',
        default: 'https://api.example.com',
        placeholder: 'Enter API endpoint'
      },
      {
        name: 'method',
        label: 'Method',
        type: 'select',
        default: 'GET',
        options: [
          { value: 'GET', label: 'GET' },
          { value: 'POST', label: 'POST' },
          { value: 'PUT', label: 'PUT' },
          { value: 'DELETE', label: 'DELETE' }
        ]
      },
      {
        name: 'headers',
        label: 'Headers',
        type: 'textarea',
        default: '{}',
        placeholder: 'JSON headers'
      }
    ],
    inputs: [
      { id: 'data', label: 'Data' },
      { id: 'params', label: 'Params' }
    ],
    outputs: [
      { id: 'response', label: 'Response' },
      { id: 'status', label: 'Status' }
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