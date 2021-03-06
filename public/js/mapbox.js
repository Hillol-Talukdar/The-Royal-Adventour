export const displayMap = (locations) => {
    mapboxgl.accessToken = `${process.env.MAPBOX_ACCESS_TOKEN}`;

    var map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/streets-v11",
    });

    const bounds = new mapboxgl.LngLatBounds();

    locations.forEach((loc) => {
        // marker create
        const el = document.createElement("div");
        el.className = "marker";

        // marker add
        new mapboxgl.Marker({
            element: el,
            anchor: "bottom",
        })
            .setLngLat(loc.coordinates)
            .addTo(map);

        // popup add
        new mapboxgl.Popup({
            offset: 30,
        })
            .setLngLat(loc.coordinates)
            .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
            .addTo(map);

        bounds.extend(loc.coordinates);
    });

    map.fitBounds(bounds, {
        padding: {
            left: 100,
            right: 100,
            top: 200,
            bottom: 150,
        },
    });
};
