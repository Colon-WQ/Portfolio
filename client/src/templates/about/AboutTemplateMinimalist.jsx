import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { withStyles } from '@material-ui/core/styles';

const styles = (theme) => ({
    root: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "start",
        padding: "1rem",
        alignItems: "center"
    }
})

class AboutTemplateMinimalist extends Component {
    static templateName = "Minimalist";

    static info = {
        fonts: {titleFont: {label: "title font"}, bodyFont: {label: "body font"}},
        colours: {primary: {label: "primary"}, secondary: {label: "secondary"}, header: {label: "header"}},
        images: {},
        texts: {about: {label: "Self Introduction"}},
        sections: {}
    };

    static preview = "https://bit.ly/3fwsFKX";

    static script = (index) => "";

    static defaultField = {
        width: "60%", 
        height: "80vh", 
        fonts: {titleFont: "title font", bodyFont: "body font"},
        colours: {primary: "#ffffff", secondary: "#d5d5d5", header: "#e30000"},
        images: {},
        texts: {about: "Send Help"},
        sections: []
    };



    render() {
        const {classes, fields} = this.props
        return (
            <Card
                className={classes.root}
                variant="outlined"
            >
                 <CardContent>
                    <Typography 
                        variant="h1"
                        component="h2" 
                        style={{color: fields.colours.header, backgroundColor: fields.colours.header, fontFamily: `${fields.fonts.titleFont}, Arial, Helvetica, sans-serif`}}
                    >
                        About Me
                    </Typography>
                    <Typography
                        variant="body1"
                        component="body2"
                        style={{color:fields.colours.secondary, backgroundColor: "white", fontFamily: `${fields.fonts.bodyFont}, Arial, Helvetica, sans-serif`}}
                    >
                        {fields.text.about}
                    </Typography>
                 </CardContent>

            </Card>
        )
    }
}


export default withStyles(styles)(AboutTemplateMinimalist);
