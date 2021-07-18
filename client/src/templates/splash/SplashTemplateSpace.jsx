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
    fontSize: '6em'
  },
  linkButton: {
    width: '100%',
    opacity: '40%',
    marginInline: '0.5vh',
    fontSize: '2rem',
    justifyContent: 'end',
    '&:hover': {
      opacity: '80%',
      fontSize: '3rem',
      transition: '0.2s',
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

  static templateName = "Space";

  static preview = "https://bit.ly/3fwsFKX";

  static script = (entry, index) => {
    let scriptText = entry.sections.map((section, sectionIndex) => {
      return `document.getElementById("link-${index}-${sectionIndex}").onclick = () => window.open("${section.texts.linkAddr}");`
    }).join('\n');
    return scriptText;
  };

  static info = {
    fonts: { titleFont: { label: 'title font' }, mainFont: { label: 'link font' } },
    colours: { primary: { label: 'primary' }, secondary: { label: 'secondary' } },
    images: { bg: { label: "Background media", format: ['image', 'colour'] } },
    texts: { name: { label: 'Name', type: "simpleText" }, title: { label: 'Title', type: "simpleText" }, subtitle: { label: 'Subtitle', type: "simpleText" } },
    sections: {
      enabled: true,
      defaultEntry: {
        images: {},
        texts: { linkAddr: 'https://github.com', linkText: 'Github' }
      },
      entryFormat: {
        images: {},
        texts: { linkAddr: { label: 'Link', type: 'simpleText' }, linkText: { label: 'Display text', type: 'simpleText' } }
      }
    }
  };

  static defaultField = {
    width: '100%',
    height: '100%',
    fonts: { titleFont: 'Zen Tokyo Zoo', mainFont: 'Roboto' },
    colours: { primary: '#fff', secondary: '#ff9d96' },
    images: { bg: { src: "https://bit.ly/3kuRB8x", format: 'image' } },
    texts: {
      name: "Resumate.",
      title: "Digital artist, vfx specialist",
      subtitle: "Based in Singapore"
    },
    sections: [{
      images: {},
      texts: { linkAddr: 'https://github.com', linkText: 'About me' }
    },
    {
      images: {},
      texts: { linkAddr: 'https://github.com', linkText: 'My certifications' }
    },
    {
      images: {},
      texts: { linkAddr: 'https://github.com', linkText: 'My past projects' }
    }
    ]
  };

  render() {
    const { classes, fields } = this.props;
    return (
      <div
        className={classes.root}
        style={
          {
            backgroundRepeat: false,
            backgroundImage: fields.images.bg.format === 'image' ? `url("${fields.images.bg.src}")` : '',
            backgroundColor: fields.images.bg.format === 'colour' ? fields.images.bg.src : '',
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "fixed",
            width: fields.width,
            height: fields.height,
            minHeight: "1000px",
            display: "flex",
            flexDirection: "row"
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
            display: 'flex',
            flexDirection: 'row'
          }}>
          <div
            style={{
              width: '50%',
              marginBlock: 'auto'
            }}
          >
            <Typography
              component="h2"
              variant="h2"
              style={{ color: fields.colours.secondary, fontFamily: `${fields.fonts.mainFont}, Arial, Helvetica, sans-serif` }}
            >
              {`Hi, my name is ${fields.texts.name}.`}
            </Typography>
            <Typography
              component="h1"
              variant="h1"
              style={{ color: fields.colours.primary, fontFamily: `${fields.fonts.titleFont}, Arial, Helvetica, sans-serif` }}
              className={classes.title}
            >
              {fields.texts.title}
            </Typography>
            <Typography
              component="h2"
              variant="h2"
              style={{ color: fields.colours.secondary, fontFamily: `${fields.fonts.mainFont}, Arial, Helvetica, sans-serif` }}
            >
              {`${fields.texts.subtitle}.`}
            </Typography>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              marginLeft: 'auto',
              marginBlock: 'auto',
              maxWidth: '50%',
              justifyContent: 'center',
              alignItems: 'center',
              height: 'max-content',
            }}>
            {fields.sections.map((section, index) => {
              return (
                <Button
                  onClick={() => window.open(section.texts.linkAddr)}
                  className={classes.linkButton}
                  id={`link-${this.props.id}-${index}`}
                >
                  <Typography
                    component="h3"
                    variant="h3"
                    style={{
                      color: fields.colours.secondary,
                      fontFamily: `${fields.fonts.mainFont}, Arial, Helvetica, sans-serif`,
                      fontSize: 'inherit'
                    }}
                  >
                    {section.texts.linkText}
                  </Typography>
                </Button>
              );
            })}
          </div>
        </div>
      </div>);
  }
}

export default withStyles(styles)(ContactTemplateMinimalist);
