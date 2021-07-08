import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';

class SimpleTextEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: ""
        }
        this.setText = this.setText.bind(this);
    }

    componentDidMount() {
        this.setState({
            text: this.props.item
        })
    }

    componentWillUnmount() {
        console.log("finalize");
        const target = {
            name: this.props.name,
            value: this.state.text
        };
        console.log(this.state.text);
        const temp = {
            target: target
        }
        this.props.handleChange(temp, this.props.category, this.props.section);
    }

    setText(text) {
        this.setState({
            text: text
        })
    }

    render() {
        console.log(this.state.text)
        return (
            <TextField
                name={this.props.name}
                id={this.props.name}
                label={this.props.label}
                value={this.state.text}
                margin="normal"
                variant="outlined"
                onChange={(event) => this.setText(event.target.value)}
            />
        )
    }
    
}

export default SimpleTextEditor;
