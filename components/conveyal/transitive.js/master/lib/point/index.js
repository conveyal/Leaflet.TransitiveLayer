var augment = require('augment');
var each = require('each');

var PointLabel = require('../labeler/pointlabel');

var debug = require('debug')('transitive:point');

var Point = augment(Object, function() {

  this.constructor = function(data) {
    for (var key in data) {
      this[key] = data[key];
    }

    this.paths = [];
    this.renderData = [];

    this.label = new PointLabel(this);
    this.renderLabel = true;

    this.focused = true;
    this.sortableType = 'POINT';

    this.placeOffsets = {
      x: 0,
      y: 0
    };

    this.zIndex = 10000;
  };

  /**
   * Get unique ID for point -- must be defined by subclass
   */

  this.getId = function() {};

  this.getElementId = function() {
    return this.getType().toLowerCase() + '-' + this.getId();
  };

  /**
   * Get Point type -- must be defined by subclass
   */

  this.getType = function() {};

  /**
   * Get Point name
   */

  this.getName = function() {
    return this.getType() + ' point (ID=' + this.getId() + ')';
  };

  /**
   * Get latitude
   */

  this.getLat = function() {
    return 0;
  };

  /**
   * Get longitude
   */

  this.getLon = function() {
    return 0;
  };

  this.containsSegmentEndPoint = function() {
    return false;
  };

  this.containsBoardPoint = function() {
    return false;
  };

  this.containsAlightPoint = function() {
    return false;
  };

  this.containsTransferPoint = function() {
    return false;
  };

  this.getPatterns = function() {
    return [];
  };

  /**
   * Draw the point
   *
   * @param {Display} display
   */

  this.render = function(display) {
    this.label.svgGroup = null;
  };

  /**
   * Refresh a previously drawn point
   *
   * @param {Display} display
   */

  this.refresh = function(display) {};

  this.addRenderData = function() {};

  this.clearRenderData = function() {};

  this.containsFromPoint = function() {
    return false;
  };

  this.containsToPoint = function() {
    return false;
  };

  this.initSvg = function(display) {
    // set up the main svg group for this stop
    this.svgGroup = display.svg.append('g')
      .attr('id', 'transitive-' + this.getType().toLowerCase() + '-' + this
        .getId())
    //.attr('class', 'transitive-sortable')
    .datum(this);

    this.markerSvg = this.svgGroup.append('g');
    this.labelSvg = this.svgGroup.append('g');
  };

  //** Shared geom utility functions **//

  this.constructMergedMarker = function(display) {

    var dataArray = this.getRenderDataArray();
    var xValues = [],
      yValues = [];
    dataArray.forEach(function(data) {
      var x = data.x; //display.xScale(data.x) + data.offsetX;
      var y = data.y; //display.yScale(data.y) - data.offsetY;
      xValues.push(x);
      yValues.push(y);
    });
    var minX = Math.min.apply(Math, xValues),
      minY = Math.min.apply(Math, yValues);
    var maxX = Math.max.apply(Math, xValues),
      maxY = Math.max.apply(Math, yValues);

    // retrieve marker type and radius from the styler
    var markerType = display.styler.compute(display.styler.stops_merged[
      'marker-type'], display, {
      owner: this
    });
    var stylerRadius = display.styler.compute(display.styler.stops_merged.r,
      display, {
        owner: this
      });

    var width, height, r;

    // if this is a circle marker w/ a styler-defined fixed radius, use that
    if (markerType === 'circle' && stylerRadius) {
      width = height = stylerRadius * 2;
      r = stylerRadius;
    }

    // otherwise, this is a dynamically-sized marker
    else {

      var dx = maxX - minX,
        dy = maxY - minY;

      var markerPadding = display.styler.compute(display.styler.stops_merged[
        'marker-padding'], display, {
        owner: this
      }) || 0;

      var patternRadius = display.styler.compute(display.styler[
        this.patternStylerKey].r, display, {
        owner: this
      });
      r = parseFloat(patternRadius) + markerPadding;

      if (markerType === 'circle') {
        width = height = Math.max(dx, dy) + 2 * r;
        r = width / 2;
      } else {
        width = dx + 2 * r;
        height = dy + 2 * r;
        if (markerType === 'rectangle') r = 0;
      }
    }

    return {
      x: (minX + maxX) / 2 - width / 2,
      y: (minY + maxY) / 2 - height / 2,
      width: width,
      height: height,
      rx: r,
      ry: r
    };

  };

  this.initMarkerData = function(display) {

    if (this.getType() !== 'STOP' && this.getType() !== 'MULTI') return;

    this.mergedMarkerData = this.constructMergedMarker(display);

    this.placeOffsets = {
      x: 0,
      y: 0
    };
    if (this.adjacentPlace) {
      var placeBBox = this.adjacentPlace.getMarkerBBox();

      var placeR = display.styler.compute(display.styler.places.r, display, {
        owner: this.adjacentPlace
      });

      var placeX = display.xScale(this.adjacentPlace.worldX);
      var placeY = display.yScale(this.adjacentPlace.worldY);

      var thisR = this.mergedMarkerData.width / 2;
      var thisX = this.mergedMarkerData.x + thisR,
        thisY = this.mergedMarkerData.y + thisR;

      var dx = thisX - placeX,
        dy = thisY - placeY;
      var dist = Math.sqrt(dx * dx + dy * dy);

      if (placeR + thisR > dist) {
        var f = (placeR + thisR) / dist;
        this.placeOffsets = {
          x: (dx * f) - dx,
          y: (dy * f) - dy
        };

        this.mergedMarkerData.x += this.placeOffsets.x;
        this.mergedMarkerData.y += this.placeOffsets.y;

        each(this.graphVertex.incidentEdges(), function(edge) {
          each(edge.renderSegments, function(segment) {
            segment.refreshRenderData(display);
          });
        });
      }
    }
  };

  this.refreshLabel = function(display) {
    if (!this.renderLabel) return;
    this.label.refresh(display);
  };

  this.getMarkerBBox = function() {
    return this.markerSvg.node().getBBox();
  };

  this.setFocused = function(focused) {
    this.focused = focused;
  };

  this.isFocused = function() {
    return (this.focused === true);
  };

  this.runFocusTransition = function(display, callback) {};

  this.setAllPatternsFocused = function() {};

  this.getZIndex = function() {
    return this.zIndex;
  };

  this.getAverageCoord = function() {
    var dataArray = this.getRenderDataArray();

    var xTotal = 0,
      yTotal = 0;
    each(dataArray, function(data) {
      xTotal += data.x;
      yTotal += data.y;
    });

    return {
      x: xTotal / dataArray.length,
      y: yTotal / dataArray.length
    };
  };

  this.hasRenderData = function() {
    var dataArray = this.getRenderDataArray();
    return (dataArray && dataArray.length > 0);
  };

  this.makeDraggable = function(transitive) {};

  this.toString = function() {
    return this.getType() + ' point: ' + this.getId() + ' (' + this.getName() +
      ')';
  };

});

/**
 * Expose `Point`
 */

module.exports = Point;
