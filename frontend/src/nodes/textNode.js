import React, { useMemo } from 'react';
import { BaseNode } from './BaseNode.js';
import { useStore } from '../store';

// A regex to find all occurrences of {{variableName}}
const variableRegex = /\{\{([a-zA-Z_][a-zA-Z0-9_]*)\}\}/g;

export const TextNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);

  const dynamicInputs = useMemo(() => {
    const text = data.text || '';
    const matches = [...text.matchAll(variableRegex)];
    const uniqueVariables = new Set(matches.map(match => match[1]));
    return Array.from(uniqueVariables).map(variable => ({ id: `var-${variable}`, label: variable }));
  }, [data.text]);

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
   
    inputs: [
        ...dynamicInputs
    ],
    outputs: [
      { id: 'output', label: 'Output' }
    ],

    variables: dynamicInputs.map(input => input.label),
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