import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { withStyles } from '@material-ui/core/styles';
import draftToHtml from 'draftjs-to-html';
import { Markup } from 'interweave';


const styles = (theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "start",
    padding: "0px",
    alignItems: "center",
    width: "100%",
    height: 'auto'
  },
});

const initialTitle = {
  entityMap: {},
  blocks: [
    {
      key: "e4brl",
      text: "About Me",
      type: "unstyled",
      depth: 0,
      inlineStyleRanges: [
        {
          offset: 0,
          length: 8,
          style: "BOLD"
        },
        {
          offset: 0,
          length: 8,
          style: "fontsize-30"
        },
        {
          offset: 0,
          length: 8,
          style: "fontfamily-Tahoma"
        }
      ],
      entityRanges: [],
      data: {}
    }
  ]
};

initialTitle.blocks.map(block => block.data['text-align'] = "center");

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
    {
      key: "apr5k",
      text: "I am a hard worker.",
      type: "unstyled",
      depth: 0,
      inlineStyleRanges: [
        {
          length: 19,
          offset: 0,
          style: "fontfamily-Tahoma"
        },
        {
          length: 4,
          offset: 7,
          style: "BOLD"
        }
      ],
      entityRanges: [],
      data: {}
    }
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

class AboutTemplateBasic extends Component {
  constructor(props) {
    super(props);
  }

  static templateName = "Basic";

  static info = {
    fonts: {},
    colours: {
      headerBackgroundFill: { label: "header background fill" },
      bodyBackgroundFill: { label: "body background fill" }
    },
    images: {},
    texts: { title: { label: "Title", type: "complexText" }, content: { label: "Description", type: "complexText" } },
    sections: {}
  };

  static preview = "https://bit.ly/3fwsFKX";

  static script = (index) => "";

  static defaultField = {
    width: "60%",
    height: "80vh",
    fonts: {},
    colours: {
      headerBackgroundFill: "whitesmoke",
      bodyBackgroundFill: "#FFFFFF"
    },
    images: {},
    texts: {
      title: initialTitle,
      content: initialContent
    },
    sections: []
  };


  render() {
    const { classes, fields } = this.props;
    return (
      <div
        className={classes.root}
      >
        <Card
          style={{ width: '100%', border: 'none', boxShadow: 'none', borderRadius: '0px' }}
        >
          <CardContent
            style={{ padding: '0px' }}
          >
            <Typography
              style={{
                textAlign: 'center',
                backgroundColor: fields.colours.headerBackgroundFill,
              }}
            >
              <Markup noWrap content={convertToHtml(draftToHtml(fields.texts.title))} />
            </Typography>
            <Typography
              style={{
                backgroundColor: fields.colours.bodyBackgroundFill,
                paddingInline: '10%',
              }}
            >
              <Markup noWrap content={convertToHtml(draftToHtml(fields.texts.content))} />
            </Typography>

          </CardContent>

        </Card>
      </div>
    )
  }
}


export default withStyles(styles)(AboutTemplateBasic);