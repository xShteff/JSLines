class Ball {
  constructor(colour, id) {
    this.id = id;
    this.colour = colour;
  }

  toString() {
    return `${this.id}: ${this.colour}`;
  }

  equalColour(ball) {
    return this.colour === ball.colour;
  }
}
