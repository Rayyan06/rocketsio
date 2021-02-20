const shortid = require('shortid');
const ObjectClass = require('./object');

class Food extends ObjectClass {
  constructor(x, y, dir, radius, score) {
    super(shortid(), x, y, dir, 0);
    this.score = score;
    this.radius = radius;
  }
  serializeForUpdate() {
    return {
      ...super.serializeForUpdate(),
      radius: this.radius,
      score: this.score
    };
  }
}

module.exports = Food;
