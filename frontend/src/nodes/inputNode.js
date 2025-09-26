import { BaseNode } from './BaseNode.js';
import { useStore } from '../store';

// Input Node
export const InputNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);

  const nodeConfig = {
    type: 'input',
    title: 'Input',
    description: 'Data input source',
    width: 200,
    height: 120,
    fields: [
      {
        name: 'inputName',
        label: 'Name',
        type: 'text',
        default: id.replace('customInput-', 'input_'),
        placeholder: 'Enter input name'
      },
      {
        name: 'inputType',
        label: 'Type',
        type: 'select',
        default: 'Text',
        options: [
          { value: 'Text', label: 'Text' },
          { value: 'File', label: 'File' },
          { value: 'Number', label: 'Number' },
          { value: 'Boolean', label: 'Boolean' }
        ]
      }
    ],
    outputs: [
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