export default function (context, inject) {
  if (!process.env.MAPS_API_KEY)
    console.error('[Maps plugin] API Key is not configured')

  let isLoaded = false
  let waiting = []

  addScript()

  inject('maps', {
    showMap,
    makeAutoComplete
  })

  // adds Google Maps library to script tag and set the callback as initGoogleMaps
  function addScript() {
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.MAPS_API_KEY}&libraries=places&callback=initGoogleMaps`
    script.async = true
    window.initGoogleMaps = initGoogleMaps
    document.head.appendChild(script)
  }

  // when Google Maps isLoaded, call each showMap function stored in the waiting array
  function initGoogleMaps() {
    isLoaded = true
    waiting.forEach((map) => {
      if (typeof map.fn === 'function') map.fn(...map.arguments)
    })
  }

  // each showMap called before isLoaded is added to the waiting array; after isLoaded, render the map
  function showMap({ canvas, lat, lng }) {
    if (!isLoaded) {
      waiting.push({
        fn: showMap,
        arguments,
      })

      return
    }

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

  function makeAutoComplete(input) {
    if (!isLoaded) {
      waiting.push({
        fn: makeAutoComplete,
        arguments,
      })
      return
    }
    
    const autoComplete = new window.google.maps.places.Autocomplete(input, {
      types: ['(cities)'],
    })

    autoComplete.addListener("place_changed", () => {
      const place = autoComplete.getPlace()
      input.dispatchEvent(new CustomEvent("changed", { detail: place }))
    })
  }
}
