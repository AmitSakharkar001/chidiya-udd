import React, { Component } from 'react';
import { Typography, withStyles } from '@material-ui/core';
const styles = (theme) => ({
  animalImage: {
    width: 200,
    height: 200,
    borderRadius: '50%',
  },
  mainDiv: {
    display: 'flex',
    placeContent: 'center',
    placeItems: 'center',
    flexDirection: 'column',
    background: `transparent url(natureBackground.png) no-repeat center 0`,
    width: '100wh',
    height: '100vh',
  },
  howToPlay: {
    display: 'flex',
    flexDirection: 'column',
    width: '60%',
  },
  scoreDisplay: {
    display: 'flex',
    width: '60%',
    justifyContent: 'space-between',
    cursor: 'pointer',
  },
  textStyle: { color: 'white', fontSize: '2rem', fontWeight: 'bold' },
});
class ChidiyaUdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      score: 0,
      counter: 0,
      isPlaying: false,
      displayHowToPlay: false,
      flyableAnimals: [],
      nonFlyableAnimals: [],
    };
  }

  componentDidMount() {
    if (this.state.isPlaying) {
      this.generateRandomImage(); // calls it the first time and the setInterval will keep running
    } else {
      return null;
    }
  }

  randomImageTitle = (min, max) => {
    // will retrieve random image file name
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  generateRandomImage = () => {
    setInterval(() => {
      if (this.state.isPlaying) {
        document.getElementById('randomImage').src = `${this.randomImageTitle(
          1,
          158
        )}.jpg`;
        this.setState({ counter: this.state.counter + 1 });
      } else {
        return 1;
      }
    }, this.randomImageTitle(1500, 2000));
  };
  setPlayingStatus = (status) => {
    if (status === true) {
      this.setState({ score: 0, couter: 0 }, () => this.generateRandomImage());
    } else {
      let score = this.state.counter * 50;
      this.setState({ score });
    }
    this.setState({ isPlaying: status });
  };
  handleImageClick = (evt) => {
    let fileNameData = evt.target.src.split('/');
    let fileName = fileNameData[3].split('.');
    let animalImageFile = fileName[0];
    if (
      (animalImageFile > 1 && animalImageFile < 19) ||
      (animalImageFile > 19 && animalImageFile < 81) ||
      animalImageFile === 84 ||
      animalImageFile === 88 ||
      animalImageFile === 105
    ) {
      return 1;
    } else {
      this.setPlayingStatus(false);
    }
  };
  setDisplayHowToPlay = (status) => {
    this.setState({ displayHowToPlay: status });
  };
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.mainDiv}>
        {this.state.displayHowToPlay ? (
          <div className={classes.howToPlay}>
            <Typography className={classes.textStyle}>
              Just click on the birds images, but if clicked on animal image the
              game will end.
            </Typography>
            <Typography
              className={classes.textStyle}
              onClick={(evt) => {
                evt.preventDefault();
                this.setDisplayHowToPlay(false);
              }}
            >
              Go Back
            </Typography>
          </div>
        ) : this.state.isPlaying ? (
          <>
            <img
              id="randomImage"
              className={classes.animalImage}
              src={`${this.randomImageTitle(1, 158)}.jpg`}
              alt="temp"
              onClick={(evt) => {
                evt.preventDefault();
                this.handleImageClick(evt);
              }}
            />
            <div className={classes.scoreDisplay}>
              <Typography className={classes.textStyle}>
                Your score : {this.state.score}
              </Typography>
              <Typography
                className={classes.textStyle}
                onClick={(evt) => {
                  evt.preventDefault();
                  this.setPlayingStatus(false);
                }}
              >
                Quit
              </Typography>
            </div>
          </>
        ) : (
          <div className={classes.scoreDisplay}>
            <Typography
              className={classes.textStyle}
              onClick={(evt) => {
                evt.preventDefault();
                this.setDisplayHowToPlay(true);
              }}
            >
              How to play
            </Typography>
            <Typography className={classes.textStyle}>
              Your score : {this.state.score}
            </Typography>
            <Typography
              className={classes.textStyle}
              onClick={(evt) => {
                evt.preventDefault();
                this.setPlayingStatus(true);
              }}
            >
              Start
            </Typography>
          </div>
        )}
      </div>
    );
  }
}
export default withStyles(styles)(ChidiyaUdd);
