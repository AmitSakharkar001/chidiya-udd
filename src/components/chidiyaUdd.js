import React, { Component } from 'react';
import { Typography, withStyles } from '@material-ui/core';
const styles = (theme) => ({
  animalImage: {
    width: 200,
    height: 200,
  },
});
class ChidiyaUdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPlaying: false,
    };
  }

  componentDidMount() {
    if (this.state.isPlaying) {
      this.generateRandomImage(); // calls it the first time and the setInterval will keep running
    } else {
      return null;
    }
  }

  randomImageTitle(min, max) {
    // will retrieve random image file name
    return `${Math.floor(Math.random() * (max - min + 1)) + min}.jpg`;
  }
  generateRandomImage() {
    setInterval(() => {
      document.getElementById('randomImage').src = `${this.randomImageTitle(
        1,
        155
      )}`;
    }, Math.floor(Math.random() * (2000 - 10 + 1000)) + 10);
  }
  setPlayingStatus = (status) => {
    this.setState({ isPlaying: status });
  };
  render() {
    const { classes } = this.props;
    return this.state.isPlaying ? (
      <>
        <img
          id="randomImage"
          className={classes.animalImage}
          src=""
          alt="temp"
        />
        <Typography
          onClick={(evt) => {
            evt.preventDefault();
            this.setPlayingStatus(false);
          }}
        >
          Quit
        </Typography>
      </>
    ) : (
      <Typography
        onClick={(evt) => {
          evt.preventDefault();
          this.setPlayingStatus(true);
        }}
      >
        Start
      </Typography>
    );
  }
}
export default withStyles(styles)(ChidiyaUdd);