(function() {

  this.Renderer3D = (function() {

    function Renderer3D(el) {
      var $container, light, sphereMaterial;
      this.el = el;
      this.options = {
        width: window.innerWidth,
        height: window.innerHeight,
        view_angle: 45,
        near: 0.1,
        far: 10000,
        mouse_x: 0,
        mouse_y: 0,
        clicked: false
      };
      $container = $(this.el);
      this.renderer = new THREE.WebGLRenderer();
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(this.options['view_angle'], this.options['width'] / this.options['height'], this.options['near'], this.options['far']);
      this.camera.position.z = 300;
      this.scene.add(this.camera);
      this.renderer.setSize(this.options['width'], this.options['height']);
      $container.append(this.renderer.domElement);
      sphereMaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('land_ocean_ice_cloud_2048.jpg'),
        overdraw: true
      });
      this.planet = new THREE.Mesh(new THREE.SphereGeometry(100, 64, 64), sphereMaterial);
      this.planet.radius = 6378;
      this.scene.add(this.planet);
      this.orbiter = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), new THREE.MeshLambertMaterial({
        color: 0xCC0000
      }));
      this.scene.add(this.orbiter);
      light = new THREE.PointLight(0xFFFFFF);
      light.position.x = 10;
      light.position.y = 50;
      light.position.z = 130;
      this.scene.add(light);
      console.log("Renderer initialized!");
    }

    Renderer3D.prototype.render = function() {
      if (this.options.clicked) {
        this.camera.position.x += (this.options.mouse_x - this.camera.position.x) * 0.05;
      }
      if (this.options.clicked) {
        this.camera.position.y += (this.options.mouse_y - this.camera.position.y) * 0.05;
      }
      this.camera.lookAt(this.scene.position);
      return this.renderer.render(this.scene, this.camera);
    };

    Renderer3D.prototype.addOrbit = function(x, samples) {
      var geometry, i, interval, line, material, orbit, pos, _ref;
      if (samples == null) samples = 100;
      orbit = jQuery.extend(true, {}, x);
      interval = orbit.period() / samples;
      geometry = new THREE.Geometry();
      material = new THREE.LineBasicMaterial({
        color: 0xE01B32,
        opacity: 1.0
      });
      for (i = 1, _ref = samples + 1; 1 <= _ref ? i <= _ref : i >= _ref; 1 <= _ref ? i++ : i--) {
        orbit.step(interval);
        pos = new THREE.Vector3(orbit.position().x / 63.79, 0, orbit.position().y / 63.79);
        geometry.vertices.push(pos);
      }
      line = new THREE.Line(geometry, material);
      return this.scene.add(line);
    };

    Renderer3D.prototype.handleResize = function() {
      this.options.width = window.innerWidth;
      this.options.height = window.innerHeight;
      this.camera.aspect = this.options.width / this.options.height;
      this.camera.updateProjectionMatrix();
      return this.renderer.setSize(this.options.width, this.options.height);
    };

    Renderer3D.prototype.mouseMove = function(e) {
      this.options.mouse_x = e.pageX - this.options.width / 2;
      return this.options.mouse_y = e.pageY - this.options.height / 2;
    };

    Renderer3D.prototype.get = function(option) {
      return this.options[option];
    };

    Renderer3D.prototype.set = function(option, value) {
      return this.options[option] = value;
    };

    Renderer3D.prototype.getOrbiter = function() {
      return this.orbiter;
    };

    Renderer3D.prototype.getPlanet = function() {
      return this.planet;
    };

    return Renderer3D;

  })();

}).call(this);
