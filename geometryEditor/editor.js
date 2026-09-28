const API_URL =
  "https://script.google.com/macros/s/AKfycbzEZPjdh6VhO_sc3147Tmv_FR3A3kgud70TxzRR3IU6K5EWQPW6Jlw7Yo_pRc-dAYwv/exec";

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

async function loadRegions() {

  const regionSelect =
    document.getElementById(
      "regionSelect"
    );

  try {

    const response =
      await fetch(API_URL);

    if (!response.ok) {
      throw new Error(
        `API request failed: ${response.status}`
      );
    }

    const data =
      await response.json();

    if (
      !data.success ||
      !Array.isArray(data.regions)
    ) {
      throw new Error(
        "API did not return regions."
      );
    }

    data.regions
      .sort(
        (a, b) =>
          a.name.localeCompare(b.name)
      )
      .forEach(
        region => {

          const option =
            document.createElement(
              "option"
            );

          option.value =
            region.id;

          option.textContent =
            region.name;

          regionSelect.appendChild(
            option
          );

        }
      );

  } catch (error) {

    console.error(
      "Could not load regions:",
      error
    );

  }

}
loadRegions();