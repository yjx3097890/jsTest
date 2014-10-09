(function (window) {

    var CollisionDetector = {


        detectorOBBvsOBB: function (ra, rb) {
            var nv = ra.centerPoint.sub(rb.centerPoint);
            for (var i = 0; i < 2; i++) {
                var axisA = ra.axes[i];
                if (ra.getProjectionRadius(axisA) + rb.getProjectionRadius(axisA) <= Math.abs(nv.dot(axisA))) return false;
                var axisB = rb.axes[i];
                if (ra.getProjectionRadius(axisB) + rb.getProjectionRadius(axisB) <= Math.abs(nv.dot(axisB))) return false;
            }
            return true;
        }

    }
    window.CollisionDetector = CollisionDetector;
})(window)

