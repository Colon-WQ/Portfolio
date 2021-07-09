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

  setText(text) {
    this.setState({
      text: text
    })
  }

  render() {
    return (
      <TextField
        name={this.props.name}
        id={this.props.name}
        label={this.props.label}
        value={this.state.text}
        margin="normal"
        variant="outlined"
        onChange={(event) => this.setText(event.target.value)}
        onBlur={() => this.props.onClose(this.state.text)}
      />
    )
  }

}

export default SimpleTextEditor;
