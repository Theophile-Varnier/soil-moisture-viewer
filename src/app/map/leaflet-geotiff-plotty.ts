// Depends on:
// https://github.com/santilland/plotty

import * as plotty from 'plotty';
import * as L from 'leaflet';
import { LeafletGeotiffRenderer } from './leaflet-geotiff-rgb';

export const LeafletGeotiffPlotty = LeafletGeotiffRenderer.extend({
  options: {
    applyDisplayRange: true,
    colorScale: 'viridis',
    clampLow: true,
    clampHigh: true,
    displayMin: 0,
    displayMax: 1,
    noDataValue: -9999,
    useWebGL: false,
  },

  initialize: function (options: any) {
    this.name = 'Plotty';

    L.setOptions(this, options);
    this._preLoadColorScale();
  },

  setColorScale: function (colorScale: any) {
    this.options.colorScale = colorScale;
    this.parent._reset();
  },

  setDisplayRange: function (min: any, max: any) {
    this.options.displayMin = min;
    this.options.displayMax = max;
    this.parent._reset();
  },

  setClamps: function (clampLow: any, clampHigh: any) {
    this.options.clampLow = clampLow;
    this.options.clampHigh = clampHigh;
    this.parent._reset();
  },

  getColorbarOptions() {
    return Object.keys(plotty.colorscales);
  },

  getColourbarDataUrl(paletteName: any) {
    const canvas = document.createElement('canvas');
    const plot = new plotty.plot({
      canvas,
      data: [0],
      width: 1,
      height: 1,
      domain: [0, 1],
      colorScale: paletteName,
      clampLow: true,
      clampHigh: true,
      useWebGL: this.options.useWebGL,
    });
    const dataUrl = plot.colorScaleCanvas.toDataURL();
    canvas.remove();
    return dataUrl;
  },

  _preLoadColorScale: function () {
    var canvas = document.createElement('canvas');
    var plot = new plotty.plot({
      canvas: canvas,
      data: [0],
      width: 1,
      height: 1,
      domain: [this.options.displayMin, this.options.displayMax],
      colorScale: this.options.colorScale,
      clampLow: this.options.clampLow,
      clampHigh: this.options.clampHigh,
      useWebGL: this.options.useWebGL,
    });
    this.colorScaleData = plot.colorScaleCanvas.toDataURL();
  },

  render: function (raster: any, canvas: any, ctx: any, args: any) {
    var plottyCanvas = document.createElement('canvas');

    let matrixTransform = [1, 0, 0, 0, 1, 0, 0, 0, 1];

    if (this.options.useWebGL) {
      matrixTransform = [1, 0, 0, 0, -1, 0, 0, raster.height, 1];
    }

    let sortedDate = raster.data[0]
      .filter(function (v: any, index: any, self: any) {
        return !isNaN(v);
      })
      .sort();

    this.options.displayMin = sortedDate[0];
    this.options.displayMax = sortedDate[sortedDate.length - 1];

    var plot = new plotty.plot({
      data: raster.data[0], // fix for use with rgb conversion (appending alpha channel)
      width: raster.width,
      height: raster.height,
      domain: [this.options.displayMin, this.options.displayMax],
      displayRange: [this.options.displayMin, this.options.displayMax],
      applyDisplayRange: this.options.applyDisplayRange,
      colorScale: this.options.colorScale,
      clampLow: this.options.clampLow,
      clampHigh: this.options.clampHigh,
      canvas: plottyCanvas,
      matrix: matrixTransform,
      useWebGL: this.options.useWebGL,
    });
    plot.setNoDataValue(this.options.noDataValue);
    plot.render();

    this.colorScaleData = plot.colorScaleCanvas.toDataURL();
    var rasterImageData;

    if (this.options.useWebGL) {
      let imageDataArray = new Uint8ClampedArray(
        raster.width * raster.height * 4
      );
      let gl = plottyCanvas.getContext('webgl')!;
      gl.readPixels(
        0,
        0,
        raster.width,
        raster.height,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        imageDataArray
      );
      rasterImageData = new ImageData(
        imageDataArray,
        raster.width,
        raster.height
      );
    } else {
      rasterImageData = plottyCanvas
        .getContext('2d')
        ?.getImageData(0, 0, plottyCanvas.width, plottyCanvas.height);
    }
    var imageData = this.parent.transform(rasterImageData, args);
    ctx.putImageData(imageData, args.xStart, args.yStart);
  },
});
