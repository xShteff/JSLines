class Ball {
  constructor(colour, id) {
    this.id = id;
    this.colour = colour;
  }
  toString() {
    return `Ball ${this.id}: ${this.colour}`;
  }
}
