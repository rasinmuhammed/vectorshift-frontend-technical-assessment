import { BaseNode } from './BaseNode.js';
import { useStore } from '../store';

export const InputNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);

  const nodeConfig = {
    type: 'input',
    title: 'Input',
    description: 'Data input source',
    width: 200,
    height: 140, 
    fields: [
      {
        name: 'inputName',
        label: 'Input Name',
        type: 'text',
        default: id.replace('customInput-', 'input_'),
        placeholder: 'Enter input name'
      },
      {
        name: 'inputType',
        label: 'Data Type',
        type: 'select',
        default: 'Text',
        options: [
          { value: 'Text', label: 'Text' },
          { value: 'File', label: 'File' },
          { value: 'Number', label: 'Number' },
          { value: 'Boolean', label: 'Boolean' },
          { value: 'Array', label: 'Array' },
          { value: 'Object', label: 'Object' }
        ]
      },
      {
        name: 'defaultValue',
        label: 'Default Value',
        type: 'textarea',
        default: '',
        placeholder: 'Enter default value (optional)'
      },
      {
        name: 'required',
        label: 'Required',
        type: 'select',
        default: 'false',
        options: [
          { value: 'false', label: 'No' },
          { value: 'true', label: 'Yes' }
        ]
      }
    ],
    inputs: [], 
    outputs: [
      { id: 'value', label: 'Value' },
      { id: 'metadata', label: 'Metadata' }
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