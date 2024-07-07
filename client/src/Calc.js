import React, { Component } from 'react';
import axios from 'axios';

class Fib extends Component {
  state = {
    seenIndexes: [],
    values: {},
    index: '',
  };

  componentDidMount() {
    console.log('Component did mount');
    this.fetchValues();
    this.fetchIndexes();
  }

  async fetchValues() {
    try {
      const values = await axios.get('/api/values/current');
      this.setState({ values: values.data });
    } catch (error) {
      console.error('Error fetching current values:', error);
    }
  }

  async fetchIndexes() {
    try {
      const seenIndexes = await axios.get('/api/values/all');
      this.setState({
        seenIndexes: seenIndexes.data,
      });
    } catch (error) {
      console.error('Error fetching seen indexes:', error);
    }
  }

  handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await axios.post('/api/values', {
        index: this.state.index,
      });
      this.setState({ index: '' });
      // Re-fetch values and indexes after submission
      this.fetchValues();
      this.fetchIndexes();
    } catch (error) {
      console.error('Error submitting index:', error);
    }
  };

  renderSeenIndexes() {
    const seenIndexes = this.state.seenIndexes.map(({ number }) => number).join(', ');
    console.log('Seen indexes:', seenIndexes);
    return seenIndexes;
  }

  renderValues() {
    const entries = [];

    for (let key in this.state.values) {
      entries.push(
        <div key={key}>
          For index {key} I calculated {this.state.values[key]}
        </div>
      );
    }

    console.log('Values:', entries);
    return entries;
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>Enter your index:</label>
          <input
            value={this.state.index}
            onChange={(event) => this.setState({ index: event.target.value })}
          />
          <button>Submit</button>
        </form>

        <h3>Indexes I have seen:</h3>
        {this.renderSeenIndexes()}

        <h3>Calculated Values:</h3>
        {this.renderValues()}
      </div>
    );
  }
}

export default Fib;
