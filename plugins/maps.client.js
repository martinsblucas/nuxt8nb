export default function (context, inject) {
  if (!process.env.MAPS_API_KEY) {
    console.error('[Maps plugin] API Key is not configured')
    return
  }

  let mapLoaded = false
  let mapWaiting = null

  addScript()

  inject('maps', {
    showMap,
  })

  function addScript() {
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.MAPS_API_KEY}&libraries=places&callback=initMap`
    script.async = true
    window.initMap = initMap
    document.head.appendChild(script)
  }

  function initMap() {
    mapLoaded = true
    if (mapWaiting) {
      renderMap(mapWaiting)
      mapWaiting = null
    }
  }

  function showMap({ canvas, lat, lng }) {
    if (mapLoaded) renderMap({ canvas, lat, lng })
    else mapWaiting = { canvas, lat, lng }
  }

  function renderMap({ canvas, lat, lng }) {
    const position = { lat, lng }
    const mapOptions = {
      zoom: 18,
      center: new window.google.maps.LatLng(position),
      disableDefaultUI: true,
      zoomControl: true,
    }

    const map = new window.google.maps.Map(canvas, mapOptions)
    const marker = new window.google.maps.Marker({ position })
    marker.setMap(map)
  }
}
