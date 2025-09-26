import { BaseNode } from './BaseNode.js';
import { useStore } from '../store';

export const LLMNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);

  const nodeConfig = {
    type: 'llm',
    title: 'LLM',
    description: 'Large Language Model',
    width: 220,
    height: 140,
    fields: [
      {
        name: 'model',
        label: 'Model',
        type: 'select',
        default: 'gpt-3.5-turbo',
        options: [
          { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
          { value: 'gpt-4', label: 'GPT-4' },
          { value: 'claude-3', label: 'Claude 3' }
        ]
      },
      {
        name: 'temperature',
        label: 'Temperature',
        type: 'text',
        default: '0.7',
        placeholder: '0.0 - 1.0'
      }
    ],
    inputs: [
      { id: 'system', label: 'System' },
      { id: 'prompt', label: 'Prompt' }
    ],
    outputs: [
      { id: 'response', label: 'Response' }
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