// Forked from https://fergald.github.io/virtual-scroller

const TEMPLATE = `
<style>
  .fps { text-align: center }
</style>

<div style="display:inline-block">
  <svg id="svg">
    <circle cx="0" cy="0" id="circle"/>
    <path stroke-width="1" />
    <path stroke-width="1" />
    <path stroke-width="1" />
    <path stroke-width="1" />
    <path stroke-width="1" />
    <path stroke-width="1" />
    <path stroke-width="1" />
    <path stroke-width="1" />
    <path stroke-width="1" />
    <path stroke-width="1" />
    <path stroke-width="1" />
    <path stroke-width="1" />
    <path stroke-width="1" />
    <path stroke-width="1" />
    <path stroke-width="1" />
    <path stroke-width="1" />
    <path stroke-width="1" />
    <path stroke-width="1" />
    <path stroke-width="1" />
    <path stroke-width="1" />
    <line x1="0" y1="0" stroke="black" id="line"/>
  </svg>
  <div class=fps id=fps></div>
</div>
`;

class RafSpinner extends HTMLElement {
  deg_per_sec = 90;
  last_time = 0;
  data = {color : 0, start_angle: 0, end_angle: 0};
  radius = 145;
  lightness = 50;
  spinner;
  counter = 0;
  paused = false;

  constructor() {
    super();

    let shadowRoot = this.attachShadow({mode: 'open'});
    shadowRoot.innerHTML = TEMPLATE;
    let d = parseFloat(this.getAttribute("d"));
    d = Math.max(d || 100, 20);
    let halfd = d / 2;
    // Init global vars.
    this.radius = halfd - d / 60;
    this.lightness = parseFloat(this.getAttribute("l")) || 50;
    // Init the svg container sizes.
    this.spinner = shadowRoot.getElementById("svg");
    this.spinner.setAttribute("width", d);
    this.spinner.setAttribute("height", d);
    this.spinner.setAttribute("viewBox", "-" + halfd + " -" + halfd + " " + d + " " + d);
    // Init sweeper arm.
    this.line = this.spinner.getElementById("line");
    this.line.setAttribute("stroke-width", 1);
    // Init background.
    let fill = this.getAttribute("background") || "grey";
    let background = this.spinner.getElementById("circle");
    background.setAttribute("r", this.radius);
    background.setAttribute("fill", fill);
    background.setAttribute("stroke-width", 1);
    background.setAttribute("stroke", this.getAttribute('stroke'));
    this.fps = shadowRoot.getElementById("fps");
    this.scheduleUpdate();
  }

  // Advances the current data based on time delta since the last frame.
  updateData(delta) {
    // Start with the same angle as last end angle.
    let start_angle = this.data.end_angle;
    // Cap the delta angle to 90deg to avoid incorrect path parameters.
    let delta_deg = this.deg_per_sec * delta / 1000;
    if (delta_deg >= 90)
      delta_deg = 90;
    // <=  17ms is green
    // >   17ms is orange
    // >= 517ms is red
    let color;
    if (delta <= 17) {
      color = 0;
    } else if (delta >= 500) {
      color = 100;
    } else {
      // linearly map 17-500 to 40-100
      const base = 40;
      color = base + (delta - 17) / (500-17) * (100 - base);
    }
    // Hue 0 is actually red, so just invert the color.
    color = 100 - color;
    // Save off the values.
    this.data.start_angle = start_angle;
    // Make sure angle is in [0, 360).
    this.data.end_angle = (this.data.start_angle + delta_deg) % 360;
    this.data.color = color;
  }
  // Convert an angle to a point on the circle's circumference.
  angleToPoint(angle) {
    let rad = Math.PI * angle / 180;
    return [Math.cos(rad) * this.radius, Math.sin(rad) * this.radius];
  }
  // Redraw the current state.
  redrawSweep() {
    let paths = this.spinner.getElementsByTagName("path");
    // Advance all paths forward.
    for (let i = 0; i < paths.length - 1; ++i) {
      if (paths[i+1].getAttribute("d")) {
        paths[i].setAttribute("d", paths[i+1].getAttribute("d"));
        paths[i].setAttribute("fill", paths[i+1].getAttribute("fill"));
        paths[i].setAttribute("stroke", paths[i+1].getAttribute("stroke"));
      }
    }
    // Populate the last path with data.
    let data_path = paths[paths.length - 1];
    let start_point = this.angleToPoint(this.data.start_angle);
    let end_point = this.angleToPoint(this.data.end_angle);
    let d = "M0,0 ";
    d += "L " + start_point[0] + " " + start_point[1] + " ";
    d += "A " + this.radius + " " + this.radius + " 0 0 1 " + end_point[0] + " " + end_point[1];
    d += " Z";
    let hsl = "hsl(" + this.data.color + ", 100%, " + this.lightness + "%)";
    data_path.setAttribute("d", d);
    data_path.setAttribute("fill", hsl);
    data_path.setAttribute("stroke", hsl);
    // Update the sweeper as well.
    let p = this.angleToPoint(this.data.end_angle);
    this.line.setAttribute("x2", p[0]);
    this.line.setAttribute("y2", p[1]);
  }

  updateFps(delta) {
    this.fps.innerText = (1000/delta).toFixed(2);
  }

  scheduleUpdate() {
    if (!this.paused) {
      requestAnimationFrame((ts) => {this.update(ts)});
    }
  }

  pause() {
    this.paused = true;
  }

  unpause() {
    if (this.paused) {
      this.paused = false;
      this.scheduleUpdate();
    }
  }

  update(timestamp) {
    if (!this.last_time)
      this.last_time = timestamp;
    // Update the data, and redraw.
    let timeDiff = timestamp - this.last_time;
    this.updateData(timeDiff);
    this.redrawSweep();
    this.last_time = timestamp;
    this.updateFps(timeDiff);
    this.scheduleUpdate();
  }
}

customElements.define('raf-spinner', RafSpinner);