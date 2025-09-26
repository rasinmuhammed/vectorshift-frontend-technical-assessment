import { BaseNode } from './BaseNode.js';
import { useStore } from '../store';

export const OutputNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);

  const nodeConfig = {
    type: 'output',
    title: 'Output',
    description: 'Data output destination',
    width: 200,
    height: 120,
    fields: [
      {
        name: 'outputName',
        label: 'Name',
        type: 'text',
        default: id.replace('customOutput-', 'output_'),
        placeholder: 'Enter output name'
      },
      {
        name: 'outputType',
        label: 'Type',
        type: 'select',
        default: 'Text',
        options: [
          { value: 'Text', label: 'Text' },
          { value: 'File', label: 'File' },
          { value: 'Image', label: 'Image' },
          { value: 'JSON', label: 'JSON' }
        ]
      }
    ],
    inputs: [
      { id: 'value', label: 'Value' }
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