(function () {
  'use strict';

  var cachedMeshes = null;
  var resizeObserver = null;

  function hexRgb(hex) {
    var value = String(hex || '#8094a0').replace('#', '');
    if (value.length === 3) value = value.split('').map(function (x) { return x + x; }).join('');
    return {
      r: parseInt(value.slice(0, 2), 16) || 0,
      g: parseInt(value.slice(2, 4), 16) || 0,
      b: parseInt(value.slice(4, 6), 16) || 0
    };
  }

  function shaded(hex, amount, alpha) {
    var color = hexRgb(hex);
    var mix = Math.max(0.25, Math.min(1.35, amount));
    return 'rgba(' + Math.min(255, Math.round(color.r * mix)) + ',' +
      Math.min(255, Math.round(color.g * mix)) + ',' +
      Math.min(255, Math.round(color.b * mix)) + ',' +
      Math.max(0, Math.min(1, alpha)) + ')';
  }

  function corticalRegion(x, y) {
    if (x < -0.48) return 'frontal';
    if (x > 0.88) return 'occipital';
    if (y < -0.24) return 'temporal';
    return 'parietal';
  }

  function ellipsoid(options) {
    var vertices = [];
    var faces = [];
    var uSegments = options.uSegments || 34;
    var vSegments = options.vSegments || 22;
    for (var v = 0; v <= vSegments; v += 1) {
      var latitude = -Math.PI / 2 + Math.PI * v / vSegments;
      for (var u = 0; u <= uSegments; u += 1) {
        var longitude = Math.PI * 2 * u / uSegments;
        var wave = options.gyri
          ? 1 + 0.035 * Math.sin(longitude * 7 + latitude * 3) + 0.022 * Math.cos(longitude * 11 - latitude * 5)
          : 1;
        var cosLat = Math.cos(latitude);
        vertices.push({
          x: options.cx + options.rx * cosLat * Math.cos(longitude) * wave,
          y: options.cy + options.ry * Math.sin(latitude) * wave,
          z: options.cz + options.rz * cosLat * Math.sin(longitude) * wave
        });
      }
    }
    for (var row = 0; row < vSegments; row += 1) {
      for (var col = 0; col < uSegments; col += 1) {
        var a = row * (uSegments + 1) + col;
        var b = a + 1;
        var c = a + (uSegments + 1);
        var d = c + 1;
        faces.push([a, c, b]);
        faces.push([b, c, d]);
      }
    }
    return {
      id: options.id,
      alpha: options.alpha == null ? 1 : options.alpha,
      vertices: vertices,
      faces: faces,
      classify: options.classify || function () { return options.id; }
    };
  }

  function buildMeshes() {
    if (cachedMeshes) return cachedMeshes;
    var meshes = [];
    [-1, 1].forEach(function (side) {
      meshes.push(ellipsoid({
        id: 'cortex',
        cx: -0.03,
        cy: 0.12,
        cz: side * 0.43,
        rx: 1.52,
        ry: 1.07,
        rz: 0.78,
        gyri: true,
        classify: function (point) { return corticalRegion(point.x, point.y); }
      }));
    });
    meshes.push(ellipsoid({ id: 'cerebellum', cx: 0.88, cy: -0.78, cz: 0, rx: 0.67, ry: 0.46, rz: 0.64, gyri: true, uSegments: 28, vSegments: 18 }));
    meshes.push(ellipsoid({ id: 'brainstem', cx: 0.22, cy: -1.12, cz: 0, rx: 0.24, ry: 0.58, rz: 0.24, uSegments: 22, vSegments: 16 }));
    [-1, 1].forEach(function (side) {
      meshes.push(ellipsoid({ id: 'hippocampus', cx: 0.08, cy: -0.25, cz: side * 0.38, rx: 0.62, ry: 0.19, rz: 0.14, uSegments: 24, vSegments: 14 }));
      meshes.push(ellipsoid({ id: 'amygdala', cx: -0.48, cy: -0.2, cz: side * 0.39, rx: 0.2, ry: 0.22, rz: 0.18, uSegments: 20, vSegments: 14 }));
    });
    cachedMeshes = meshes;
    return meshes;
  }

  function rotate(point, yaw, pitch) {
    var cy = Math.cos(yaw);
    var sy = Math.sin(yaw);
    var cp = Math.cos(pitch);
    var sp = Math.sin(pitch);
    var x1 = point.x * cy + point.z * sy;
    var z1 = -point.x * sy + point.z * cy;
    return {
      x: x1,
      y: point.y * cp - z1 * sp,
      z: point.y * sp + z1 * cp
    };
  }

  function projector(width, height, yaw, pitch) {
    var scale = Math.min(width / 4.0, height / 3.12);
    var camera = 4.55;
    return function (point) {
      var rotated = rotate(point, yaw, pitch);
      var perspective = camera / (camera - rotated.z);
      return {
        x: width / 2 + rotated.x * scale * perspective,
        y: height / 2 - rotated.y * scale * perspective,
        z: rotated.z,
        scale: perspective
      };
    };
  }

  function faceNormal(a, b, c) {
    var ux = b.x - a.x;
    var uy = b.y - a.y;
    var uz = b.z - a.z;
    var vx = c.x - a.x;
    var vy = c.y - a.y;
    var vz = c.z - a.z;
    var nx = uy * vz - uz * vy;
    var ny = uz * vx - ux * vz;
    var nz = ux * vy - uy * vx;
    var length = Math.hypot(nx, ny, nz) || 1;
    return { x: nx / length, y: ny / length, z: nz / length };
  }

  function drawLabel(ctx, hit, active, regions) {
    var text = regions[hit.id].ko;
    ctx.font = (active ? '800 ' : '700 ') + '11px Arial';
    var width = ctx.measureText(text).width + 15;
    ctx.fillStyle = active ? '#00264B' : 'rgba(250,250,248,.88)';
    ctx.strokeStyle = active ? '#00264B' : 'rgba(0,38,75,.22)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(hit.x - width / 2, hit.y - 12, width, 24, 8);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = active ? '#fff' : '#16344c';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, hit.x, hit.y);
  }

  function drawSubregionLabel(ctx, hit, active) {
    var text = hit.label;
    ctx.font = (active ? '800 ' : '700 ') + '9px Arial';
    var width = Math.min(122, ctx.measureText(text).width + 13);
    ctx.fillStyle = active ? hit.color : 'rgba(255,255,255,.9)';
    ctx.strokeStyle = active ? hit.color : 'rgba(0,38,75,.28)';
    ctx.lineWidth = active ? 1.6 : 1;
    ctx.beginPath();
    ctx.roundRect(hit.x - width / 2, hit.y - 10, width, 20, 6);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = active ? '#fff' : '#18384d';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, hit.x, hit.y, width - 8);
  }

  function init(state) {
    var canvas = document.getElementById('brain3dCanvas');
    var scene = canvas && canvas.closest('.brain-scene');
    var regions = state && state.regions;
    if (!canvas || !scene || !regions) return;
    if (resizeObserver) resizeObserver.disconnect();
    var context = canvas.getContext('2d');
    var hits = [];
    var pointer = null;
    var moved = false;

    function render() {
      var rect = scene.getBoundingClientRect();
      var ratio = Math.min(2, window.devicePixelRatio || 1);
      var width = Math.max(320, Math.round(rect.width));
      var height = Math.max(260, Math.round(rect.height));
      if (canvas.width !== Math.round(width * ratio) || canvas.height !== Math.round(height * ratio)) {
        canvas.width = Math.round(width * ratio);
        canvas.height = Math.round(height * ratio);
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
      }
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.clearRect(0, 0, width, height);
      var shadow = context.createRadialGradient(width * .5, height * .78, 4, width * .5, height * .78, Math.min(width * .34, height * .28));
      shadow.addColorStop(0, 'rgba(13,39,57,.22)');
      shadow.addColorStop(.55, 'rgba(13,39,57,.08)');
      shadow.addColorStop(1, 'rgba(13,39,57,0)');
      context.fillStyle = shadow;
      context.beginPath();
      context.ellipse(width * .5, height * .78, Math.min(width * .34, 250), Math.min(height * .12, 48), 0, 0, Math.PI * 2);
      context.fill();
      var yaw = Number(state.rotation || 0) * Math.PI / 180;
      var pitch = Number(state.pitch || 0) * Math.PI / 180;
      var project = projector(width, height, yaw, pitch);
      var triangles = [];
      buildMeshes().forEach(function (mesh) {
        var isCortex = mesh.id === 'cortex';
        var isDeep = mesh.id === 'hippocampus' || mesh.id === 'amygdala';
        var alpha = state.layer === 'deep'
          ? (isCortex ? 0.13 : isDeep ? 1 : 0.52)
          : (isDeep ? 0.12 : 1);
        var rotated = mesh.vertices.map(function (vertex) { return rotate(vertex, yaw, pitch); });
        var projected = mesh.vertices.map(project);
        mesh.faces.forEach(function (face) {
          var sourceA = mesh.vertices[face[0]];
          var sourceB = mesh.vertices[face[1]];
          var sourceC = mesh.vertices[face[2]];
          var centroid = {
            x: (sourceA.x + sourceB.x + sourceC.x) / 3,
            y: (sourceA.y + sourceB.y + sourceC.y) / 3,
            z: (sourceA.z + sourceB.z + sourceC.z) / 3
          };
          var region = mesh.classify(centroid);
          var normal = faceNormal(rotated[face[0]], rotated[face[1]], rotated[face[2]]);
          triangles.push({
            points: [projected[face[0]], projected[face[1]], projected[face[2]]],
            depth: (rotated[face[0]].z + rotated[face[1]].z + rotated[face[2]].z) / 3,
            region: region,
            alpha: alpha,
            light: 0.64 + Math.max(-0.25, normal.x * -0.18 + normal.y * 0.2 + normal.z * 0.38)
          });
        });
      });
      triangles.sort(function (a, b) { return a.depth - b.depth; });
      triangles.forEach(function (triangle) {
        var color = regions[triangle.region] ? regions[triangle.region].color : '#9fb4c2';
        var selected = triangle.region === state.region;
        context.beginPath();
        context.moveTo(triangle.points[0].x, triangle.points[0].y);
        context.lineTo(triangle.points[1].x, triangle.points[1].y);
        context.lineTo(triangle.points[2].x, triangle.points[2].y);
        context.closePath();
        context.fillStyle = shaded(color, triangle.light + (selected ? 0.12 : 0), triangle.alpha);
        context.fill();
        context.strokeStyle = selected ? 'rgba(255,255,255,.45)' : 'rgba(0,38,75,.06)';
        context.lineWidth = selected ? 0.75 : 0.26;
        context.stroke();
      });

      var anchors = {
        frontal: { x: -1.05, y: 0.32, z: 0.72 },
        parietal: { x: 0.18, y: 0.77, z: 0.71 },
        temporal: { x: 0.08, y: -0.38, z: 0.76 },
        occipital: { x: 1.31, y: 0.2, z: 0.48 },
        cerebellum: { x: 0.98, y: -0.82, z: 0.58 },
        brainstem: { x: 0.23, y: -1.22, z: 0.23 },
        hippocampus: { x: 0.05, y: -0.25, z: 0.47 },
        amygdala: { x: -0.5, y: -0.18, z: 0.48 }
      };
      var allowed = state.layer === 'deep'
        ? ['hippocampus', 'amygdala', 'brainstem', 'cerebellum']
        : ['frontal', 'parietal', 'temporal', 'occipital', 'cerebellum', 'brainstem'];
      hits = allowed.map(function (id) {
        var point = project(anchors[id]);
        return { kind: 'region', id: id, x: point.x, y: point.y };
      });
      hits.forEach(function (hit) { drawLabel(context, hit, hit.id === state.region, regions); });
      var subregionHits = (state.subregions || []).filter(function (item) { return item.anchor; }).map(function (item) {
        var point = project(item.anchor);
        return { kind: 'subregion', id: item.id, label: item.ko, color: regions[state.region] ? regions[state.region].color : '#00264B', x: point.x, y: point.y };
      });
      subregionHits.forEach(function (hit) { drawSubregionLabel(context, hit, hit.id === state.subregion); });
      hits = hits.concat(subregionHits);
      var axis = document.getElementById('brainRotationValue');
      if (axis) axis.textContent = Math.round(state.rotation) + '°';
    }

    canvas.addEventListener('pointerdown', function (event) {
      pointer = { x: event.clientX, y: event.clientY, yaw: state.rotation, pitch: state.pitch };
      moved = false;
      canvas.setPointerCapture(event.pointerId);
      scene.classList.add('dragging');
    });
    canvas.addEventListener('pointermove', function (event) {
      if (!pointer) return;
      var dx = event.clientX - pointer.x;
      var dy = event.clientY - pointer.y;
      if (Math.hypot(dx, dy) > 4) moved = true;
      state.rotation = pointer.yaw + dx * 0.34;
      state.pitch = Math.max(-35, Math.min(28, pointer.pitch - dy * 0.28));
      render();
    });
    canvas.addEventListener('pointerup', function (event) {
      if (!pointer) return;
      if (!moved) {
        var rect = canvas.getBoundingClientRect();
        var x = event.clientX - rect.left;
        var y = event.clientY - rect.top;
        var nearest = hits.map(function (hit) {
          return { hit: hit, distance: Math.hypot(hit.x - x, hit.y - y) };
        }).sort(function (a, b) { return a.distance - b.distance; })[0];
        if (nearest && nearest.distance < 42) {
          if (nearest.hit.kind === 'subregion') state.subregion = nearest.hit.id;
          else {
            state.region = nearest.hit.id;
            state.subregion = '';
            state.layer = regions[state.region].group.indexOf('DEEP') >= 0 ? 'deep' : state.layer;
          }
          if (typeof state.rerender === 'function') state.rerender();
        }
      }
      pointer = null;
      scene.classList.remove('dragging');
    });
    canvas.addEventListener('pointercancel', function () {
      pointer = null;
      scene.classList.remove('dragging');
    });
    if (typeof ResizeObserver === 'function') {
      resizeObserver = new ResizeObserver(render);
      resizeObserver.observe(scene);
    } else {
      window.addEventListener('resize', render, { passive: true });
    }
    render();
  }

  window.AiderLogBrain3D = { init: init };
}());
