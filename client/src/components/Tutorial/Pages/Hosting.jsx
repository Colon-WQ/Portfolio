import React, { Component } from 'react';
import { Typography, withStyles } from "@material-ui/core";
import Divider from '@material-ui/core/Divider';
import addFile from '../../../res/assets/tutorials/addFile.png';
import settings from '../../../res/assets/tutorials/settings.png';
import pages from '../../../res/assets/tutorials/pages.png';

class Hosting extends Component {
  static topic = 'Hosting static pages';

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <span className={classes.topSpace} />
        <Typography variant='h2' component='h2'>Hosting static pages</Typography>
        <Typography variant='body1' component='body1'>
          All you need for your static page is your .html, .js and .css file. You may get these either from our website builder, or by writing one for yourself.
        </Typography>

        <Typography className={classes.header} variant='h5' component='h5'>Hosting using Github</Typography>
        <Divider orientation="horizontal" className={classes.divider} />

        <Typography className={classes.subHeader} variant='h6' component='h6'>1. Downloading the zip files for your Portfolio website</Typography>
        <ul className={classes.list}>
          <li>Create your portfolio and once done, click on the Publish button as a Guest.</li>
          <li>A zip file named after your portfolio name will be downloaded.</li>
          <li>Open and extract the contents of the zip file to a temporary location on your computer. Remember where you stored it, you'll need to access the file contents later.</li>
        </ul>
        <Typography className={classes.subHeader} variant='h6' component='h6'>2. Uploading files to Github repository</Typography>
        <ul className={classes.list}>
          <li>Login to your Github account, then create a new Github repository.</li>
          <div className={classes.nestedList}>
            <li>
              You would have to provide a name for the Github repository. If you are unsure,
              we recommend you to name it your-github-username.github.io, where your-github-username is your Github account username.
              </li>
            <li>If you name it as your-github-username.github.io, then your portfolio website will be created at https://your-github-username.github.io later</li>
            <li>You may also name your repository as other names, like for example "skills".</li>
            <li>If you name it as "skills", then your portfolio website will be created at https://your-github-username.github.io/skills later</li>
          </div>
          <li>Once the Github repository is created, click on it to open your repository page.</li>
          <li>Click on Add File button and then in the dropdown, click on upload files.</li>
          <div className={classes.imageContainer}>
            <img src={addFile} alt="Add File example" />
          </div>
          <li>Upload the contents of the zip file you had previously extracted into the Github repository. Take note that you can only upload one file at a time in this wayy.</li>
          <li>After uploading, make sure that the contents of the Github repository is the exact same as that of the zip file.</li>
        </ul>

        <Typography className={classes.subHeader} variant='h6' component='h6'>3. Deploying Github Page</Typography>
        <ul className={classes.list}>
          <li>At this point, you should have uploaded the file contents of the zip file you had downloaded to a Github repository of your choice.</li>
          <li>Open the Github repository that you have uploaded the file contents to.</li>
          <li>Click on the Settings tab.</li>
          <div className={classes.imageContainer}>
            <img src={settings} alt="settings example" />
          </div>
          <li>You will see a column of options. Click on Pages.</li>
          <div className={classes.imageContainer}>
            <img src={pages} alt="pages example" />
          </div>
          <li>Under Source, you will see None with a expand down button. Click on it and select main branch.</li>
          <li>To the immediate right, you'll see a folder button. Change it to "root" if it isn't already "root"</li>
          <li>Click on Save and wait on the same page while the Github Page for your Github repository is being built.</li>
          <li>Once built, a link will be provided for you. Click on it to be taken to your portfolio website.</li>
        </ul>

        <span className={classes.listEnd} />
        <Divider orientation="horizontal" className={classes.divider} />

        <Typography className={classes.header} variant='h5' component='h5'>Hosting using InfinityFree</Typography>
        <Divider orientation="horizontal" className={classes.divider} />

        <Typography className={classes.subHeader} variant='h6' component='h6'>1. Downloading the zip files for your Portfolio website</Typography>
        <ul className={classes.list}>
          <li>Create your portfolio and once done, click on the Publish button as a Guest.</li>
          <li>A zip file named after your portfolio name will be downloaded.</li>
          <li>Open and extract the contents of the zip file to a temporary location on your computer. Remember where you stored it, you'll need to access the file contents later.</li>
        </ul>

