import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { withStyles } from '@material-ui/core/styles';
import draftToHtml from 'draftjs-to-html';
import { Markup } from 'interweave';
import preview from '../../res/preview/about/AboutMinimalist.JPG';


const styles = (theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "start",
    padding: "5%",
    alignItems: "center",
    width: "100%",
    height: 'auto'
  },
  box: {
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    width: '100%',
    height: '100%'
  }
});

const initialContent = {
  entityMap: {},
  blocks: [
    {
      key: "70ge9",
      text: "Describe Yourself! 😀",
      type: "unstyled",
      depth: 0,
      inlineStyleRanges: [
        {
          length: 20,
          offset: 0,
          style: "fontfamily-Tahoma"
        }
      ],
      entityRanges: [],
      data: {}
    },
  ]
};

initialContent.blocks.map(block => block.data['text-align'] = "center");

export const convertToHtml = (htmlString) => {

  const placeholder = document.createElement('div');
  placeholder.innerHTML = htmlString;
  const paragraphs = placeholder.getElementsByTagName("p");
  if (paragraphs.length === 1) {
    paragraphs[0].style.marginBlockStart = "0px";
    paragraphs[0].style.marginBlockEnd = "0px";
  } else if (paragraphs.length > 1) {
    paragraphs[0].style.marginBlockStart = "0px";
    paragraphs[paragraphs.length - 1].style.marginBlockEnd = "0px";
  }

  return placeholder.innerHTML;
}

class AboutTemplateMinimalist extends Component {
  constructor(props) {
    super(props);
  }

  static templateName = "Minimalist";

  static info = {
    fonts: {},
    colours: {
      bg: { label: "background fill" },
      primary: { label: "primary colour" }
    },
    images: {},
    texts: { title: { label: "Title", type: "simpleText" }, content: { label: "Description", type: "complexText" } },
    sections: {}
  };

  static preview = "https://bit.ly/3fwsFKX";

  static script = (entry, index) => "";

  static defaultField = {
    width: "60%",
    height: "80vh",
    fonts: {},
    colours: {
      bg: "#e8dfcf",
      primary: "#d19a19"
    },
    images: {},
    texts: {
      title: 'About me',
      content: initialContent
    },
    sections: []
  };


  render() {
    const { classes, fields } = this.props;
    return (
      <div
        className={classes.root}
        style={{
          backgroundColor: fields.colours.bg
        }}
      >
        <Typography
          component="h2"
          variant="h2"
          style={{
            color: fields.colours.primary,
            fontFamily: `${fields.fonts.titleFont}, Helvetica, sans-serif`
          }}
        >
          {fields.texts.title}
        </Typography>
        <div
          className={classes.box}
          style={{
            borderTopColor: fields.colours.primary
          }}
        >
          <Typography
            style={{
              backgroundColor: fields.colours.bg,
              paddingInline: '10%',
            }}
          >
            <Markup noWrap content={convertToHtml(draftToHtml(fields.texts.content))} />
          </Typography>
        </div>
      </div>
    )
  }
}


export default withStyles(styles)(AboutTemplateMinimalist);