import React from 'react';
import IntroTemplateMinimalist from './introduction/IntroTemplateMinimalist';
import TimelineTemplateMinimalist from './timeline/TimelineTemplateMinimalist';
import TimelineTemplateSpace from './timeline/TimelineTemplateSpace.jsx';
import AboutTemplateMinimalist from './about/AboutTemplateMinimalist';
import AboutTemplateSpace from './about/AboutTemplateSpace.jsx';
import IntroTemplateRedline from './introduction/IntroTemplateRedline';
import ContactTemplateMinimalist from './contact/ContactTemplateMinimalist';
import SplashTemplateSpace from './splash/SplashTemplateSpace.jsx';
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
      name: AboutTemplateSpace.templateName,
      preview: AboutTemplateSpace.preview,
      component: (fields, id) => (<AboutTemplateSpace fields={fields} id={id}/>),
      script: AboutTemplateSpace.script,
      info: AboutTemplateSpace.info,
      defaultField: AboutTemplateSpace.defaultField
    },
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
    },
    {
      name: TimelineTemplateSpace.templateName,
      preview: TimelineTemplateSpace.preview,
      component: (fields, id) => (<TimelineTemplateSpace fields={fields} id={id}/>),
      script: TimelineTemplateSpace.script,
      info: TimelineTemplateSpace.info,
      defaultField: TimelineTemplateSpace.defaultField
    }
  ],
  contact: [
    {
      name: ContactTemplateMinimalist.templateName,
      preview: ContactTemplateMinimalist.preview,
      component: (fields, id) => (<ContactTemplateMinimalist fields={fields} id={id}/>),
      script: ContactTemplateMinimalist.script,
      info: ContactTemplateMinimalist.info,
      defaultField: ContactTemplateMinimalist.defaultField
    }
  ],
  splash: [
    {
      name: SplashTemplateSpace.templateName,
      preview: SplashTemplateSpace.preview,
      component: (fields, id) => (<SplashTemplateSpace fields={fields} id={id}/>),
      script: SplashTemplateSpace.script,
      info: SplashTemplateSpace.info,
      defaultField: SplashTemplateSpace.defaultField
    }
  ]
}