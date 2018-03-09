assert = chai.assert;

describe('GSAP', function() {
  it('should have TweenLite', function() {
    //assert.equal(typeof TweenLite, "function");
    chai.expect(TweenLite).to.be.a('function');
  });

  it('should have one background tween', function () {
    //assert.equal(TweenLite.getTweensOf(document.querySelector('#bg')).length, 1);
    chai.expect(TweenLite.getTweensOf(document.querySelector('#bg')).length).to.equal(1);
  });
});
