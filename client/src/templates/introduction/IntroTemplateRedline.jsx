import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';
import { withStyles } from '@material-ui/core/styles';
import { IconButton } from '@material-ui/core';

const styles = (theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    padding: '15vh'
  },
  std: { display: 'block' },
  title: {
    margin: '5%'
  },
  socialButton: {
    height: '7vh',
    width: '7vh',
    borderRadius: '50%',
    opacity: '60%',
    marginInline: '0.5vh',
    '&:hover': {
      opacity: '80%',
      width: '9vh',
      height: '9vh'
    }
  },
  socialIcon: {
    height: '5vh',
    width: '5vh',
    borderRadius: '50%'
  }
});

class IntroTemplateRedline extends Component {
  constructor() {
    super();
  }

  static templateName = "Redline";

  static script = (index) => "";

  // static preview = "https://bit.ly/3fwsFKX";

  static info = {
    fonts: { titleFont: { label: 'title font' } },
    colours: { primary: { label: 'primary' }, secondary: { label: 'secondary' } },
    images: { bg: { label: 'Entry background', allowColour: true } },
    texts: { name: { label: 'Your name' }, status: { label: 'Your current status' } },
    sections: {
      enabled: true,
      defaultEntry: {
        images: { socialIcon: 'https://bit.ly/3c3wsNL' },
        texts: { socialLink: 'https://github.com' }
      },
      entryFormat: {
        images: { socialIcon: { label: 'Icon', allowColour: true } },
        texts: { socialLink: { label: 'Link' } }
      }
    }
  };

  static defaultField = {
    width: '100%',
    height: 'fit-content',
    fonts: { titleFont: 'Roboto' },
    colours: { primary: '#dd0000', secondary: '#FFFFFF' },
    images: { bg: 'https://bit.ly/3gSDGpJ' },
    texts: { name: 'Lorem Ipsum', status: 'Developer' },
    sections: [{
      images: { socialIcon: 'https://bit.ly/3hXPM2R' },
      texts: { socialLink: 'https://github.com' }
    }]
  };

  render() {
    const { classes, fields } = this.props;
    return (
      <div className={classes.root} style={{
        backgroundRepeat: false,
        backgroundImage: `url("${fields.images.bg}")`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: 'fixed',
        width: fields.width,
        height: fields.height,
        display: "flex",
        flexDirection: "column",
        textAlign: "center"
      }}>
        <CssBaseline />
        <div
          style={{
            padding: '5vh',
            paddingBlock: '10vh',
            backgroundColor: '#FFFFFF10',
            width: '100%',
            height: '100%',
            border: `solid 1px ${fields.colours.primary}`
          }}>
          <Typography component="h1" variant="h1" style={{ color: fields.colours.primary, fontFamily: `${fields.fonts.titleFont}, Arial, Helvetica, sans-serif` }}>
            {fields.texts.name}
          </Typography>
          <Typography component="h2" variant="h2" style={{ color: fields.colours.secondary, fontFamily: `${fields.fonts.titleFont}, Arial, Helvetica, sans-serif` }}>
            {fields.texts.status}
          </Typography>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              marginInline: 'auto',
              width: 'max-content',
              justifyContent: 'center',
              alignItems: 'center',
              height: '8vh',
              marginTop: '5vh'
            }}>
            {fields.sections.map((section, index) => {
              return (
                <div className={classes.section}>
                  <IconButton
                    onClick={() => window.open(section.texts.socialLink)}
                    className={classes.socialButton}
                    style={{
                      backgroundImage: `url(${section.images.socialIcon})`,
                      backgroundSize: 'cover'
                    }}
                  >
                  </IconButton>
                </div>
              );
            })}
          </div>
        </div>


      </div>);
  }
}

export default withStyles(styles)(IntroTemplateRedline);