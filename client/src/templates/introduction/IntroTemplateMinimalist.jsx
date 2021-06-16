import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';
import { withStyles } from '@material-ui/core/styles';
import { Box } from '@material-ui/core';
import preview from '../../res/preview/introduction/IntroMinimalist.JPG'

const styles = (theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  std: { display: 'block' },
  textBox: {
    backgroundColor: '#FFFFFF',
    opacity: '75%',
    padding: '15%',
    width: 'max-content'
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
    images: { dp: { label: "Your portrait photo", allowColour: false }, bg: { label: "Entry background", allowColour: true } },
    texts: { name: { label: "Your full name" }, status: { label: "your current position" } },
    sections: {}
  };

  static script = (index) => "";

  static defaultField = {
    width: "100%",
    height: "80vh",
    fonts: { titleFont: "Roboto" },
    colours: { primary: "#d19a19", secondary: "#000000" },
    images: { dp: "https://bit.ly/3fRv2Y2", bg: "https://bit.ly/2RWO4Ei" },
    texts: { name: "Port Folio", status: "UI/UX developer" },
    sections: []
  };

  render() {
    const { classes, fields } = this.props;
    return (
      <div className={classes.root} style={{
        backgroundRepeat: false,
        backgroundImage: `url("${fields.images.bg}")`,
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
          <Box className={classes.textBox}>
            <Typography component="h2" variant="h2" style={{ color: fields.colours.secondary, fontFamily: "Arial, Helvetica, sans-serif" }}>
              Hello! my name is
            </Typography>
            <Typography component="h1" variant="h1" style={{ color: fields.colours.primary, fontFamily: `${fields.fonts.titleFont}, Arial, Helvetica, sans-serif` }}>
              {fields.texts.name}
            </Typography>
            <Typography component="h2" variant="h2" style={{ color: fields.colours.secondary, fontFamily: "Arial, Helvetica, sans-serif" }}>
              {fields.texts.status}
            </Typography>
          </Box>
        </div>
        <img src={fields.images.dp} alt="my portrait" style={{ height: "100%", width: "auto", marginRight: "auto" }} />
      </div>);
  }
}

export default withStyles(styles)(IntroTemplateMinimalist);
