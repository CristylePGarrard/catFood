const map =
  L.map("map").setView(
    [20, 0],
    2
  );

L.tileLayer(
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  {
    attribution:
      '&copy; OpenStreetMap contributors'
  }
).addTo(map);

map.pm.addControls({
  position: "topleft",
  drawText: false,
  drawCircle: false,
  drawCircleMarker: false,
  drawMarker: false,
  drawPolyline: false,
  drawRectangle: false,
  drawPolygon: true,
  editMode: true,
  dragMode: false,
  cutPolygon: false,
  removalMode: true
});

let currentGeometry = null;
let currentLayer = null;

function updateGeometryOutput() {

  const output =
    document.getElementById(
      "geometryOutput"
    );

  if (!currentGeometry) {

    output.textContent =
      "No geometry drawn yet.";

    return;

  }

  output.textContent =
    JSON.stringify(
      currentGeometry,
      null,
      2
    );

}


function updateGeometryFromLayer(layer) {

  if (!layer) {
    currentGeometry = null;
    updateGeometryOutput();
    return;
  }

  const geoJSON =
    layer.toGeoJSON();

  currentGeometry =
    geoJSON.geometry;

  updateGeometryOutput();

}
map.on(
  "pm:create",
  event => {

    currentLayer =
      event.layer;

    updateGeometryFromLayer(
      currentLayer
    );

    currentLayer.on(
      "pm:edit",
      () => {

        updateGeometryFromLayer(
          currentLayer
        );

      }
    );

  }
);


map.on(
  "pm:remove",
  event => {

    if (
      currentLayer &&
      event.layer === currentLayer
    ) {

      currentLayer = null;
      currentGeometry = null;

      updateGeometryOutput();

    }

  }
);