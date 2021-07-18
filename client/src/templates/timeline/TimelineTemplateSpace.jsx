import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';
import { withStyles } from '@material-ui/core/styles';
import preview from '../../res/preview/timeline/TimelineMinimalist.JPG'
import { Divider } from '@material-ui/core';
import * as icons from '../../styles/icons';

const styles = (theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    padding: '30px'
  },
  std: { display: 'block' },
  timelineImg: {
    borderRadius: '50%',
    height: '100px',
    width: '100px'
  },
  title: {
  },
  section: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'left',
    textAlign: 'left',
    width: '50%',
    margin: '1%'
  },
  sectionTextDiv: {
    marginLeft: '3%',
    display: 'flex',
    flexDirection: 'column',
    width: '50%',
    height: '50%'
  },
  timelineDiv: {
    display: 'flex',
    flexDirection: 'column',
    width: '50%'
  },
  connectorDiv: {
    height: '100px',
    borderLeft: 'solid 1px',
    marginLeft: 'calc(1% + 50px)'
  }
});

class TimelineTemplateSpace extends Component {
  constructor() {
    super();
  }

  static templateName = "Space";

  static script = (entry, index) => "";

  static preview = preview;

  static info = {
    fonts: { titleFont: { label: "title font" }, mainFont: { label: "body font" } },
    colours: { primary: { label: "primary" }, secondary: { label: "secondary" } },
    images: { bg: { label: "Entry background", format: ['image', 'colour'] } },
    texts: { title: { label: "Timeline title" } },
    sections: {
      enabled: true,
      defaultEntry: {
        images: { timelineImage: { src: "https://bit.ly/3c3wsNL", format: 'image' } },
        texts: { timelineTitle: "New section", timelineDate: "2077" }
      },
      entryFormat: {
        images: { timelineImage: { label: "Event Image", format: ['image', 'icon'] } },
        texts: { timelineTitle: { label: "Event name" }, timelineDate: { label: "Event date" } }
      }
    }
  };

  static defaultField = {
    width: "100%",
    height: "fit-content",
    fonts: { titleFont: "Zen Tokyo Zoo", mainFont: "Roboto" },
    colours: { primary: '#fff', secondary: '#ff9d96' },
    images: { bg: { src: "https://bit.ly/3kuRB8x", format: 'image' } },
    texts: {
      title: "Work history"
    },
    sections: [{
      images: { timelineImage: { src: "https://bit.ly/3hXPM2R", format: 'image' } },
      texts: { timelineTitle: "Portfolio Deployed on Github!", timelineDate: "2021" }
    },
    {
      images: { timelineImage: { src: "https://bit.ly/3c3wsNL", format: 'image' } },
      texts: { timelineTitle: "Portfolio added to resume", timelineDate: "2021" }
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
            flexDirection: "column"
          }
        }
      >
        <CssBaseline />
        <div
          style={{
            borderColor: fields.colours.primary,
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%'
          }}
        >
          <div
            style={{
              display: 'flex',
              borderBottomStyle: 'dotted',
              borderBottomWidth: '3px',
              borderBottomColor: fields.colours.secondary,
              width: '50%',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              margin: 'auto',
              padding: '50px'
            }}
          >
            <Typography
              component="h2"
              variant="h2"
              style={{
                color: fields.colours.primary,
                fontFamily: `${fields.fonts.titleFont}, Helvetica, sans-serif`,
              }}
              className={classes.title}
            >
              {fields.texts.title}
            </Typography>
          </div>
          <div
            className={classes.timelineDiv}
          >
            {fields.sections.map((section, index) => {
              let SocialIcon;
              if (section.images.timelineImage.format === 'icon') {
                const category = section.images.timelineImage.src.split('/');
                SocialIcon = icons[category[0]].icons[category[1]];
              } else {
                SocialIcon = (props) => <img src={section.images.timelineImage.src} className={classes.timelineImg} />;
              }
              return (
                <React.Fragment>
                  <div className={classes.section}>
                    <SocialIcon size='100px' color={fields.colours.primary} />
                    <div className={classes.sectionTextDiv}>
                      <Typography
                        style={{ color: fields.colours.primary }}
                        component="h5"
                        variant="h5"
                      >
                        {section.texts.timelineTitle}
                      </Typography>
                      <Typography
                        style={{ color: fields.colours.secondary }}
                        component="h5"
                        variant="h5"
                      >
                        {section.texts.timelineDate}
                      </Typography>
                    </div>

                  </div>
                  {
                    index < fields.sections.length - 1
                      ? <div className={classes.connectorDiv} />
                      : null
                  }
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>);
  }
}

export default withStyles(styles)(TimelineTemplateSpace);
