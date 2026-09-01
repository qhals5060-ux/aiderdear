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
    /* Anatomical boundaries are evaluated in model space, so rotating the
       camera never reassigns a point to another lobe. */
    if (x > 0.86 + Math.max(0, y) * 0.12) return 'occipital';
    if (y < -0.22 + Math.max(-0.08, x) * 0.08) return 'temporal';
    if (x < -0.24 + y * 0.16) return 'frontal';
    return 'parietal';
  }

  var regionAnchors = {
    frontal: { x: -1.04, y: 0.31, z: 0.67 },
    parietal: { x: 0.17, y: 0.73, z: 0.66 },
    temporal: { x: 0.08, y: -0.36, z: 0.69 },
    occipital: { x: 1.24, y: 0.18, z: 0.47 },
    cerebellum: { x: 0.94, y: -0.79, z: 0.51 },
    brainstem: { x: 0.22, y: -1.18, z: 0.2 },
    hippocampus: { x: 0.04, y: -0.25, z: 0.43 },
    amygdala: { x: -0.49, y: -0.18, z: 0.44 }
  };

  var subregionPalette = ['#D96D5F', '#D9A46D', '#D9C56D', '#64C59E', '#5FC5D9', '#6D9AD9', '#6D6DD9', '#9A6FD9', '#D96DA4'];

  function shapeCortex(point, options, longitude, latitude) {
    if (!options.brainShape) return point;
    var nx = Math.cos(latitude) * Math.cos(longitude);
    var ny = Math.sin(latitude);
    var frontalBulge = Math.max(0, -nx - 0.22);
    var occipitalTaper = Math.max(0, nx - 0.48);
    var temporalDrop = Math.max(0, -ny - 0.22) * Math.max(0, 1 - Math.abs(nx) * 0.7);
    point.x -= frontalBulge * 0.09;
    point.x -= occipitalTaper * 0.07;
    point.y += frontalBulge * 0.045;
    point.y -= temporalDrop * 0.085;
    if (ny < -0.5) point.y += Math.abs(ny + 0.5) * 0.11;
    if (ny > 0.66) point.y -= (ny - 0.66) * 0.07;
    point.z *= 1 - occipitalTaper * 0.06;
    return point;
  }

  function ellipsoid(options) {
    var vertices = [];
    var faces = [];
    var uSegments = options.uSegments || 48;
    var vSegments = options.vSegments || 30;
    for (var v = 0; v <= vSegments; v += 1) {
      var latitude = -Math.PI / 2 + Math.PI * v / vSegments;
      for (var u = 0; u <= uSegments; u += 1) {
        var longitude = Math.PI * 2 * u / uSegments;
        var wave = options.gyri
          ? 1 + 0.027 * Math.sin(longitude * 7 + latitude * 3) + 0.018 * Math.cos(longitude * 11 - latitude * 5) + 0.011 * Math.sin(longitude * 17 + latitude * 9)
          : 1;
        var cosLat = Math.cos(latitude);
        vertices.push(shapeCortex({
          x: options.cx + options.rx * cosLat * Math.cos(longitude) * wave,
          y: options.cy + options.ry * Math.sin(latitude) * wave,
          z: options.cz + options.rz * cosLat * Math.sin(longitude) * wave
        }, options, longitude, latitude));
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
        rx: 1.49,
        ry: 1.03,
        rz: 0.405,
        gyri: true,
        brainShape: true,
        classify: function (point) { return corticalRegion(point.x, point.y); }
      }));
    });
    meshes.push(ellipsoid({ id: 'cerebellum', cx: 0.86, cy: -0.72, cz: 0, rx: 0.64, ry: 0.43, rz: 0.56, gyri: true, uSegments: 40, vSegments: 24 }));
    meshes.push(ellipsoid({ id: 'brainstem', cx: 0.2, cy: -1.04, cz: 0, rx: 0.22, ry: 0.54, rz: 0.21, uSegments: 28, vSegments: 20 }));
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

  function projector(width, height, yaw, pitch, focus, zoom) {
    var scale = Math.min(width / 4.05, height / 3.18) * (zoom || 1);
    var camera = 4.55;
    var center = focus ? rotate(focus, yaw, pitch) : { x: 0, y: 0, z: 0 };
    return function (point) {
      var rotated = rotate(point, yaw, pitch);
      var perspective = camera / (camera - rotated.z);
      return {
        x: width / 2 + (rotated.x - center.x) * scale * perspective,
        y: height / 2 - (rotated.y - center.y) * scale * perspective,
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
    ctx.fillStyle = hit.color;
    ctx.strokeStyle = active ? '#00264B' : 'rgba(255,255,255,.86)';
    ctx.lineWidth = active ? 2.5 : 1.3;
    ctx.beginPath();
    ctx.roundRect(hit.x - width / 2, hit.y - 10, width, 20, 6);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, hit.x, hit.y, width - 8);
  }

  function drawSubregionMarker(ctx, hit, active) {
    ctx.save();
    ctx.globalAlpha = active ? 1 : 0.78;
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = active ? '#00264B' : 'rgba(255,255,255,.95)';
    ctx.lineWidth = active ? 2.4 : 1.4;
    ctx.beginPath();
    ctx.arc(hit.anchorX, hit.anchorY, active ? 5 : 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(hit.anchorX, hit.anchorY);
    ctx.lineTo(hit.x, hit.y);
    ctx.stroke();
    ctx.restore();
  }

  function drawCorticalGrooves(ctx, project, yaw, focused) {
    if (focused) return;
    var visibleSide = Math.cos(yaw) >= 0 ? 1 : -1;
    var bands = [-0.55, -0.28, 0.02, 0.3, 0.57];
    ctx.save();
    ctx.strokeStyle = 'rgba(22,50,68,.17)';
    ctx.lineWidth = 1.15;
    bands.forEach(function (baseY, bandIndex) {
      ctx.beginPath();
      for (var i = 0; i <= 52; i += 1) {
        var t = -1.34 + 2.62 * i / 52;
        var envelope = Math.max(0, 1 - Math.pow(t / 1.52, 2));
        var y = 0.12 + baseY * Math.sqrt(envelope) + Math.sin(i * 0.7 + bandIndex) * 0.035;
        var z = visibleSide * (0.42 + 0.39 * Math.sqrt(envelope) * Math.max(0.2, 1 - Math.abs(baseY) * 0.45));
        var point = project({ x: t, y: y, z: z });
        if (i === 0) ctx.moveTo(point.x, point.y); else ctx.lineTo(point.x, point.y);
      }
      ctx.stroke();
    });
    [-0.95, -0.48, 0.05, 0.55, 0.97].forEach(function (baseX, lineIndex) {
      ctx.beginPath();
      for (var j = 0; j <= 30; j += 1) {
        var y = -0.62 + 1.45 * j / 30;
        var x = baseX + Math.sin(j * 0.78 + lineIndex) * 0.04;
        var envelope = Math.max(0, 1 - Math.pow(x / 1.53, 2) - Math.pow((y - 0.1) / 1.12, 2) * 0.45);
        var z = visibleSide * (0.43 + 0.36 * Math.sqrt(envelope));
        var point = project({ x: x, y: y, z: z });
        if (j === 0) ctx.moveTo(point.x, point.y); else ctx.lineTo(point.x, point.y);
      }
      ctx.stroke();
    });
    ctx.restore();
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
      var visibleSide = Math.cos(yaw) >= 0 ? 1 : -1;
      var focused = Boolean(state.focused && regionAnchors[state.region]);
      var focusAnchor = focused ? Object.assign({}, regionAnchors[state.region], { z: Math.abs(regionAnchors[state.region].z) * visibleSide }) : null;
      /* Leave a reliable safe area for labels, the brainstem and the drop shadow.
         The previous 0.9 fit touched the scene edge at wide desktop aspect ratios. */
      var project = projector(width, height, yaw, pitch, focusAnchor, focused ? 1.28 : 0.82);
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
          var subregion = null;
          if (focused && region === state.region && centroid.z * visibleSide > 0 && Array.isArray(state.subregions) && state.subregions.length) {
            subregion = state.subregions.filter(function (item) { return item.anchor; }).map(function (item, index) {
              var dx = centroid.x - item.anchor.x;
              var dy = centroid.y - item.anchor.y;
              var dz = centroid.z - Math.abs(item.anchor.z) * visibleSide;
              return { item: item, index: index, distance: dx * dx + dy * dy + dz * dz * .36 };
            }).sort(function (a, b) { return a.distance - b.distance; })[0] || null;
          }
          var normal = faceNormal(rotated[face[0]], rotated[face[1]], rotated[face[2]]);
          if (alpha > 0.8 && normal.z < 0.015) return;
          triangles.push({
            points: [projected[face[0]], projected[face[1]], projected[face[2]]],
            depth: (rotated[face[0]].z + rotated[face[1]].z + rotated[face[2]].z) / 3,
            region: region,
            subregionId: subregion && subregion.item.id,
            subregionColor: subregion && (subregion.item.color || subregionPalette[subregion.index % subregionPalette.length]),
            alpha: alpha,
            light: 0.64 + Math.max(-0.25, normal.x * -0.18 + normal.y * 0.2 + normal.z * 0.38)
          });
        });
      });
      triangles.sort(function (a, b) { return a.depth - b.depth; });
      triangles.forEach(function (triangle) {
        var color = regions[triangle.region] ? regions[triangle.region].color : '#9fb4c2';
        var selected = triangle.region === state.region;
        if (focused && !selected) color = '#b9c4c9';
        if (focused && selected && triangle.subregionColor) color = triangle.subregionColor;
        var selectedSubregion = triangle.subregionId && triangle.subregionId === state.subregion;
        context.beginPath();
        context.moveTo(triangle.points[0].x, triangle.points[0].y);
        context.lineTo(triangle.points[1].x, triangle.points[1].y);
        context.lineTo(triangle.points[2].x, triangle.points[2].y);
        context.closePath();
        context.fillStyle = shaded(color, triangle.light + (selected ? 0.12 : 0) + (selectedSubregion ? 0.18 : 0), triangle.alpha * (focused && !selected ? 0.19 : 1));
        context.fill();
        context.strokeStyle = selectedSubregion ? 'rgba(0,38,75,.58)' : selected ? 'rgba(255,255,255,.62)' : 'rgba(0,38,75,.055)';
        context.lineWidth = selectedSubregion ? 1.25 : selected ? 0.74 : 0.2;
        context.stroke();
      });
      drawCorticalGrooves(context, project, yaw, focused);
      var allowed = state.layer === 'deep'
        ? ['hippocampus', 'amygdala', 'brainstem', 'cerebellum']
        : ['frontal', 'parietal', 'temporal', 'occipital', 'cerebellum', 'brainstem'];
      if (focused) allowed = [state.region];
      hits = allowed.map(function (id) {
        var anchor = Object.assign({}, regionAnchors[id], { z: Math.abs(regionAnchors[id].z) * visibleSide });
        var point = project(anchor);
        return { kind: 'region', id: id, x: point.x, y: point.y };
      });
      hits.forEach(function (hit) { drawLabel(context, hit, hit.id === state.region, regions); });
      var subregionHits = (focused ? state.subregions || [] : []).filter(function (item) { return item.anchor; }).map(function (item, index) {
        var anchor = Object.assign({}, item.anchor, { z: Math.abs(item.anchor.z) * visibleSide });
        var point = project(anchor);
        var direction = index % 2 ? 1 : -1;
        var row = Math.floor(index / 2);
        return { kind: 'subregion', id: item.id, label: item.ko, color: item.color || subregionPalette[index % subregionPalette.length], anchorX: point.x, anchorY: point.y, x: Math.max(66, Math.min(width - 66, point.x + direction * (48 + row * 7))), y: Math.max(22, Math.min(height - 22, point.y + (index % 3 - 1) * 21)) };
      });
      subregionHits.forEach(function (hit) { drawSubregionMarker(context, hit, hit.id === state.subregion); });
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
          var labelDistance = Math.hypot(hit.x - x, hit.y - y);
          var surfaceDistance = hit.kind === 'subregion' ? Math.hypot(hit.anchorX - x, hit.anchorY - y) : labelDistance;
          return { hit: hit, distance: Math.min(labelDistance, surfaceDistance) };
        }).sort(function (a, b) { return a.distance - b.distance; })[0];
        if (nearest && nearest.distance < 42) {
          if (nearest.hit.kind === 'subregion') state.subregion = nearest.hit.id;
          else {
            state.region = nearest.hit.id;
            state.focused = true;
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
