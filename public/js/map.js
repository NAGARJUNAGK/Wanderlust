document.addEventListener("DOMContentLoaded", async () => {
  // Use MapTiler’s Geocoding API to get coordinates from the location name
  const response = await fetch(
    `https://api.maptiler.com/geocoding/${encodeURIComponent(locationName)}.json?key=${mapTilerKey}`
  );
  const data = await response.json();

  if (!data || !data.features || data.features.length === 0) {
    alert("Location not found");
    return;
  }

  const [lng, lat] = data.features[0].geometry.coordinates;

  const map = new maplibregl.Map({
    container: 'map',
    style: `https://api.maptiler.com/maps/streets/style.json?key=${mapTilerKey}`,
    center: [lng, lat],
    zoom: 12
  });

  new maplibregl.Marker({color:"red",rotation: 0 })
    .setLngLat([lng, lat])
    .addTo(map);

  map.addControl(geocoder, 'top-left');

  // ✅ On map click, redirect to Google Maps
  map.on('click', (e) => {
    const clickedLng = e.lngLat.lng;
    const clickedLat = e.lngLat.lat;
    const googleMapsUrl = `https://www.google.com/maps?q=${clickedLat},${clickedLng}`;
    window.open(googleMapsUrl, '_blank'); // Open in new tab
    console.log("map click ready")
  });
});