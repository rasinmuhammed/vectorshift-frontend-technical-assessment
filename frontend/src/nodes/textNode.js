import { BaseNode } from './BaseNode.js';
import { useStore } from '../store';

export const TextNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);

  const nodeConfig = {
    type: 'text',
    title: 'Text',
    description: 'Text processing and templating',
    width: 200,
    height: 100,
    fields: [
      {
        name: 'text',
        label: 'Text',
        type: 'textarea',
        default: '{{input}}',
        placeholder: 'Enter text with variables like {{variable}}'
      }
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
