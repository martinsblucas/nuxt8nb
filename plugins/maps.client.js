
export default function ({$config}, inject) {
  if (!$config.maps.apiKey)
    console.error('[Maps plugin] API Key is not configured')

  let isLoaded = false
  let waiting = []

  addScript()

  inject('maps', {
    showMap,
    makeAutoComplete,
  })

  // adds Google Maps library to script tag and set the callback as initGoogleMaps
  function addScript() {
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${$config.maps.apiKey}&libraries=places&callback=initGoogleMaps`
    script.async = true
    window.initGoogleMaps = initGoogleMaps
    document.head.appendChild(script)
  }

  // when Google Maps isLoaded, call each function stored in the waiting array
  function initGoogleMaps() {
    isLoaded = true
    waiting.forEach((map) => {
      if (typeof map.fn === 'function') map.fn(...map.arguments)
    })
  }

  // each showMap called before isLoaded is added to the waiting array; after isLoaded, render the map
  function showMap({ canvas, lat, lng, markers }) {
    if (!markers)
      markers = []

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
      styles: [
        {
          featureType: 'poi.business',
          elementType: 'labels.icon',
          stylers: [
            {
              visibility: 'off',
            },
          ],
        },
      ],
    }

    const map = new window.google.maps.Map(canvas, mapOptions)

    if (!markers.length) {
      const marker = new window.google.maps.Marker({ position })
      marker.setMap(map)
      return
    }

    const bounds = new window.google.maps.LatLngBounds()
    markers.forEach((home) => {
      const position = { lat: home.lat, lng: home.lng }
      const marker = new window.google.maps.Marker({
        position,
        label: {
          text: `$${home.price}`,
          className: `marker home-${home.id}`,
        },
        icon: 'https://maps.gstatic.com/mapfiles/transparent.png',
        clickable: false,
      })
      marker.setMap(map)
      bounds.extend(position)
    })

    map.fitBounds(bounds)
  }

  // each makeAutoComplete called before isLoaded is added to the waiting array; after isLoaded, make the auto complete
  function makeAutoComplete(input, types = ['(cities)']) {
    if (!isLoaded) {
      waiting.push({
        fn: makeAutoComplete,
        arguments,
      })
      return
    }

    const autoComplete = new window.google.maps.places.Autocomplete(input, {
      types,
    })

    autoComplete.addListener('place_changed', () => {
      const place = autoComplete.getPlace()
      input.dispatchEvent(new CustomEvent('changed', { detail: place }))
    })
  }
}
