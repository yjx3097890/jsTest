
(function (window) {
    var OBB = function (centerPoint, width, height, rotation) {
        this.centerPoint = centerPoint;
        this.extents = [width / 2, height / 2];
        this.axes = [new Vector2(Math.cos(rotation), Math.sin(rotation)), new Vector2(-1 * Math.sin(rotation), Math.cos(rotation))];

        this._width = width;
        this._height = height;
        this._rotation = rotation;
    }
    OBB.prototype = {
        setWidth: function (w) {
            this._width = w;
            this.extents = [w / 2, this._height / 2];
        },
        setHeight: function (h) {
            this._height = h;
            this.extents = [this._width / 2, h / 2];
        },
        setRotation: function (r) {
            this._rotation = r;
            this.axes = [new Vector2(Math.cos(r), Math.sin(r)), new Vector2(-1 * Math.sin(r), Math.cos(r))];
        },
        getProjectionRadius: function (axis) {
            return this.extents[0] * Math.abs(axis.dot(this.axes[0])) + this.extents[1] * Math.abs(axis.dot(this.axes[1]));
        }
    }
    window.OBB = OBB;
})(window);
