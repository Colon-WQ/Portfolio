import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';
import { withStyles } from '@material-ui/core/styles';
import { Button, Tooltip } from '@material-ui/core';
import * as icons from '../../styles/icons';
import preview from '../../res/preview/about/AboutSpace.JPG';

const styles = (theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    paddingInline: '15vh'
  },
  std: { display: 'block' },
  title: {
    margin: 'auto',
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
  entryImg: {
    maxWidth: '25vw',
    maxHeight: '50vh',
    objectFit: 'contain',
  }
});

class AboutTemplateSpace extends Component {
  constructor() {
    super();
  }

  static templateName = "Space";

  static preview = preview;

  static script = (entry, index) => "";

  static info = {
    fonts: { titleFont: { label: 'title font' }, mainFont: { label: 'link font' } },
    colours: { primary: { label: 'primary' }, secondary: { label: 'secondary' } },
    images: { bg: { label: "Background media", format: ['image', 'colour'] } },
    texts: { title: { label: 'Title', type: "simpleText" } },
    sections: {
      enabled: true,
      defaultEntry: {
        images: { entryImage: { src: 'https://bit.ly/2VQ4Q9D', format: 'image' } },
        texts: { entryContents: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis et dui volutpat urna lobortis imperdiet. Phasellus dui lectus, mattis non lorem ac, pulvinar dapibus leo. Aliquam metus mauris, ullamcorper eu faucibus at, egestas eu libero. Mauris accumsan condimentum massa, a mattis justo egestas id. In ullamcorper euismod placerat. Aliquam ac pharetra mauris. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vivamus placerat aliquam arcu, et pretium purus. Aenean tempor sodales euismod. Nam vitae nunc erat. Nunc eleifend tristique nibh. Vestibulum non vestibulum metus, ut venenatis erat. Vestibulum euismod at risus quis vestibulum. ' }
      },
      entryFormat: {
        images: { entryImage: { label: 'Section image', format: ['image'] } },
        texts: { entryContents: { label: 'Section contents', type: 'simpleText' } }
      }
    }
  };

  static defaultField = {
    width: '100%',
    height: 'fit-content',
    fonts: { titleFont: 'Zen Tokyo Zoo', mainFont: 'Roboto' },
    colours: { primary: '#fff', secondary: '#ff9d96' },
    images: { bg: { src: "https://bit.ly/3kuRB8x", format: 'image' } },
    texts: {
      title: "Background in design"
    },
    sections: [{
      images: { entryImage: { src: 'https://bit.ly/2VQ4Q9D', format: 'image' } },
      texts: { entryContents: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis et dui volutpat urna lobortis imperdiet. Phasellus dui lectus, mattis non lorem ac, pulvinar dapibus leo. Aliquam metus mauris, ullamcorper eu faucibus at, egestas eu libero. Mauris accumsan condimentum massa, a mattis justo egestas id. In ullamcorper euismod placerat. Aliquam ac pharetra mauris. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vivamus placerat aliquam arcu, et pretium purus. Aenean tempor sodales euismod. Nam vitae nunc erat. Nunc eleifend tristique nibh. Vestibulum non vestibulum metus, ut venenatis erat. Vestibulum euismod at risus quis vestibulum. ' }
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
            backgroundImage: fields.images.bg.format === 'image' ? `url("${fields.images.bg.src}")` : '',
            backgroundColor: fields.images.bg.format === 'colour' ? fields.images.bg.src : '',
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "fixed",
            width: fields.width,
            height: fields.height,
            minHeight: '100vh',
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
            flexDirection: 'column'
          }}>
          <Typography
            component="h1"
            variant="h1"
            style={{
              color: fields.colours.secondary,
              fontFamily: `${fields.fonts.titleFont}, Arial, Helvetica, sans-serif`,
              fontSize: '8rem',
              borderBottomStyle: 'dotted',
              borderBottomWidth: '3px',
              borderBottomColor: fields.colours.secondary
            }}
            className={classes.title}
          >
            {fields.texts.title}
          </Typography>

          <div>
            {fields.sections.map((section, index) => {
              return (<div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                {index % 2 === 0 ? <img src={section.images.entryImage.src} className={classes.entryImg} /> : null}
                <Typography
                  component="body1"
                  variant="h3"
                  style={{
                    color: fields.colours.primary,
                    fontFamily: `${fields.fonts.mainFont}, Arial, Helvetica, sans-serif`,
                    width: '45vw',
                    margin: '100px'
                  }}
                >
                  {section.texts.entryContents}
                </Typography>
                {index % 2 === 1 ? <img src={section.images.entryImage.src} className={classes.entryImg} /> : null}
              </div>
              )
            })}
          </div>
        </div>
      </div>);
  }
}

export default withStyles(styles)(AboutTemplateSpace);