        <Typography className={classes.subHeader} variant='h6' component='h6'>2. Set up an InfinityFree account</Typography>
        <ul className={classes.list}>
          <li>Visit infinityfree.net and register for an InfinityFree account.</li>
          <li>Login using your InfinityFree account. You will see an Accounts page.</li>
          <li>Click on NEW ACCOUNT to create a new management account for your portfolio website.</li>
          <li>
            Under Free Subdomain, provide a name for your portfolio website.
            Take note that the name is subject to availability in InfinityFree's pool of free subdomains. You may have to change your portfolio website name.
            </li>
          <li>Once done, click CREATE ACCOUNT and your website will take a while to be created at the subdomain that you provided.</li>
          <li>For now, return to your Accounts page, you will see that the management account is showing "pending creation".</li>
          <li>Refresh the page from time to time until it shows "active", meaning that the website is created.</li>
        </ul>

        <Typography className={classes.subHeader} variant='h6' component='h6'>3. Connecting to your portfolio website server</Typography>
        <ul className={classes.list}>
          <li>In the Accounts page, click on your management account.</li>
          <li>Scroll down to see the FTP Details. You will need this to connect to your portfolio website server.</li>
          <li>You will need to download FileZilla at <a href="https://filezilla-project.org/" target="_blank" rel="noopener noreferrer">https://filezilla-project.org/</a>. Choose to download FileZilla Client.</li>
          <li>Run FileZilla. Under File tab, click on Site Manager.</li>
          <li>Click on New Site and give it a name. For example, your portfolio website name.</li>
          <li>Head back to your InfinityFree Accounts page, copy the FTP Hostname from under FTP Details and input it in the Host text box in FileZilla.</li>
          <li>Then, copy the FTP Portname from under FTP Details and input it in the Port text box in FileZilla.</li>
          <li>In FileZilla, under Logon Type, change it to Normal. You will see that a username and password is required.</li>
          <li>
            Head back to your InfinityFree Accounts page, copy the FTP username and FTP
            password from under FTP Details and input it in the username and password text box in FileZilla respectively.
            </li>
          <li>Click on Connect button. A dialog will show. Click OK to trust the server's certificate and proceed with the connection.</li>
        </ul>

        <Typography className={classes.subHeader} variant='h6' component='h6'>4. Uploading files to your portfolio website server</Typography>
        <ul className={classes.list}>
          <li>You are now connected to your portfolio website server. You will see a file directory in the bottom right of the FileZilla interface.</li>
          <li>Open the htdocs folder by clicking on it. You will see an index2.html file and another file with name "file for your website should be uploaded here"</li>
          <li>Open the folder in which you extracted your portfolio zip file to. Select all the contents in the folder and drag it into the htdocs folder.</li>
          <li>Upload will then begin. It will be completed when you see a Transfer finished message.</li>
          <li>Return to your InfinityFree Accounts page, check and refresh till your management account shows "active". This means that your portfolio website is updated.</li>
          <li>Visit your portfolio website and you will see the portfolio that you designed on Resumate.</li>
        </ul>

        <span className={classes.listEnd} />
        <Divider orientation="horizontal" className={classes.divider} />

        <Typography className={classes.header} variant='h5' component='h5'>Hosting using other services</Typography>

        <ul className={classes.list}>
          <li>You are free to explore other options other than Github and InfinityFree to host your portfolio website for free.</li>
          <li>You can visit this website at <a href="https://themeisle.com/blog/best-free-website-hosting/" target="_blank" rel="noopener noreferrer">https://themeisle.com/blog/best-free-website-hosting/</a> to view other free website hosting services.</li>
          <li>However, we will not be able to provide guides to cover all these other options but set up guides are usually provided in good detail by these services.</li>
        </ul>
        <span className={classes.listEnd} />
        <Divider orientation="horizontal" className={classes.divider} />

        <span className={classes.bottomSpace} />
      </div>
    )
  }
}

export default (Hosting);