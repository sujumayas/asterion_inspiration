'use strict';

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

setTimeout(function () {
  var canvasEl = document.getElementById('js-canvas');
  var width = canvasEl.width;
  var height = canvasEl.height;

  var canvasCtx = canvasEl.getContext('2d');
  var planet = new Planet(width / 2, height / 2, 15);
  var ship = new Ship(width / 2 - 40, height / 2, 16, 0);
  ship.vY = -3;
  var tailEl = document.createElement('canvas');
  tailEl.width = width;
  tailEl.height = height;
  var offEl = document.createElement('canvas');
  offEl.width = width;
  offEl.height = height;
  animate(0, canvasCtx, width, height, planet, ship, tailEl, offEl);
}, 0);

function animate(iteration, ctx, width, height, planet, ship, tailEl, offEl) {
  ctx.clearRect(0, 0, width, height);
  var offCtx = offEl.getContext('2d');
  offCtx.clearRect(0, 0, width, height);
  offCtx.drawImage(tailEl, 0, 0, width, height, 0, 0, width, height);
  var tailCtx = tailEl.getContext('2d');
  tailCtx.clearRect(0, 0, width, height);
  tailCtx.globalAlpha = 0.92;
  tailCtx.drawImage(offEl, 0, 0, width, height, 0, 0, width, height);
  tailCtx.globalAlpha = 1;
  if (iteration % (60 / 12) === 0) {
    tailCtx.fillStyle = 'orange';
    var trailSize = 6;
    tailCtx.fillRect(ship.x - trailSize / 2, ship.y - trailSize / 2, trailSize, trailSize);
  }
  ctx.drawImage(tailEl, 0, 0, width, height, 0, 0, width, height);
  planet.render(ctx);
  ship.update([planet]);
  ship.render(ctx);
  requestAnimationFrame(function () {
    animate(iteration + 1, ctx, width, height, planet, ship, tailEl, offEl);
  });
}

function applyForces(target, neighbors) {
  var acceleration = [target.vX, target.vY];
  vec2.add(acceleration, acceleration, forces.gravitation(target, neighbors, 100));

  var _vec2$add = vec2.add([], [target.vX, target.vY], acceleration);

  target.vX = _vec2$add[0];
  target.vY = _vec2$add[1];
}

var forces = {
  gravitation: function gravitation(target, neighbors, influenceRange) {
    var gravityForce = 0.1;
    var vectorSum = [0, 0];
    var steeringVector = [0, 0];
    var count = 0;
    neighbors.forEach(function (neighbor) {
      var distance = vec2.dist([target.x, target.y], [neighbor.x, neighbor.y]);
      if (distance > influenceRange) {
        return;
      }
      vec2.add(vectorSum, vectorSum, [neighbor.x, neighbor.y]);
      count++;
    });
    if (count) {
      var baryCenter = vec2.div([], vectorSum, [count, count]);
      var desired = vec2.sub([], baryCenter, [target.x, target.y]);
      vec2.normalize(desired, desired);
      vec2.mul(desired, desired, [gravityForce, gravityForce]);
      vec2.sub(steeringVector, desired, [target.vX, target.vY]);
    }
    return steeringVector;
  }
};

var Entity = function () {
  function Entity(x, y, size, rotation) {
    _classCallCheck(this, Entity);

    this.x = x;
    this.y = y;
    this.vX = 0;
    this.vY = 0;
    this.rotation = rotation;
    this.size = size;
    this.canvasSize = this.size * 2;
    this.cacheEl = document.createElement('canvas');
    this.cacheEl.width = this.canvasSize;
    this.cacheEl.height = this.canvasSize;
  }

  Entity.prototype.render = function render(ctx) {
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.drawImage(this.cacheEl, 0, 0, this.canvasSize, this.canvasSize, -this.canvasSize / 2, -this.canvasSize / 2, this.canvasSize, this.canvasSize);
    ctx.rotate(-this.rotation);
    ctx.translate(-this.x, -this.y);
  };

  Entity.prototype.update = function update(neighbors) {
    applyForces(this, neighbors);

    var _vec2$add2 = vec2.add([], [this.x, this.y], [this.vX, this.vY]);

    this.x = _vec2$add2[0];
    this.y = _vec2$add2[1];

    this.rotation = Math.atan2(this.vY, this.vX) + Math.PI / 2;
  };

  return Entity;
}();

var Planet = function (_Entity) {
  _inherits(Planet, _Entity);

  function Planet(x, y, radius) {
    _classCallCheck(this, Planet);

    var _this = _possibleConstructorReturn(this, _Entity.call(this, x, y, radius * 2, 0));

    _this.radius = radius;
    _this.cache();
    return _this;
  }

  Planet.prototype.cache = function cache() {
    var ctx = this.cacheEl.getContext('2d');
    var center = this.canvasSize / 2;
    ctx.beginPath();
    ctx.fillStyle = '#dedede';
    ctx.arc(center, center, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  };

  return Planet;
}(Entity);

var Ship = function (_Entity2) {
  _inherits(Ship, _Entity2);

  function Ship(x, y, size, rotation) {
    _classCallCheck(this, Ship);

    var _this2 = _possibleConstructorReturn(this, _Entity2.call(this, x, y, size, rotation));

    _this2.cache();
    return _this2;
  }

  Ship.prototype.cache = function cache() {
    var ctx = this.cacheEl.getContext('2d');
    var offset = this.canvasSize / 4;
    ctx.beginPath(); // this is from http://codepen.io/jscottsmith/pen/KrJvAq
    ctx.strokeStyle = '#dedede';
    ctx.fillStyle = '#333';
    ctx.lineWidth = this.size / 6;
    ctx.translate(this.canvasSize / 2, this.canvasSize / 2);
    ctx.moveTo(this.size / 2 - offset, -offset * 1.7);
    ctx.lineTo(this.size - offset, this.size - offset);
    ctx.lineTo(0 - offset, this.size - offset);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.translate(-this.canvasSize / 2, -this.canvasSize / 2);
  };

  return Ship;
}(Entity);