import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';
import { withStyles } from '@material-ui/core/styles';
import { Box } from '@material-ui/core';
import preview from '../../res/preview/introduction/IntroMinimalist.JPG';

const styles = (theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  std: { display: 'block' },
  textBox: {
    opacity: '75%',
    padding: '15%',
    width: 'max-content',
    borderRightWidth: '1px',
    borderRightStyle: 'solid'
  }
});

class IntroTemplateMinimalist extends Component {
  constructor() {
    super();
  }

  static templateName = "Minimalist";

  static preview = preview;

  static info = {
    fonts: { titleFont: { label: "title font" } },
    colours: { primary: { label: "primary" }, secondary: { label: "secondary" } },
    images: { dp: { label: "Display photo", format: ['image'] }, bg: { label: "Entry background", format: ['image', 'colour'] } },
    texts: { name: { label: "Name", type: "simpleText" }, status: { label: "Position", type: "simpleText" } },
    sections: {}
  };

  static script = (entry, index) => "";

  static defaultField = {
    width: "100%",
    height: "80vh",
    fonts: { titleFont: "Roboto" },
    colours: { primary: "#d19a19", secondary: "#000000" },
    images: { dp: { src: "https://images.pexels.com/photos/1587009/pexels-photo-1587009.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260", format: 'image' }, bg: { src: "#e8dfcf", format: 'colour' } },
    texts: {
      name: "Resumate",
      status: "UI/UX developer"
    },
    sections: []
  };

  render() {
    const { classes, fields } = this.props;
    return (
      <div className={classes.root} style={{
        backgroundRepeat: false,
        backgroundImage: fields.images.bg.format === 'image' ? `url("${fields.images.bg.src}")` : '',
        backgroundColor: fields.images.bg.format === 'colour' ? fields.images.bg.src : '',
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        width: fields.width,
        height: fields.height,
        minHeight: "1000px",
        display: "flex",
        flexDirection: "row"
      }}>
        <CssBaseline />
        <div style={{ marginLeft: "auto", marginRight: "10%" }}>
          <Box
            className={classes.textBox}
            style={{
              borderRightColor: fields.colours.primary,
            }}
          >
            <Typography
              component="h1"
              variant="h1"
              style={{
                color: fields.colours.primary,
                fontFamily: `${fields.fonts.titleFont}, Arial, Helvetica, sans-serif`
              }}
            >
              {fields.texts.name}
            </Typography>
            <Typography
              component="h2"
              variant="h2"
              style={{
                color: fields.colours.secondary,
                fontFamily: "Arial, Helvetica, sans-serif"
              }}
            >
              {fields.texts.status}
            </Typography>
          </Box>
        </div>
        <img src={fields.images.dp.src} alt="my portrait" style={{ height: "100%", width: "30%", marginRight: "auto", objectFit: "contain" }} />
      </div>);
  }
}

export default withStyles(styles)(IntroTemplateMinimalist);
