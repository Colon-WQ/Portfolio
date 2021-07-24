import React, { Component } from 'react';
import { Typography, withStyles } from "@material-ui/core";
import Divider from '@material-ui/core/Divider';

class Introduction extends Component {
  static topic = 'Introduction to web development';

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Typography variant='h2' component='h1'>Introduction to web development</Typography>
        <Typography variant='body1' component='body1'>
          Most websites consist of 3 main components:
        </Typography>
        <ul className={classes.list}>
          <li>HTML document, defining the structure of a page</li>
          <li>CSS file, defining how the HTML elements should be displayed</li>
          <li>Javascript file, defining programming logic/ user interactions within the page</li>
        </ul>
        <Divider orientation="horizontal" className={classes.divider} />
        <Typography variant='h5' component='h2'>
          HTML files
        </Typography>
        <Typography variant='body1' component='body1'>
          A typical html file would look as such:
        </Typography>
        <div className={classes.codeDiv}>
          <p className={classes.multiline}>
            {`<!DOCTYPE html>
<html>
<head>
<link href="styles.css" rel="stylesheet">
<script defer src="scripts.js"></script>
<title>Page Title</title>
</head>
<body>
<p>text</p>
</body>
</html> `}
          </p>
        </div>
        <Typography variant='body1' component='body1'>
          The purpose of each element is as follows:
        </Typography>
        <ul className={classes.list}>
          <li>{`<!DOCTYPE html>: declares the document as a HTML file`}</li>
          <li>{`<html>: The root element of the current page`}</li>
          <li>{`<head>: A space in which additional information can be defined, such as below:`}</li>
          <div className={classes.nestedList}>
            <li>{`<title>: The title as seen on your browser tab:`}</li>
            <li>{`<link href="styles.css" rel="stylesheet">: A link importing your CSS styles, explained later`}</li>
            <li>{`<script defer src="scripts.js"></script>: Script tag importing functions/logic from your javascript file, as explained later`}</li>
          </div>
          <li>{`<body>: A tag that wraps around all components that need to be rendered`}</li>
          <li>{`<p>: An example of a html element, in this case a (p)aragraph`}</li>
        </ul>
        <Typography variant='body1' component='body1'>
          {`Notice that each tag has a end tag with a / in front of its component name, such as </p> from a <p> element. 
          This is to allow the browser to determine the hierachy of each element`}
        </Typography>
        <Divider orientation="horizontal" className={classes.divider} />
        <Typography variant='h5' component='h2'>
          CSS files
        </Typography>
        <Typography variant='body1' component='body1'>
          A typical css file might look as such:
        </Typography>
        <div className={classes.codeDiv}>
          <p className={classes.multiline}>
            {`button {
  background-color: #ff0000
},
button:hover {
  background-color: #ffff00
}
.custom {
  background-color: #ff00ff
} `}
          </p>
        </div>
        <Typography variant='body1' component='body1'>
          Each html element inherits the styles as follows:
        </Typography>
        <ul className={classes.list}>
          <li>{`button {...} and button:hover {...} define how each <button> element appears.
          :hover denotes the style <button> takes on when a user hovers over a button, seen below`}</li>
          <button
            style={{ backgroundColor: '#f00' }}
            onMouseEnter={e => { e.target.style.backgroundColor = '#ff0' }}
            onMouseLeave={e => { e.target.style.backgroundColor = '#f00' }}
          >Hover me</button>
          <li>{`.custom {...} define how an element with the class name 'custom' should look, such as <div class="custom"/>, seen below`}</li>
          <div style={{ backgroundColor: '#f0f', width: '10ch', height: '3ch' }} />
        </ul>
        <Divider orientation="horizontal" className={classes.divider} />
        <Typography variant='h5' component='h2'>
          JS files
        </Typography>
        <Typography variant='body1' component='body1'>
          Javascript files control the functionality of a webpage.
        </Typography>
        <Typography variant='body1' component='body1'>
          For instance, say you wish to make a button display a message. One way to go about this is as follows:
        </Typography>
        <div className={classes.codeDiv}>
          <p className={classes.multiline}>
            {`const button = document.getElementById("myButton");
button.onclick=() => alert("message");`}
          </p>
        </div>
        <ul className={classes.list}>
          <li>{`const button = document.getElementById("myButton"); gets the element with id "myButton" and stores it as a constant named button`}</li>
          <li>{`button.onclick=() => alert("message"); now changes the onclick behaviour of "button" to a function, () => alert("message")`}</li>
          <li>{`when "myButton" is clicked, the function then executes, and alert("message") creates the dialog`}</li>
          <button onClick={() => alert("message")}>Try me</button>
        </ul>
      </div>

    )
  }
}

export default (Introduction);