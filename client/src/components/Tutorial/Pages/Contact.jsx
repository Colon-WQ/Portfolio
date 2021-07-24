import React, { Component } from 'react';
import { Typography, withStyles } from "@material-ui/core";
import Divider from '@material-ui/core/Divider';
import { Link } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import formspree_dashboard from '../../../res/assets/tutorials/formspree_dashboard.JPG';
import formspree_project from '../../../res/assets/tutorials/formspree_project.png';

class Contact extends Component {
  static topic = 'Adding contact forms';

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Typography variant='h2' component='h2'>HTML contact forms</Typography>
        <Typography variant='body1' component='body1'>Having HTML forms allow visitors to write a message or fill a survey and send the data to you.</Typography>
        <Typography variant='body1' component='body1'>
          Usually you might need a server to process such requests, however in this case we shall use <a href="https://formspree.io">Formspree</a>.
        </Typography>
        <Divider orientation="horizontal" className={classes.divider} />
        <Typography variant='h5' component='h2'>
          Getting started
        </Typography>
        <ul className={classes.list}>
          <li>Register for a formspree account via this link: <a href="https://formspree.io">Formspree</a></li>
          <li>Once done, verify your email, then log in to formspree. You should see your dashboard, shown below.</li>
          <div className={classes.imageContainer}>
            <img src={formspree_dashboard} alt="formspree dashboard" />
          </div>
          <li>
            {`Create a new form by clicking on the "New Form" button. 
          You will be redirected to the project page, seen below.
          Copy down the endpoint as circled in the image.`}
          </li>
          <div className={classes.imageContainer}>
            <img src={formspree_project} alt="formspree project page" />
          </div>
          <li>Open your existing web page's index.html in your editor. You can generate one for free via our <Link component={RouterLink} to='/edit'>website builder</Link> if you do not have one.</li>
          <li>Add the following element inside your body tag. Replace YOUR_ENDPOINT with your endpoint from step 3.</li>
          <div className={classes.codeDiv}>
            <p className={classes.multiline}>
              {`<form
  action=YOUR_ENDPOINT
  method="POST"
>
  <label>
    Your email:
    <input type="email" name="_replyto">
  </label>
  <label>
    Your message:
    <textarea name="message"></textarea>
  </label>
  <button type="submit">Send</button>
</form> `}
            </p>
          </div>
          <li>Your html file should look like this:</li>
          <div className={classes.codeDiv}>
            <p className={classes.multiline}>
              {`
              <!DOCTYPE html>
<html>
<head>
<link href="styles.css" rel="stylesheet">
<script defer src="scripts.js"></script>
<title>Page Title</title>
</head>
<body>
<!-- your other elements -->
<form
  action=YOUR_ENDPOINT
  method="POST"
>
  <label>
    Your email:
    <input type="email" name="_replyto">
  </label>
  <label>
    Your message:
    <textarea name="message"></textarea>
  </label>
  <button type="submit">Send</button>
</form>
</body>
</html>`}
            </p>
          </div>
          <li>Your web page should now have a form you can use to submit a message from.</li>
        </ul>
        <Divider orientation="horizontal" className={classes.divider} />
        <Typography variant='h5' component='h2'>
          Explanation
        </Typography>
        <ul className={classes.list}>
          <li>{`<form action=YOUR_ENDPOINT method="POST"> wraps the entire form and tells the browser where to send the messages to.`}</li>
          <li>{`<label> Your email: <input type="email" name="_replyto"> </label> adds a new field "_replyto", and populates it with user input.`}</li>
          <li>{`For instance, if you wanted to add a comments field, you would add:`}</li>
          <div className={classes.codeDiv}>
            <p className={classes.multiline}>{`
          <label>
    Comments:
    <textarea name="comments"></textarea>
  </label>`}</p>
          </div>
        </ul>
      </div>
    )
  }
}

export default (Contact);