import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';
import { withStyles } from '@material-ui/core/styles';
import { Button, Tooltip } from '@material-ui/core';
import * as icons from '../../styles/icons';

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
    height: '10em',
    width: '10em',
    maxWidth: '80px',
    maxHeight: '80px',
    minWidth: '40px',
    minHeight: '40px',
    borderRadius: '50%',
    opacity: '40%',
    marginInline: '0.5vh',
    '&:hover': {
      opacity: '80%',
      transition: '0.2s'
    }
  },
  socialIcon: {
    height: '10em',
    width: '10em',
    maxWidth: '80px',
    maxHeight: '80px',
    minWidth: '40px',
    minHeight: '40px',
    borderRadius: '50%',
    margin: 'auto',
  }
});

class ContactTemplateMinimalist extends Component {
  constructor() {
    super();
  }

  static templateName = "Redline";

  static preview = "https://bit.ly/3fwsFKX";

  static script = (entry, index) => {
    let scriptText = entry.sections.map((section, sectionIndex) => {
      return `document.getElementById("link-${index}-${sectionIndex}").onclick = () => window.open("${section.texts.socialLink}");`
    }).join('\n');
    return scriptText;
  };

  static info = {
    fonts: { titleFont: { label: 'title font' } },
    colours: { bg: { label: 'background' }, primary: { label: 'primary' } },
    images: {},
    texts: { title: { label: 'Title', type: "simpleText" } },
    sections: {
      enabled: true,
      defaultEntry: {
        images: { socialIcon: { src: 'fa/FaGithub', format: 'icon' } },
        texts: { socialLink: 'https://github.com', socialLabel: 'Github' }
      },
      entryFormat: {
        images: { socialIcon: { label: 'Icon', format: ['image', 'icon'] } },
        texts: { socialLink: { label: 'Link', type: 'simpleText' }, socialLabel: { label: 'Label', type: 'simpleText' } }
      }
    }
  };

  static defaultField = {
    width: '100%',
    height: 'fit-content',
    fonts: { titleFont: 'Roboto' },
    colours: { bg: '#e8dfcf', primary: '#d19a19' },
    images: {},
    texts: {
      title: "Contact me",
    },
    sections: [{
      images: { socialIcon: { src: 'fa/FaGithub', format: 'icon' } },
      texts: { socialLink: 'https://github.com', socialLabel: 'Github' }
    }]
  };

  render() {
    const { classes, fields } = this.props;
    return (
      <div
        className={classes.root}
        style={
          {
            backgroundRepeat: false,
            backgroundColor: fields.colours.bg,
            width: fields.width,
            height: fields.height,
            display: "flex",
            flexDirection: "column",
            textAlign: "center"
          }
        }
      >
        <CssBaseline />
        <div
          style={{
            padding: '5vh',
            paddingBlock: '10vh',
            width: '100%',
            height: '100%',
          }}>
          <Typography
            component="h1"
            variant="h1"
            style={{ color: fields.colours.primary, fontFamily: `${fields.fonts.titleFont}, Arial, Helvetica, sans-serif` }}
          >
            {fields.texts.title}
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
              let SocialIcon;
              if (section.images.socialIcon.format === 'icon') {
                const category = section.images.socialIcon.src.split('/');
                SocialIcon = icons[category[0]].icons[category[1]];
              } else {
                SocialIcon = (props) => <img src={section.images.socialIcon.src} className={classes.socialIcon} />;
              }

              return (
                <div className={classes.section}>
                  <Tooltip title={section.texts.socialLabel}>
                    <Button
                      id={`link-${this.props.id}-${index}`}
                      onClick={() => window.open(section.texts.socialLink)}
                      className={classes.socialButton}
                    >
                      <SocialIcon color={fields.colours.primary} className={classes.socialIcon} />
                    </Button>
                  </Tooltip>
                </div>
              );
            })}
          </div>
        </div>
      </div>);
  }
}

export default withStyles(styles)(ContactTemplateMinimalist);
