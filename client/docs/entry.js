
    window.reactComponents = {};

    window.vueComponents = {};

  
      import React from "react";

      import ReactDOM from "react-dom";


      import ReactWrapper from '../node_modules/better-docs/lib/react-wrapper.js';

      window.React = React;

      window.ReactDOM = ReactDOM;

      window.ReactWrapper = ReactWrapper;

    
    import './styles/reset.css';

    import './styles/iframe.css';

  import Component0 from '../src/components/dashboard.component.js';
reactComponents['Dashboard'] = Component0;

import Component1 from '../src/components/home.component.js';
reactComponents['Home'] = Component1;

import Component2 from '../src/components/login-result.component.js';
reactComponents['LoginResult'] = Component2;

import Component3 from '../src/components/navbar.component.js';
reactComponents['Navbar'] = Component3;