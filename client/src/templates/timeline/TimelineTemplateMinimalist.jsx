import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';
import { withStyles } from '@material-ui/core/styles';

/**
 * @file Minimalist Intro template
 * 
 * @author Chuan Hao
 * 
 * @see TimelineTemplateMinimalist
 */

const styles = (theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  std: {display: 'block'},
  timelineImg: {
    borderRadius: '50%',
    height: '5vw',
    width: '5vw'
  }
});

class TimelineTemplateMinimalist extends Component {
  constructor() {
    super();
  }

  static templateName = "Minimalist";

  static info = {
    fonts: {titleFont: {label: "title font"}},
    colours: {primary: {label: "primary"},secondary: {label: "secondary"}},
    images: { bg: {label: "Entry background", allowColour: true}},
    texts: {title: {label: "Timeline title"}},
    sections: {
      enabled: true,
      entryFormat: {
        images: {timelineImage: {label: "Event Image", allowColour: true}},
        texts: {timelineTitle: {label: "Event name"}, timelineDate: {label: "Event date"}}
      }
    }
  };

  static defaultField = {
    width: "100%", 
    height: "fit-content", 
    fonts: {titleFont: "roboto"},
    colours: {primary: "#ff0000", secondary: "#00ff00"},
    images: {bg: "https://bit.ly/3ut83ry"},
    texts: {title: "A stroll through time"},
    sections: [{
      images: {timelineImage: "https://bit.ly/3hXPM2R"},
      texts: {timelineTitle: "Portfolio Deployed on Github!", timelineDate: "2021"}
    },
    {
      images: {timelineImage: "https://bit.ly/3c3wsNL"},
      texts: {timelineTitle: "Portfolio added to resume", timelineDate: "2021"}
    }]
  };

  render() {
    const { classes, fields } = this.props;
    return (
      <div className = {classes.root} style={{
        backgroundRepeat: false,
        backgroundImage: `url("${fields.images.bg}")`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        width: fields.width,
        height: fields.height,
        display: "flex",
        flexDirection: "column",
        textAlign: "center"
      }}>
        <CssBaseline/>
        <div>
          <Typography component="h2" variant="h2" style={{color: fields.colours.primary, fontFamily: `${fields.fonts.titleFont}, Helvetica, sans-serif`}}>
            {fields.texts.title}
          </Typography>
          {fields.sections.map((section, index) => {
            return (
              <div style={{display: "flex", flexDirection: "row"}}>
                <img src={section.images.timelineImage} className={classes.timelineImg}/>
                <div style={{display: "flex", flexDirection: "column"}}>
                  <Typography>{section.texts.timelineDate}</Typography>
                  <Typography>{section.texts.timelineTitle}</Typography>
                </div>
              </div>
            );
          })}
        </div>
        <img src={fields.images.dp} alt="my portrait" style={{height: "100%", width: "auto", marginRight: "auto"}}/>
      </div>);
  }
}

export default withStyles(styles)(TimelineTemplateMinimalist);
