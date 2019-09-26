import React from 'react';

class EditorErrors extends React.Component {
  state = {
    error: null,
  };

  componentDidCatch(error, info) {
    console.error('Error in editor', error, info);
    this.setState({
      error,
    });
  }

  render() {
    if (!this.state.error) {
      return this.props.children;
    }

    return <div>An error has occurred :(</div>;
  }
}

export default EditorErrors;
