 import React, { Component } from 'react';
 import { withStyles } from '@material-ui/core/styles';
 import EntryEditor from './EntryEditor';
 import IntroTemplateMinimalist from '../templates/introduction/IntroTemplateMinimalist';

//  TODO: rename to templates?
/**
 * @file EntryEditor component to provide a user interface for users to style their entries
 * 
 * @author Chuan Hao
 * 
 * @see EntryGenerator
 */
export const templates = {
  introduction: [
    {
      name: IntroTemplateMinimalist.templateName, 
      component: (fields, id) => (<IntroTemplateMinimalist fields={fields} id={id}/>),
      script: (index) => "",
      info: IntroTemplateMinimalist.info,
      defaultField: IntroTemplateMinimalist.defaultField
    }
  ]
}