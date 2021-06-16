import React, { Component } from 'react';
import IntroTemplateMinimalist from './introduction/IntroTemplateMinimalist';
import TimelineTemplateMinimalist from './timeline/TimelineTemplateMinimalist';
import AboutTemplateMinimalist from './about/AboutTemplateMinimalist';
import IntroTemplateRedline from './introduction/IntroTemplateRedline';
//  TODO: rename to templates?
/**
 * @file EntryEditor component to provide a user interface for users to style their entries
 * 
 * @author Chuan Hao
 * 
 * @see templates
 */
export const templates = {
  introduction: [
    {
      name: IntroTemplateMinimalist.templateName, 
      preview: IntroTemplateMinimalist.preview,
      component: (fields, id) => (<IntroTemplateMinimalist fields={fields} id={id}/>),
      script: IntroTemplateMinimalist.script,
      info: IntroTemplateMinimalist.info,
      defaultField: IntroTemplateMinimalist.defaultField
    },
    {
      name: IntroTemplateRedline.templateName, 
      preview: IntroTemplateRedline.preview,
      component: (fields, id) => (<IntroTemplateRedline fields={fields} id={id}/>),
      script: IntroTemplateRedline.script,
      info: IntroTemplateRedline.info,
      defaultField: IntroTemplateRedline.defaultField
    },
  ],
  about: [
    {
      name: AboutTemplateMinimalist.templateName,
      preview: AboutTemplateMinimalist.preview,
      component: (fields, id) => (<AboutTemplateMinimalist fields={fields} id={id}/>),
      script: AboutTemplateMinimalist.script,
      info: AboutTemplateMinimalist.info,
      defaultField: AboutTemplateMinimalist.defaultField
    }
  ],
  timeline: [
    {
      name: TimelineTemplateMinimalist.templateName,
      preview: TimelineTemplateMinimalist.preview,
      component: (fields, id) => (<TimelineTemplateMinimalist fields={fields} id={id}/>),
      script: TimelineTemplateMinimalist.script,
      info: TimelineTemplateMinimalist.info,
      defaultField: TimelineTemplateMinimalist.defaultField
    }
  ]
}