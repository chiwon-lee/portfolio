(function () {
  var canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;';
  document.body.appendChild(canvas);
  var ctx = canvas.getContext('2d');

  var oldContainer = document.getElementById('squares');
  if (oldContainer) oldContainer.style.display = 'none';

  var dpr = window.devicePixelRatio || 1;
  var W, H;
  var mouse = { x: -9999, y: -9999 };

  function resize() {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  document.addEventListener('mousemove', function (e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  document.addEventListener('mouseleave', function () {
    mouse.x = -9999;
    mouse.y = -9999;
  });

  var COUNT = 35;
  var particles = [];

  for (var i = 0; i < COUNT; i++) {
    particles.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight * 0.7 + window.innerHeight * 0.1,
      size: Math.random() * 10 + 4,
      baseVY: -(0.15 + Math.random() * 0.25),
      vx: 0,
      vy: 0,
      drift: (Math.random() - 0.5) * 0.3,
      alpha: 0.15 + Math.random() * 0.15,
      rotation: Math.random() * 180
    });
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];

      var dx = mouse.x - p.x;
      var dy = mouse.y - p.y;
      var dist = Math.sqrt(dx * dx + dy * dy);
      var pull = 0;
      if (dist < 200 && dist > 0) {
        pull = (200 - dist) / 200;
        p.vx += dx / dist * pull * 0.12;
        p.vy += dy / dist * pull * 0.12;
      }

      p.vx += p.drift * 0.02;
      p.vy += p.baseVY * 0.05;

      p.vx *= 0.96;
      p.vy *= 0.96;

      p.x += p.vx;
      p.y += p.vy;

      p.rotation += 0.2 + pull * 0.5;

      if (p.y < -20) {
        p.y = H + 10;
        p.x = Math.random() * W;
      }
      if (p.x < -20) p.x = W + 10;
      if (p.x > W + 20) p.x = -10;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation * Math.PI / 180);
      ctx.fillStyle = 'rgba(200, 200, 200, ' + p.alpha + ')';
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      ctx.restore();
    }

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
})();
