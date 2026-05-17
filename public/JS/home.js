// MapLibre GL JS Implementation for Emergency Medicine Finder

const markers = []
const pharmacyMarkers = new Map()
let demo = []
let curentlat = 23.8103
let curentlng = 90.4125
let searchTimeout = null
let suggestionsTimeout = null
let userMarker = null
let userPulse = null
let userLocationResolved = false
let map = null
let isNewSearch = false // Flag to track if this is a fresh search

// ==================== LOCATION DETECTION ====================

// City coordinates for Bangladesh
const cityCoords = {
  dhaka: { lat: 23.8103, lng: 90.4125, name: "Dhaka" },
  chattogram: { lat: 22.3569, lng: 91.7832, name: "Chattogram" },
  sylhet: { lat: 24.8967, lng: 91.8711, name: "Sylhet" },
  khulna: { lat: 22.8456, lng: 89.5403, name: "Khulna" },
  rangpur: { lat: 25.7439, lng: 89.2752, name: "Rangpur" },
  barisal: { lat: 22.7010, lng: 90.3535, name: "Barisal" },
  mymensingh: { lat: 24.7471, lng: 90.4203, name: "Mymensingh" },
  rajshahi: { lat: 24.3636, lng: 88.6261, name: "Rajshahi" }
}

let locationStatus = 'default' // default, searching, detected, approximate
let manualCitySelected = false

function log(level, msg, data) {
  const prefix = '[EMF-MapLibre]'
  if (data !== undefined) {
    if (level === 'error') console.error(prefix, msg, data)
    else if (level === 'warn') console.warn(prefix, msg, data)
    else console.log(prefix, msg, data)
  } else {
    if (level === 'error') console.error(prefix, msg)
    else if (level === 'warn') console.warn(prefix, msg)
    else console.log(prefix, msg)
  }
}

function buildAddress(item) {
  const parts = [item.house, item.road, item.upazila, item.zila, item.division].filter(Boolean)
  return parts.length > 0 ? parts.join(', ') : (item.address || '')
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function formatDistance(km) {
  if (km == null || isNaN(km)) return '--'
  if (km < 1) return `${Math.round(km * 1000)} m`
  return `${km.toFixed(1)} km`
}

function getSearchInput() {
  return document.getElementById('searchmedi') || document.getElementById('searchmedi-page')
}

// Initialize MapLibre map
function initMap() {
  log('info', 'Initializing MapLibre map with CartoDB Voyager tiles...')
  
  // Use CartoDB Voyager style - includes roads, buildings, labels
  const cartoVoyagerStyle = {
    version: 8,
    sources: {
      'carto-voyager': {
        type: 'raster',
        tiles: [
          'https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
          'https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
          'https://b.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png'
        ],
        tileSize: 256,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      }
    },
    layers: [{
      id: 'carto-voyager-layer',
      type: 'raster',
      source: 'carto-voyager',
      minzoom: 0,
      maxzoom: 19
    }]
  }
  
  map = new maplibregl.Map({
    container: 'shopmap',
    style: cartoVoyagerStyle,
    center: [90.4125, 23.8103],
    zoom: 12,
    attributionControl: true,
    maxZoom: 19,
    minZoom: 5,
  })

  // Add navigation controls
  map.addControl(new maplibregl.NavigationControl(), 'top-right')
  
  // Add scale control
  map.addControl(new maplibregl.ScaleControl({
    maxWidth: 100,
    unit: 'metric'
  }), 'bottom-left')

  // Add geolocate control
  const geolocate = new maplibregl.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true,
      timeout: 8000,
    },
    trackUserLocation: true,
    showUserHeading: true,
    showUserAccuracyCircle: true,
  })
  map.addControl(geolocate)

  // Map load event - add 3D buildings for major cities
  map.on('load', () => {
    log('info', 'MapLibre map loaded successfully with CartoDB Voyager tiles')
    
    // Add 3D buildings for major cities in Bangladesh
    // Note: Full 3D with height requires a vector tile source with building data
    // The CartoDB tiles include 2D building footprints
    
    // Add custom 3D building layer using MapLibre's built-in 3D capabilities
    // This creates a simple extrusion effect where OSM has building data
    
    // Initialize location controls (floating button, city selector)
    initLocationControls()
    
    // Request user location after map loads
    setTimeout(() => {
      if (navigator.geolocation) {
        geolocate.trigger()
      }
    }, 1000)
    
    // Add 3D terrain effect with exaggeration (subtle 3D look)
    log('info', 'Map ready - CartoDB Voyager provides roads, buildings, and labels')
  })

  // Listen for geolocate events
  geolocate.on('geolocate', (e) => {
    console.log('[EMF] Geolocate event fired!', e.coords)
    curentlat = e.coords.latitude
    curentlng = e.coords.longitude
    userLocationResolved = true
    manualCitySelected = false
    
    log('info', 'User location detected via GeolocateControl', { lat: curentlat, lng: curentlng })
    
    // Create user marker and update status
    addUserLocation(curentlat, curentlng)
    const cityName = getCityNameFromCoords(curentlat, curentlng)
    console.log('[EMF] Calling updateLocationStatus with detected, city:', cityName)
    updateLocationStatus('detected', cityName)
    
    // Recalculate if we have results
    if (demo.length > 0) {
      recalculateDistances()
    }
  })

  geolocate.on('error', (e) => {
    log('warn', 'Geolocate error, trying IP fallback', e.message)
    // Don't auto-fallback here, let user click the button
    updateLocationStatus('default')
  })

  // Handle map errors
  map.on('error', (e) => {
    log('error', 'Map error', e.error || e)
  })

  return map
}

// Initialize map when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('[EMF] DOM ready, initializing...')
  initMap()
  console.log('[EMF] Map initialized')
  
  // Setup search functionality - wait for DOM to be fully ready
  setTimeout(() => {
    attachSearchListeners()
    console.log('[EMF] Search functionality setup complete')
  }, 100)
  
  // Update location status after a delay (in case geolocate fired before elements ready)
  setTimeout(() => {
    if (userLocationResolved && curentlat && curentlng) {
      const cityName = getCityNameFromCoords(curentlat, curentlng)
      updateLocationStatus('detected', cityName)
    }
  }, 2000)
  
  // Auto-search from URL param (navbar search)
  const urlParams = new URLSearchParams(window.location.search)
  const mname = urlParams.get('mname')
  if (mname && mname.trim()) {
    const searchInput = getSearchInput()
    if (searchInput) {
      searchInput.value = mname.trim()
      performSearch(mname.trim())
    }
  }
})

// Add user location marker
function addUserLocation(lat, lng) {
  log('info', 'Adding user location marker', { lat, lng })
  
  // Remove existing user marker
  if (userMarker) { userMarker.remove(); userMarker = null }

  // Remove old pulse source/layer if exists
  if (map.getLayer('user-pulse-layer')) map.removeLayer('user-pulse-layer')
  if (map.getSource('user-pulse')) map.removeSource('user-pulse')

  // Create user marker element
  const userEl = document.createElement('div')
  userEl.className = 'marker-user'
  userEl.innerHTML = `
    <div class="user-marker-container">
      <div class="user-pulse"></div>
      <img src="/images/marker-user.svg" alt="Your Location">
    </div>
  `

  // Create accuracy circle using GeoJSON source and circle layer
  map.addSource('user-pulse', {
    type: 'geojson',
    data: {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [lng, lat]
      }
    }
  })

  map.addLayer({
    id: 'user-pulse-layer',
    type: 'circle',
    source: 'user-pulse',
    paint: {
      'circle-radius': 30,
      'circle-color': '#22c55e',
      'circle-opacity': 0.15,
      'circle-stroke-color': '#22c55e',
      'circle-stroke-width': 1,
      'circle-stroke-opacity': 0.5
    }
  })

  // Create marker
  userMarker = new maplibregl.Marker({ element: userEl })
    .setLngLat([lng, lat])
    .addTo(map)

  // Add popup
  const popup = new maplibregl.Popup({ offset: 25, closeButton: false })
    .setHTML(`
      <div style="font-family:'Figtree',sans-serif;text-align:center;padding:8px;">
        <div style="font-weight:700;color:#0369A1;font-size:0.95rem;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0369A1" stroke-width="2" style="display:inline;vertical-align:-2px;margin-right:4px;"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3" fill="#0369A1"/></svg>
          Your Location
        </div>
        <div style="font-size:0.8rem;color:#6b7280;margin-top:2px;">${lat.toFixed(4)}, ${lng.toFixed(4)}</div>
      </div>
    `)
  userMarker.setPopup(popup)
}

// ==================== ROUTING FUNCTIONS ====================

let currentRouteLayer = null
let routeInfo = null

// Get route from OSRM and draw on map
async function getRoute(startLng, startLat, endLng, endLat, pharmacyName) {
  log('info', 'Calculating route', { from: [startLng, startLat], to: [endLng, endLat] })
  
  // Remove existing route
  clearRoute()
  
  // Show loading state
  showRouteLoading(pharmacyName)
  
  try {
    // OSRM routing API - use public demo server
    const url = `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson&steps=true`
    
    log('info', 'Fetching route from OSRM...')
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error('Route API error: ' + response.status)
    }
    
    const data = await response.json()
    log('info', 'OSRM response:', data)
    
    if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
      log('warn', 'No route found from OSRM, trying alternative...')
      // Try alternative OSRM server
      try {
        const altUrl = `https://routing.openstreetmap.de/routed-car/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`
        const altResponse = await fetch(altUrl)
        const altData = await altResponse.json()
        
        if (altData.code === 'Ok' && altData.routes && altData.routes.length > 0) {
          const route = altData.routes[0]
          const geometry = route.geometry
          routeInfo = {
            distance: route.distance,
            duration: route.duration,
            geometry: geometry
          }
          
          currentRouteDestination = {
            name: pharmacyName,
            lat: endLat,
            lng: endLng,
            distance: route.distance,
            duration: route.duration
          }
          
          log('info', 'Route found from alternative OSRM')
          drawRoute(geometry, pharmacyName, endLat, endLng)
          return
        }
      } catch (altErr) {
        log('warn', 'Alternative route also failed', altErr.message)
      }
      
      openGoogleMapsDirections(endLat, endLng, pharmacyName)
      return
    }
    
    const route = data.routes[0]
    const geometry = route.geometry
    routeInfo = {
      distance: route.distance, // in meters
      duration: route.duration, // in seconds
      geometry: geometry
    }
    
    // Store route destination with coordinates for popup matching
    currentRouteDestination = {
      name: pharmacyName,
      lat: endLat,
      lng: endLng,
      distance: route.distance,
      duration: route.duration
    }
    
    log('info', 'Route found', { 
      distance: (route.distance / 1000).toFixed(1) + ' km',
      duration: formatDuration(route.duration)
    })
    
    // Draw route on map
    drawRoute(geometry, pharmacyName, endLat, endLng)
    
  } catch (err) {
    log('error', 'Route calculation failed', err.message)
    showNotification('Route unavailable. Opening Google Maps.', 'warning')
    // Fallback to Google Maps
    openGoogleMapsDirections(endLat, endLng, pharmacyName)
  }
}

// Clear existing route from map
function clearRoute() {
  if (currentRouteLayer) {
    if (map.getLayer('route-line')) {
      map.removeLayer('route-line')
    }
    if (map.getSource('route')) {
      map.removeSource('route')
    }
    currentRouteLayer = null
  }
  routeInfo = null
}

// Draw route polyline on map
function drawRoute(geometry, pharmacyName, endLat, endLng) {
  // Add route source
  map.addSource('route', {
    type: 'geojson',
    data: {
      type: 'Feature',
      properties: {},
      geometry: geometry
    }
  })
  
  // Add route line layer (outer glow)
  map.addLayer({
    id: 'route-line-glow',
    type: 'line',
    source: 'route',
    layout: {
      'line-join': 'round',
      'line-cap': 'round'
    },
    paint: {
      'line-color': '#0891B2',
      'line-width': 8,
      'line-opacity': 0.3,
      'line-blur': 3
    }
  })
  
  // Add main route line
  map.addLayer({
    id: 'route-line',
    type: 'line',
    source: 'route',
    layout: {
      'line-join': 'round',
      'line-cap': 'round'
    },
    paint: {
      'line-color': '#06b6d4',
      'line-width': 5,
      'line-opacity': 1
    }
  })
  
  currentRouteLayer = 'route-line'
  
  // Fit map to show entire route
  const coordinates = geometry.coordinates
  const bounds = new maplibregl.LngLatBounds()
  coordinates.forEach(coord => bounds.extend(coord))
  
  map.fitBounds(bounds, {
    padding: { top: 100, bottom: 100, left: 100, right: 100 },
    duration: 1000
  })
  
  // Update popup with route info
  updatePopupWithRoute(pharmacyName, endLat, endLng)
}

// Format distance in human readable form
function formatDistance(meters) {
  if (meters < 1000) {
    return Math.round(meters) + ' m'
  }
  return (meters / 1000).toFixed(1) + ' km'
}

// Format duration in human readable form
function formatDuration(seconds) {
  if (seconds < 60) {
    return Math.round(seconds) + ' sec'
  }
  if (seconds < 3600) {
    const mins = Math.round(seconds / 60)
    return mins + ' min'
  }
  const hours = Math.floor(seconds / 3600)
  const mins = Math.round((seconds % 3600) / 60)
  return hours + ' hr ' + mins + ' min'
}

// ==================== LOCATION FUNCTIONS ====================

// Update location status badge
function updateLocationStatus(status, cityName = '') {
  const statusEl = document.getElementById('location-status')
  const btnEl = document.getElementById('btn-my-location')
  const citySelector = document.getElementById('city-selector')
  
  console.log('[EMF] updateLocationStatus called:', status, cityName, 'statusEl:', !!statusEl)
  
  if (!statusEl) {
    console.warn('[EMF] Location status element not found, will retry...')
    setTimeout(() => updateLocationStatus(status, cityName), 500)
    return
  }
  
  statusEl.className = 'location-status status-' + status
  locationStatus = status
  
  const iconEl = statusEl.querySelector('.location-icon')
  const textEl = statusEl.querySelector('.location-text')
  
  if (!iconEl || !textEl) {
    console.warn('[EMF] Location status child elements not found')
    return
  }
  
  const iconMap = {
    'default': '⚠️',
    'searching': '⏳',
    'detected': '✅',
    'approximate': '📡'
  }
  
  const textMap = {
    'default': 'Location not detected',
    'searching': 'Getting location...',
    'detected': 'Location: ' + cityName,
    'approximate': 'Location: ' + cityName + ' (Approx)'
  }
  
  iconEl.textContent = iconMap[status] || '⚠️'
  textEl.textContent = textMap[status] || 'Unknown'
  
  // Hide city selector when location is detected (GPS or IP)
  if (citySelector) {
    if (status === 'detected' || status === 'approximate') {
      citySelector.style.display = 'none'
    } else {
      citySelector.style.display = 'block'
    }
  }
  
  // Update button state
  if (btnEl) {
    if (status === 'searching') {
      btnEl.classList.add('searching')
    } else {
      btnEl.classList.remove('searching')
    }
    if (status === 'detected' || status === 'approximate') {
      btnEl.classList.add('success')
    } else {
      btnEl.classList.remove('success')
    }
  }
  
  log('info', 'Location status updated:', { status, cityName })
}

// Request user location via browser GPS
function requestUserLocation() {
  const btnEl = document.getElementById('btn-my-location')
  updateLocationStatus('searching')
  
  if (btnEl) btnEl.classList.add('searching')
  
  if (!navigator.geolocation) {
    log('warn', 'Geolocation not supported, trying IP fallback')
    getIPLocation()
    return
  }
  
  navigator.geolocation.getCurrentPosition(
    (position) => {
      // Success - got GPS location
      curentlat = position.coords.latitude
      curentlng = position.coords.longitude
      userLocationResolved = true
      manualCitySelected = false
      
      log('info', 'User location detected via GPS', { lat: curentlat, lng: curentlng })
      
      // Create user marker at this location
      addUserLocation(curentlat, curentlng)
      
      // Update status
      const cityName = getCityNameFromCoords(curentlat, curentlng)
      updateLocationStatus('detected', cityName)
      
      // Recalculate distances if we have results
      if (demo.length > 0) {
        recalculateDistances()
      }
      
      showNotification('Location detected! Using GPS coordinates.', 'success')
    },
    (error) => {
      // Failed - try IP fallback
      log('warn', 'Geolocation failed:', error.message)
      getIPLocation()
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }
  )
}

// Get location via IP (fallback)
async function getIPLocation() {
  try {
    log('info', 'Trying IP-based location detection...')
    const response = await fetch('http://ip-api.com/json/')
    
    if (!response.ok) throw new Error('IP API failed')
    
    const data = await response.json()
    
    if (data.status === 'success' && data.lat && data.lon) {
      // Check if location is in Bangladesh
      if (data.countryCode === 'BD') {
        curentlat = data.lat
        curentlng = data.lon
        userLocationResolved = true
        manualCitySelected = false
        
        log('info', 'Location detected via IP', { lat: curentlat, lng: curentlng, city: data.city })
        
        // Create user marker
        addUserLocation(curentlat, curentlng)
        
        // Update status
        updateLocationStatus('approximate', data.city || 'Bangladesh')
        
        // Recalculate distances
        if (demo.length > 0) {
          recalculateDistances()
        }
        
        showNotification('Location detected (IP-based). Approximate accuracy.', 'info')
      } else {
        throw new Error('Not in Bangladesh')
      }
    } else {
      throw new Error('IP API returned no data')
    }
  } catch (err) {
    log('error', 'IP location failed:', err.message)
    updateLocationStatus('default')
    showNotification('Could not detect location. Please select city manually.', 'warning')
  }
}

// Get city name from coordinates (simple approximation)
function getCityNameFromCoords(lat, lng) {
  // Find closest city from coordinates
  let closestCity = 'Dhaka'
  let minDistance = Infinity
  
  for (const [key, city] of Object.entries(cityCoords)) {
    const distance = calculateDistance(lat, lng, city.lat, city.lng)
    if (distance < minDistance) {
      minDistance = distance
      closestCity = city.name
    }
  }
  
  return closestCity
}

// Set location from city dropdown
function setCityLocation(cityKey) {
  const city = cityCoords[cityKey]
  if (!city) {
    log('warn', 'Invalid city key:', cityKey)
    return
  }
  
  curentlat = city.lat
  curentlng = city.lng
  userLocationResolved = true
  manualCitySelected = true
  
  log('info', 'Manual city selected:', { city: city.name, lat: curentlat, lng: curentlng })
  
  // Create user marker
  addUserLocation(curentlat, curentlng)
  
  // Update status
  updateLocationStatus('detected', city.name)
  
  // Update dropdown
  const selector = document.getElementById('city-selector')
  if (selector) selector.value = cityKey
  
  // Recalculate distances
  if (demo.length > 0) {
    recalculateDistances()
  }
  
  showNotification('Location set to ' + city.name, 'success')
}

// Recalculate distances with new location
function recalculateDistances() {
  if (!demo || demo.length === 0) return
  
  log('info', 'Recalculating distances from new location', { lat: curentlat, lng: curentlng })
  
  // Recalculate distances
  demo.forEach(item => {
    if (item.lat && item.lng) {
      item.distance = calculateDistance(curentlat, curentlng, parseFloat(item.lat), parseFloat(item.lng))
    }
  })
  
  // Sort by distance
  demo.sort((a, b) => a.distance - b.distance)
  
  // Update UI
  updateResultsUI(demo)
  
  // Re-place markers
  placeMarkers(demo)
  
  log('info', 'Distances recalculated, nearest:', demo[0]?.shopname)
}

// Initialize location controls
function initLocationControls() {
  const btnEl = document.getElementById('btn-my-location')
  const selector = document.getElementById('city-selector')
  
  if (btnEl) {
    btnEl.addEventListener('click', requestUserLocation)
  }
  
  if (selector) {
    selector.addEventListener('change', (e) => {
      if (e.target.value) {
        setCityLocation(e.target.value)
      }
    })
  }
  
  log('info', 'Location controls initialized')
}

// Show route loading state
function showRouteLoading(pharmacyName) {
  log('info', 'Calculating route to ' + pharmacyName + '...')
  // Could add a toast/notification here
}

// Current route destination for updating popups
let currentRouteDestination = null

// Update popup with route info
function updatePopupWithRoute(pharmacyName, lat, lng) {
  if (!routeInfo) return
  
  const distance = formatDistance(routeInfo.distance)
  const duration = formatDuration(routeInfo.duration)
  
  // Store current route info for popup updates (with coordinates for matching)
  currentRouteDestination = {
    name: pharmacyName,
    lat: lat,
    lng: lng,
    distance: routeInfo.distance,
    duration: routeInfo.duration
  }
  
  log('info', `Route: ${distance}, ${duration} to ${pharmacyName}`)
  
  // Show route info in a toast notification
  showNotification(`Route to ${pharmacyName}: ${distance} (${duration})`, 'success')
}

// Open Google Maps directions (fallback)
function openGoogleMapsDirections(lat, lng, name) {
  const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${encodeURIComponent(name)}`
  window.open(url, '_blank')
}

// Show notification toast
function showNotification(message, type = 'info') {
  // Check if notification container exists
  let container = document.getElementById('notification-container')
  if (!container) {
    container = document.createElement('div')
    container.id = 'notification-container'
    container.style.cssText = 'position:fixed;top:20px;right:20px;z-index:10000;max-width:350px;'
    document.body.appendChild(container)
  }
  
  const colors = {
    info: { bg: '#0891B2', text: '#fff' },
    success: { bg: '#15803D', text: '#fff' },
    warning: { bg: '#D97706', text: '#fff' },
    error: { bg: '#DC2626', text: '#fff' }
  }
  
  const color = colors[type] || colors.info
  
  const toast = document.createElement('div')
  toast.style.cssText = `
    background:${color.bg};
    color:${color.text};
    padding:12px 20px;
    border-radius:8px;
    margin-bottom:10px;
    box-shadow:0 4px 12px rgba(0,0,0,0.15);
    font-family:'Figtree',sans-serif;
    font-size:0.9rem;
    display:flex;
    align-items:center;
    gap:8px;
    animation:slideIn 0.3s ease;
  `
  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      ${type === 'success' ? '<path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>' : 
        type === 'warning' ? '<path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>' :
        '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>'}
    </svg>
    ${message}
  `
  
  container.appendChild(toast)
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease'
    setTimeout(() => toast.remove(), 300)
  }, 5000)
}

// Add CSS animations for notifications
const style = document.createElement('style')
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
`
document.head.appendChild(style)

// Route button click handler - called from popup
function showRouteToPharmacy(lat, lng, name, address) {
  log('info', 'showRouteToPharmacy called', { lat, lng, name, curentlat, curentlng })
  
  if (!curentlat || !curentlng || curentlat === 23.8103) {
    log('warn', 'User location not available, requesting...')
    showNotification('Getting your location...', 'info')
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          curentlat = position.coords.latitude
          curentlng = position.coords.longitude
          log('info', 'Got user location for route', { lat: curentlat, lng: curentlng })
          getRoute(curentlng, curentlat, lng, lat, name || address)
        },
        (error) => {
          log('error', 'Geolocation error', error.message)
          showNotification('Location unavailable. Opening Google Maps.', 'warning')
          openGoogleMapsDirections(lat, lng, name || address)
        }
      )
    } else {
      showNotification('Geolocation not supported. Opening Google Maps.', 'warning')
      openGoogleMapsDirections(lat, lng, name || address)
    }
    return
  }
  
  // Show loading
  showNotification(`Calculating route to ${name || 'pharmacy'}...`, 'info')
  
  // Get and display route
  getRoute(curentlng, curentlat, lng, lat, name || address)
}

// Clear route button
function clearRouteOnMap() {
  clearRoute()
  stopLiveTracking()
  log('info', 'Route cleared')
}

// ==================== LIVE TRACKING ====================

let liveTrackingInterval = null
let watchPositionId = null
let liveTrackingDestination = null
let liveTrackingStartTime = null
let liveTrackingDestMarker = null

// Start live tracking to a pharmacy
function startLiveTracking(lat, lng, pharmacyName, pharmacyAddress) {
  // Stop any existing tracking
  stopLiveTracking()
  
  if (!navigator.geolocation) {
    showNotification('Geolocation not supported', 'error')
    return
  }
  
  // Check if user location is actually detected (not default Dhaka)
  if (!userLocationResolved || !curentlat || !curentlng) {
    showNotification('Please use "Use My Location" button first to enable live tracking.', 'warning')
    return
  }
  
  // Warn if using approximate (IP-based) location
  if (manualCitySelected) {
    showNotification('Using manual city location. For accurate tracking, use GPS location.', 'info')
  }
  
  // Store destination
  liveTrackingDestination = {
    lat: lat,
    lng: lng,
    name: pharmacyName,
    address: pharmacyAddress
  }
  liveTrackingStartTime = Date.now()
  
  log('info', 'Starting live tracking to ' + pharmacyName)
  
  // Create live tracking UI
  createLiveTrackingUI(pharmacyName, pharmacyAddress)
  
  // Add destination marker on map
  if (map) {
    // Remove existing destination marker if any
    if (liveTrackingDestMarker) {
      liveTrackingDestMarker.remove()
    }
    
    // Create destination marker element
    const destEl = document.createElement('div')
    destEl.className = 'marker-destination'
    destEl.innerHTML = '<img src="/images/marker-pharmacy.svg" alt="Destination">'
    destEl.style.cssText = 'width:36px;height:36px;filter:drop-shadow(0 2px 4px rgba(139,92,246,0.5));'
    
    // Add destination marker
    liveTrackingDestMarker = new maplibregl.Marker({ element: destEl })
      .setLngLat([lng, lat])
      .addTo(map)
    
    // Add pulse effect
    const destPulse = document.createElement('div')
    destPulse.className = 'destination-pulse'
    destPulse.style.cssText = `
      position: absolute;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: rgba(139, 92, 246, 0.3);
      animation: destPulse 2s infinite;
      transform: translate(-7px, -7px);
    `
    destEl.appendChild(destPulse)
    
    // Add destination popup
    const destPopup = new maplibregl.Popup({ offset: 25, closeButton: false })
      .setHTML(`<div style="padding:8px;font-family:'Figtree',sans-serif;">
        <strong style="color:#7C3AED;">📍 Destination</strong><br>
        <span style="color:#64748B;font-size:0.85rem;">${pharmacyName}</span>
      </div>`)
    liveTrackingDestMarker.setPopup(destPopup)
    liveTrackingDestMarker.togglePopup()
  }
  
  // Start watching position
  watchPositionId = navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude, speed, accuracy } = position.coords
      
      // Update current position
      curentlat = latitude
      curentlng = longitude
      
      // Update user marker on map
      updateUserMarkerPosition(latitude, longitude)
      
      // Calculate distance to destination
      const distance = calculateDistance(latitude, longitude, lat, lng)
      
      // Calculate estimated time (assuming average walking speed 5 km/h or driving 30 km/h)
      const avgSpeedKmH = speed > 0 ? speed * 3.6 : 5 // Convert m/s to km/h, default to walking
      const etaSeconds = distance > 0 ? (distance / avgSpeedKmH) * 3600 : 0
      
      // Update the live tracking UI
      updateLiveTrackingUI(distance, etaSeconds, accuracy)
      
      // Check if arrived (within 30 meters)
      if (distance < 0.03) {
        showArrivedNotification(pharmacyName)
        stopLiveTracking()
      }
      
      log('info', 'Live tracking: ' + formatDistance(distance) + ' remaining')
    },
    (error) => {
      log('warn', 'Live tracking error', error.message)
      showNotification('Location error: ' + error.message, 'warning')
    },
    {
      enableHighAccuracy: true,
      maximumAge: 5000,
      timeout: 10000
    }
  )
  
  // Update every 5 seconds as backup
  liveTrackingInterval = setInterval(() => {
    if (liveTrackingDestination && curentlat && curentlng) {
      const distance = calculateDistance(curentlat, curentlng, liveTrackingDestination.lat, liveTrackingDestination.lng)
      updateLiveTrackingUI(distance, null, null)
    }
  }, 5000)
  
  showNotification('Live tracking started to ' + pharmacyName, 'success')
}

// Stop live tracking
function stopLiveTracking() {
  if (watchPositionId !== null) {
    navigator.geolocation.clearWatch(watchPositionId)
    watchPositionId = null
    log('info', 'Position watch stopped')
  }
  
  if (liveTrackingInterval) {
    clearInterval(liveTrackingInterval)
    liveTrackingInterval = null
  }
  
  // Remove destination marker
  if (liveTrackingDestMarker) {
    liveTrackingDestMarker.remove()
    liveTrackingDestMarker = null
  }
  
  liveTrackingDestination = null
  liveTrackingStartTime = null
  
  // Remove live tracking UI
  const trackingUI = document.getElementById('live-tracking-panel')
  if (trackingUI) {
    trackingUI.remove()
  }
}

// Update user marker position during live tracking
function updateUserMarkerPosition(lat, lng) {
  if (userMarker) {
    userMarker.setLngLat([lng, lat])
  }
  
  // Update the GeoJSON source for the pulse circle
  const source = map.getSource('user-pulse')
  if (source) {
    source.setData({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [lng, lat]
      }
    })
  }
}

// Create live tracking UI panel
function createLiveTrackingUI(pharmacyName, pharmacyAddress) {
  // Remove existing if any
  const existing = document.getElementById('live-tracking-panel')
  if (existing) existing.remove()
  
  const panel = document.createElement('div')
  panel.id = 'live-tracking-panel'
  panel.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: white;
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.15);
    padding: 16px 24px;
    z-index: 9999;
    min-width: 300px;
    font-family: 'Figtree', sans-serif;
  `
  
  panel.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
      <div>
        <div style="font-weight:700;font-size:1.1rem;color:#14532D;">${pharmacyName}</div>
        <div style="font-size:0.8rem;color:#6b7280;">${pharmacyAddress || 'Pharmacy'}</div>
      </div>
      <button onclick="stopLiveTracking()" style="background:#fee2e2;color:#dc2626;border:none;padding:8px 12px;border-radius:8px;font-weight:600;cursor:pointer;font-size:0.8rem;">
        Stop
      </button>
    </div>
    <div style="display:flex;align-items:center;gap:20px;">
      <div style="text-align:center;">
        <div id="tracking-distance" style="font-size:1.5rem;font-weight:700;color:#0891B2;">--</div>
        <div style="font-size:0.75rem;color:#6b7280;">Distance</div>
      </div>
      <div style="text-align:center;">
        <div id="tracking-eta" style="font-size:1.5rem;font-weight:700;color:#15803D;">--</div>
        <div style="font-size:0.75rem;color:#6b7280;">ETA</div>
      </div>
      <div style="text-align:center;">
        <div id="tracking-time" style="font-size:1.5rem;font-weight:700;color:#D97706;">--</div>
        <div style="font-size:0.75rem;color:#6b7280;">Elapsed</div>
      </div>
    </div>
    <div style="margin-top:12px;display:flex;align-items:center;gap:8px;">
      <div style="width:12px;height:12px;background:#22c55e;border-radius:50%;animation:pulse 1.5s infinite;"></div>
      <span style="font-size:0.8rem;color:#6b7280;">Live tracking active</span>
    </div>
  `
  
  document.body.appendChild(panel)
}

// Update live tracking UI with new distance/ETA
function updateLiveTrackingUI(distance, eta, accuracy) {
  const distanceEl = document.getElementById('tracking-distance')
  const etaEl = document.getElementById('tracking-eta')
  const timeEl = document.getElementById('tracking-time')
  
  if (distanceEl) {
    distanceEl.textContent = formatDistance(distance)
  }
  
  if (etaEl && eta !== null) {
    etaEl.textContent = formatDuration(eta)
  }
  
  if (timeEl && liveTrackingStartTime) {
    const elapsed = Math.floor((Date.now() - liveTrackingStartTime) / 1000)
    timeEl.textContent = formatDuration(elapsed)
  }
}

// Show arrived notification
function showArrivedNotification(pharmacyName) {
  showNotification(`You have arrived at ${pharmacyName}!`, 'success')
}

// Legacy locateUser function for compatibility
function locateUser() {
  const geolocate = document.querySelector('.maplibregl-ctrl-geolocate')
  if (geolocate) {
    geolocate.click()
  }
}

// Fallback geolocation if GeolocateControl doesn't work
function fallbackLocateUser() {
  if (!navigator.geolocation) {
    log('warn', 'Geolocation not supported, using default center')
    return
  }
  
  navigator.geolocation.getCurrentPosition(
    position => {
      const { latitude, longitude } = position.coords
      curentlat = latitude
      curentlng = longitude
      userLocationResolved = true
      log('info', 'User location resolved via fallback', { lat: latitude, lng: longitude })
      
      // Add marker to map
      if (map) {
        map.flyTo({
          center: [longitude, latitude],
          zoom: 13,
          duration: 1000,
        })
        addUserLocation(latitude, longitude)
      }
    },
    err => {
      log('warn', 'Geolocation denied/error, using default', err.message || err)
    },
    { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
  )
}

// Clear all markers
function clearMarkers() {
  log('info', 'Clearing markers')
  pharmacyMarkers.forEach(m => m.remove())
  pharmacyMarkers.clear()
}

// Generate popup HTML
function generatePopupHTML(item, isNearest) {
  // Check if there's a route to this pharmacy - use route distance if available
  let displayDistance = '--'
  let distanceLabel = ''
  let isRouteDistance = false
  
  if (currentRouteDestination && item.lat && item.lng) {
    // Compare coordinates to check if this is the destination
    const routeLat = parseFloat(item.lat)
    const routeLng = parseFloat(item.lng)
    // We need the original route coordinates - check by name match
    if (currentRouteDestination.name === item.shopname || 
        Math.abs(routeLat - currentRouteDestination.lat) < 0.001 && 
        Math.abs(routeLng - currentRouteDestination.lng) < 0.001) {
      displayDistance = formatDistance(currentRouteDestination.distance)
      const duration = formatDuration(currentRouteDestination.duration)
      distanceLabel = ` (${duration} via road)`
      isRouteDistance = true
    }
  }
  
  // Fall back to straight-line distance if no route
  if (displayDistance === '--') {
    displayDistance = item.distance ? formatDistance(item.distance) : '--'
    if (item.distance && item.distance > 0) {
      distanceLabel = ' (straight line)'
    }
  }
  
  const distRaw = item.distance || 0
  const qty = item.stock != null ? parseInt(item.stock) : 0
  const stockLabel = qty > 10 ? 'In Stock' : qty > 0 ? 'Low Stock' : 'Out of Stock'
  const stockColor = qty > 10 ? '#059669' : qty > 0 ? '#D97706' : '#DC2626'
  const addr = buildAddress(item)

return `
     <div style="font-family:'Figtree',sans-serif;min-width:220px;max-width:280px;padding:10px;border-radius:12px;background:white;box-shadow:0 8px 24px rgba(0,0,0,0.15);">
       ${isNearest ? '<div style="background:linear-gradient(135deg,#0284C7,#0369A1);color:white;font-size:0.6rem;font-weight:700;padding:2px 8px;border-radius:12px;display:inline-block;margin-bottom:6px;">★ Nearest</div>' : ''}
       <div style="font-weight:700;color:#0F172A;font-size:0.9rem;margin-bottom:4px;">${item.shopname}</div>
       <div style="font-size:0.7rem;color:#64748B;margin-bottom:6px;">${item.phone || '--'}</div>
       
       <div style="border-top:1px solid #E2E8F0;margin:6px 0;padding-top:6px;">
         <div style="color:#0284C7;font-weight:600;font-size:0.8rem;margin-bottom:4px;">${item.mediname} ${item.medistrength ? '(' + item.medistrength + ')' : ''}</div>
         <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
           <span style="font-size:1rem;font-weight:700;color:#0284C7;">BDT ${item.price}</span>
           <span style="font-size:0.65rem;padding:2px 6px;border-radius:10px;background:${stockColor}15;color:${stockColor};font-weight:600;">${stockLabel}</span>
         </div>
         <div style="font-size:0.7rem;color:#64748B;margin-bottom:4px;">
           <svg width="10" height="10" viewBox="0 0 24 24" fill="${isRouteDistance ? '#0284C7' : '#64748B'}" style="display:inline;vertical-align:-2px;margin-right:2px;"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg>
           ${displayDistance}${distanceLabel}
         </div>
         ${addr ? '<div style="font-size:0.65rem;color:#64748B;word-break:break-word;">' + addr + '</div>' : ''}
       </div>
       
       <div style="display:flex;gap:4px;margin-top:6px;">
         <button onclick="handleRequestFromPopup('${item.id}','${item.email}')"
           style="flex:1;padding:6px;background:linear-gradient(135deg,#0284C7,#0369A1);color:white;border:none;border-radius:5px;font-weight:600;cursor:pointer;font-size:0.7rem;display:flex;align-items:center;justify-content:center;gap:3px;">
           <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>
           Request
         </button>
         <button onclick="showRouteToPharmacy(${item.lat}, ${item.lng}, '${item.shopname.replace(/'/g, "\\'")}', '${(addr || '').replace(/'/g, "\\'")}')"
           style="flex:1;padding:6px;background:linear-gradient(135deg,#0EA5E9,#0284C7);color:white;border:none;border-radius:5px;font-weight:600;cursor:pointer;font-size:0.7rem;display:flex;align-items:center;justify-content:center;gap:3px;">
           <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z"/><path d="M8 2v16"/><path d="M16 6v16"/></svg>
           Route
         </button>
       </div>
       <div style="display:flex;gap:4px;margin-top:4px;">
         <button onclick="startLiveTracking(${item.lat}, ${item.lng}, '${item.shopname.replace(/'/g, "\\'")}', '${(addr || '').replace(/'/g, "\\'")}')"
           style="flex:1;padding:6px;background:linear-gradient(135deg,#7C3AED,#6D28D9);color:white;border:none;border-radius:5px;font-weight:600;cursor:pointer;font-size:0.7rem;display:flex;align-items:center;justify-content:center;gap:3px;">
           <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><circle cx="12" cy="12" r="3"/></svg>
           Live
         </button>
         <button onclick="openGoogleMapsDirections(${item.lat}, ${item.lng}, '${item.shopname.replace(/'/g, "\\'")}')"
           style="flex:1;padding:6px;background:#64748B;color:white;border:none;border-radius:5px;font-weight:600;cursor:pointer;font-size:0.7rem;display:flex;align-items:center;justify-content:center;gap:3px;">
           <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M3 11l19-9-9 19-2-8-8-2z"/></svg>
           Maps
         </button>
       </div>
     </div>
   `
}

// Create pharmacy marker
function createPharmacyMarker(item, index, isSelected) {
  const el = document.createElement('div')
  el.className = 'marker-pharmacy'
  
  // Add stock class
  const qty = item.stock != null ? parseInt(item.stock) : 0
  if (qty > 10) el.classList.add('marker-stock-high')
  else if (qty > 0) el.classList.add('marker-stock-low')
  else el.classList.add('marker-stock-out')
  
  if (isSelected) el.classList.add('marker-selected')
  
  const iconUrl = isSelected ? '/images/marker-selected.svg' : '/images/marker-pharmacy.svg'
  el.innerHTML = `<img src="${iconUrl}" alt="Pharmacy">`
  
  // Create popup
  const popup = new maplibregl.Popup({
    offset: [0, -40],
    maxWidth: 320,
    closeButton: true,
    className: 'pharmacy-popup',
  }).setHTML(generatePopupHTML(item, index === 0))
  
  // Create marker
  const marker = new maplibregl.Marker({ element: el })
    .setLngLat([parseFloat(item.lng), parseFloat(item.lat)])
    .setPopup(popup)
    .addTo(map)
  
  // Add click listener
  el.addEventListener('click', () => {
    highlightSidebarCard(index)
    // Update all markers to unselected
    pharmacyMarkers.forEach((m, i) => {
      if (i !== index) {
        const el = m.getElement()
        if (el) el.querySelector('img').src = '/images/marker-pharmacy.svg'
      }
    })
    // Set selected icon
    el.querySelector('img').src = '/images/marker-selected.svg'
  })
  
  // Add hover effects
  el.addEventListener('mouseenter', () => {
    highlightSidebarCard(index)
  })
  
  pharmacyMarkers.set(index, marker)
  return marker
}

// Highlight sidebar card
function highlightSidebarCard(index) {
  const isDark = document.documentElement.classList.contains('dark')
  
  document.querySelectorAll('.result-card').forEach(c => {
    if (isDark) {
      c.style.borderColor = 'rgba(56, 189, 248, 0.1)'
      c.style.boxShadow = 'none'
      c.style.background = ''
    } else {
      c.style.borderColor = '#e5e7eb'
      c.style.boxShadow = 'none'
      c.style.background = 'white'
    }
  })
  
  const card = document.querySelector(`.result-card[data-index="${index}"]`)
  if (card) {
    if (isDark) {
      card.style.borderColor = 'rgba(34, 197, 94, 0.4)'
      card.style.boxShadow = '0 0 20px rgba(34, 197, 94, 0.2)'
      card.style.background = ''
    } else {
      card.style.borderColor = '#15803D'
      card.style.boxShadow = '0 2px 12px rgba(21,128,61,0.15)'
      card.style.background = '#F0FDF4'
    }
    card.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }
}

// Show search feedback (success/error/loading)
function showSearchFeedback(type, message) {
  const feedback = document.getElementById('search-feedback')
  if (!feedback) return
  
  feedback.className = 'search-feedback'
  feedback.innerHTML = ''
  
  if (type === 'loading') {
    feedback.innerHTML = '<span class="spinner" style="width:14px;height:14px;"></span>' + message
    feedback.classList.add('show', 'loading')
    return
  }
  
  if (type === 'success') {
    feedback.innerHTML = '<i class="ri-check-circle-line"></i>' + message
    feedback.classList.add('show', 'success')
    setTimeout(() => feedback.classList.remove('show'), 4000)
  } else if (type === 'error') {
    feedback.innerHTML = '<i class="ri-error-warning-line"></i>' + message
    feedback.classList.add('show', 'error')
    setTimeout(() => feedback.classList.remove('show'), 5000)
  }
}

// Update results UI
function updateResultsUI(data) {
  const list = document.getElementById('results-list')
  const emptyState = document.getElementById('empty-state')
  const noResults = document.getElementById('no-results-state')
  const countEl = document.getElementById('result-count')
  const mainSearchBtn = document.getElementById('search-btn')
  const navSearchBtn = document.getElementById('searchmedi-btn')
  
  // Reset button state
  if (mainSearchBtn) {
    mainSearchBtn.disabled = false
    mainSearchBtn.classList.remove('loading')
  }
  if (navSearchBtn) {
    navSearchBtn.disabled = false
    navSearchBtn.classList.remove('loading')
  }

  if (!list) return

  if (!data || data.length === 0) {
    // Show error feedback
    showSearchFeedback('error', 'No nearby pharmacies currently stock this medicine')
    
    if (emptyState) emptyState.style.display = 'none'
    if (noResults) {
      noResults.style.display = 'block'
      const title = noResults.querySelector('.fw-bold')
      if (title) title.textContent = 'No nearby pharmacy currently has this medicine'
    }
    list.innerHTML = ''
    if (countEl) countEl.textContent = '0'
    log('info', 'No results to display')
    return
  }

  if (emptyState) emptyState.style.display = 'none'
  if (noResults) noResults.style.display = 'none'
  if (countEl) countEl.textContent = data.length
  
  // Show success feedback
  showSearchFeedback('success', data.length + ' nearby pharmacies found')

  log('info', 'Rendering ' + data.length + ' results in sidebar')

  let html = ''
  data.forEach((item, index) => {
    const dist = item.distance ? formatDistance(item.distance) : '--'
    const qty = item.stock != null ? parseInt(item.stock) : 0
    const stockClass = qty > 10 ? 'available' : qty > 0 ? 'low' : 'out'
    const stockLabel = qty > 10 ? 'In Stock' : qty > 0 ? 'Low Stock' : 'Out of Stock'
    const stockIcon = stockClass === 'available' ? 'check-circle' : stockClass === 'low' ? 'alert-line' : 'close-line'
    const addr = buildAddress(item)
    const isNearest = index === 0
    html += `
      <div class="result-card" data-index="${index}" ${isNearest ? 'active' : ''}
        onmouseover="highlightMarker(${index})"
        onmouseout="unhighlightMarker(${index})"
        onclick="focusMarker(${index})">
        <div class="result-card-header">
          <h6 class="pharmacy-name">
            ${isNearest ? '<span class="nearest-badge"><i class="ri-star-fill"></i> Nearest</span>' : ''}
            ${item.shopname}
          </h6>
          <span class="result-distance">
            <i class="ri-map-pin-distance"></i>
            ${dist}
          </span>
        </div>
        <div class="medicine-info">
          <div class="medicine-name-result">
            <i class="ri-medicine-bottle-line"></i>
            ${item.mediname}${item.medistrength ? ' (' + item.medistrength + ')' : ''}
          </div>
          <div class="medicine-price">
            <span class="price-value">BDT ${item.price}</span>
            <small>/ pcs</small>
          </div>
        </div>
        <div class="result-info-row">
          <span class="stock-badge ${stockClass}">
            <i class="ri-${stockIcon}"></i>
            ${stockLabel}
          </span>
          <span class="result-phone">
            <i class="ri-phone-line"></i> ${item.phone || '--'}
          </span>
        </div>
        <div class="result-actions">
          <button class="btn btn-route" onclick="event.stopPropagation();showRouteToPharmacy(${item.lat}, ${item.lng}, '${item.shopname.replace(/'/g, "\\'")}', '${(addr || '').replace(/'/g, "\\'")}')">
            <i class="ri-navigation-line"></i> Route
          </button>
          <button class="btn btn-view-map" onclick="event.stopPropagation();focusMarker(${index})">
            <i class="ri-map-fill"></i> View
          </button>
          <button class="btn btn-call" onclick="event.stopPropagation();window.open('tel:${item.phone}')">
            <i class="ri-phone-fill"></i> Call
          </button>
        </div>
      </div>`
  })
  list.innerHTML = html
  
  // Scroll to results section
  const searchSection = document.querySelector('.search-section')
  if (searchSection) {
    searchSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

// Generate skeleton loading cards
function generateSkeletons(count) {
  let html = ''
  for (let i = 0; i < count; i++) {
    html += `
      <div class="skeleton-card">
        <div class="skeleton skeleton-line short"></div>
        <div class="skeleton skeleton-line medium"></div>
        <div class="skeleton skeleton-line"></div>
        <div class="skeleton skeleton-line short" style="margin-top:0.5rem"></div>
      </div>`
  }
  return html
}

// Focus marker
function focusMarker(index) {
  if (!demo[index]) return
  log('info', 'Focusing marker index', index)
  const item = demo[index]
  
  // Use MapLibre flyTo (easeTo)
  map.flyTo({
    center: [parseFloat(item.lng), parseFloat(item.lat)],
    zoom: 15,
    duration: 500,
    essential: true,
  })
  
  highlightSidebarCard(index)
  
  // Show popup for this marker
  const marker = pharmacyMarkers.get(index)
  if (marker) {
    const popup = marker.getPopup()
    if (popup && !popup.isOpen()) {
      popup.addTo(map)
    }
  }
}

// Highlight marker on hover
function highlightMarker(index) {
  if (!demo[index] || !pharmacyMarkers.get(index)) return
  log('info', 'Hover on card ' + index + ' - highlighting marker')
  highlightSidebarCard(index)
  const marker = pharmacyMarkers.get(index)
  if (marker) {
    marker.getElement().querySelector('img').src = '/images/marker-selected.svg'
    // Don't auto-open popup on hover to prevent conflicts
  }
}

// Unhighlight marker
function unhighlightMarker(index) {
  if (!demo[index] || !pharmacyMarkers.get(index)) return
  const marker = pharmacyMarkers.get(index)
  if (marker) {
    const el = marker.getElement()
    if (el && !el.classList.contains('marker-selected')) {
      marker.getElement().querySelector('img').src = '/images/marker-pharmacy.svg'
    }
  }
  
  // Reset to nearest card highlight
  const isDark = document.documentElement.classList.contains('dark')
  const nearest = document.querySelector('.result-card[data-index="0"]')
  if (nearest) {
    if (isDark) {
      nearest.style.borderColor = 'rgba(34, 197, 94, 0.4)'
      nearest.style.boxShadow = '0 0 20px rgba(34, 197, 94, 0.2)'
      nearest.style.background = ''
    } else {
      nearest.style.borderColor = '#15803D'
      nearest.style.boxShadow = '0 2px 12px rgba(21,128,61,0.15)'
      nearest.style.background = '#F0FDF4'
    }
  }
}

// Place markers on map
function placeMarkers(data, focusIndex) {
  clearMarkers()
  log('info', 'Placing ' + data.length + ' markers on map')

  data.forEach((item, i) => {
    if (item.lat == null || item.lng == null) {
      log('warn', 'Skipping item without coordinates', item.shopname)
      return
    }
    const isSelected = i === focusIndex || i === 0
    createPharmacyMarker(item, i, isSelected)
  })

  // Fit bounds to show all markers
  if (data.length > 0) {
    const bounds = new maplibregl.LngLatBounds()
    data.forEach(item => bounds.extend([parseFloat(item.lng), parseFloat(item.lat)]))
    map.fitBounds(bounds, { padding: 50, maxZoom: 15, duration: 500 })
    
    // Show popup for nearest pharmacy only on fresh search
    if (isNewSearch && data.length > 0) {
      setTimeout(() => {
        try {
          const nearestMarker = pharmacyMarkers.get(0)
          if (nearestMarker) {
            const popup = nearestMarker.getPopup()
            if (popup && !popup.isOpen()) {
              popup.addTo(map)
              highlightSidebarCard(0)
              log('info', 'Popup opened for nearest pharmacy on new search')
            }
          }
        } catch (e) {
          log('error', 'Error opening popup:', e.message)
        }
      }, 1000)
    }
  }

  log('info', pharmacyMarkers.size + ' markers rendered on map')
}

// Perform search
function performSearch(query) {
  const emptyState = document.getElementById('empty-state')
  const noResults = document.getElementById('no-results-state')
  const resultsList = document.getElementById('results-list')
  const countEl = document.getElementById('result-count')
  const mainSearchBtn = document.getElementById('search-btn')
  const mainSearchBtnText = document.getElementById('search-btn-text')
  const navSearchBtn = document.getElementById('searchmedi-btn')

  log('info', 'Search triggered:', query)

  if (!query || query.trim().length < 1) {
    if (emptyState) emptyState.style.display = 'block'
    if (noResults) noResults.style.display = 'none'
    if (resultsList) resultsList.innerHTML = ''
    if (countEl) countEl.textContent = '0'
    clearMarkers()
    map.flyTo({ zoom: 12, duration: 500 })
    return
  }

  // Show loading state with premium button
  if (mainSearchBtn) {
    mainSearchBtn.disabled = true
    mainSearchBtn.classList.add('loading')
  }

  if (navSearchBtn) {
    navSearchBtn.disabled = true
    navSearchBtn.classList.add('loading')
  }

  // Show skeleton loading in results
  if (resultsList) {
    resultsList.innerHTML = generateSkeletons(4)
  }

  // Show loading feedback
  showSearchFeedback('loading', 'Searching nearby pharmacies...')

  const searchTerm = query.trim()
  log('info', 'Fetching search results for:', searchTerm)

  fetch(`/searchmedicine?mname=${encodeURIComponent(searchTerm)}`)
    .then(res => {
      if (!res.ok) throw new Error('Search API returned ' + res.status)
      return res.json()
    })
    .then(data => {
      if (!Array.isArray(data)) throw new Error('Search API returned non-array')
      log('info', 'API returned ' + data.length + ' raw results')

      const validData = data.filter(item => item.lat != null && item.lng != null)
      log('info', validData.length + ' items have valid coordinates')

      validData.forEach(item => {
        const lat = parseFloat(item.lat)
        const lng = parseFloat(item.lng)
        item.distance = calculateDistance(curentlat, curentlng, lat, lng)
      })
      log('info', 'Distances calculated from user location', { lat: curentlat, lng: curentlng })

      validData.sort((a, b) => a.distance - b.distance)
      log('info', 'Sorted by distance, nearest:', validData.length > 0 ? validData[0].shopname + ' (' + formatDistance(validData[0].distance) + ')' : 'none')

      if (validData.length === 0) {
        log('info', 'No valid pharmacies found for:', searchTerm)
        updateResultsUI([])
        clearMarkers()
        return
      }

      updateResultsUI(validData)

      if (mainSearchBtn) {
        mainSearchBtn.disabled = false
        if (mainSearchBtnText) mainSearchBtnText.textContent = 'Search'
      }

      if (navSearchBtn) {
        navSearchBtn.disabled = false
        navSearchBtn.classList.remove('loading')
      }

      const nearest = validData[0]
      log('info', 'Search result: ' + validData.length + ' pharmacies, nearest: ' + nearest.shopname)
      
      isNewSearch = true
      placeMarkers(validData)
      isNewSearch = false // Reset after placing markers
      
      // MapLibre uses different flyTo syntax
      map.flyTo({
        center: [parseFloat(nearest.lng), parseFloat(nearest.lat)],
        zoom: 16,
        duration: 1000,
      })
      
      // Auto-show route to nearest pharmacy after popup opens
      setTimeout(() => {
        if (userLocationResolved && nearest.lat && nearest.lng) {
          console.log('[EMF] Auto-displaying route to nearest pharmacy')
          showRouteToPharmacy(nearest.lat, nearest.lng, nearest.shopname, buildAddress(nearest))
        }
      }, 2000)
      
      demo = validData
      log('info', 'Search complete - ' + validData.length + ' pharmacies displayed with zoom effect')
    })
    .catch(err => {
      log('error', 'Search failed:', err.message)
      clearMarkers()
      updateResultsUI([])
      if (mainSearchBtn) {
        mainSearchBtn.disabled = false
        if (mainSearchBtnText) mainSearchBtnText.textContent = 'Search'
      }
      if (navSearchBtn) {
        navSearchBtn.disabled = false
        navSearchBtn.classList.remove('loading')
      }
    })
}

// Fetch suggestions
function fetchSuggestions(prefix) {
  if (!prefix || prefix.trim().length < 2) {
    hideSuggestions()
    return
  }
  const input = getSearchInput()
  if (!input) return
  fetch(`/medicine-suggestions?q=${encodeURIComponent(prefix.trim())}`)
    .then(r => r.json())
    .then(names => showSuggestions(names, input))
    .catch(() => hideSuggestions())
}

// Get suggestions container
function getSuggestionsContainer(input) {
  if (!input) return null
  const parent = input.closest('.input-group') || input.parentElement
  let container = parent.querySelector('.suggestions-dropdown')
  if (!container) {
    container = document.createElement('div')
    container.className = 'suggestions-dropdown'
    container.style.cssText = 'position:absolute;top:100%;left:0;right:0;background:white;border:1px solid #e5e7eb;border-radius:0 0 12px 12px;box-shadow:0 8px 24px rgba(0,0,0,0.1);z-index:9999;max-height:280px;overflow-y:auto;display:none;'
    parent.style.position = 'relative'
    parent.appendChild(container)
  }
  return container
}

// Show suggestions
function showSuggestions(items, input) {
  const container = getSuggestionsContainer(input)
  if (!container) return
  if (!items || items.length === 0) {
    container.style.display = 'none'
    return
  }
  container.innerHTML = items.map(name => `
    <div class="suggestion-item" style="padding:10px 14px;cursor:pointer;border-bottom:1px solid #f3f4f6;font-size:0.9rem;color:#14532D;display:flex;align-items:center;gap:8px;transition:background 0.15s;"
      onmouseover="this.style.background='#F0FDF4'" onmouseout="this.style.background=''"
      onclick="selectSuggestion('${name.replace(/'/g, "\\'")}')">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="#15803D" style="flex-shrink:0;"><rect x="7" y="3" width="4" height="18" rx="2"/><rect x="12" y="7" width="4" height="10" rx="2" transform="rotate(90 14 12)"/></svg>
      ${name}
    </div>
  `).join('')
  container.style.display = 'block'
}

// Hide suggestions
function hideSuggestions() {
  document.querySelectorAll('.suggestions-dropdown').forEach(el => el.style.display = 'none')
}

// Select suggestion
function selectSuggestion(name) {
  const input = getSearchInput()
  if (input) {
    input.value = name
    hideSuggestions()
    performSearch(name)
  }
}

// Attach search listeners
function attachSearchListeners() {
  const mainSearchInput = document.getElementById('searchmedi-page')
  const navSearchInput = document.getElementById('searchmedi')
  const mainSearchBtn = document.getElementById('search-btn')
  const navSearchBtn = document.getElementById('searchmedi-btn')

  if (!mainSearchInput && !navSearchInput) {
    log('warn', 'No search input found, retrying in 500ms')
    setTimeout(attachSearchListeners, 500)
    return
  }
  log('info', 'Attaching search listeners to both inputs')

  function setupInputEvents(input, btn) {
    if (!input) return
    
    input.addEventListener('input', e => {
      const value = e.target.value
      if (searchTimeout) clearTimeout(searchTimeout)
      searchTimeout = setTimeout(() => performSearch(value), 300)
      if (suggestionsTimeout) clearTimeout(suggestionsTimeout)
      suggestionsTimeout = setTimeout(() => fetchSuggestions(value), 100)
    })

    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        e.preventDefault()
        if (searchTimeout) clearTimeout(searchTimeout)
        performSearch(e.target.value)
        hideSuggestions()
      }
    })

    input.addEventListener('blur', () => {
      setTimeout(hideSuggestions, 200)
    })

    input.addEventListener('focus', e => {
      if (e.target.value.trim().length >= 2) fetchSuggestions(e.target.value)
    })
  }

  function setupBtnEvent(btn, input) {
    if (!btn || !input) return
    btn.addEventListener('click', (e) => {
      e.preventDefault()
      if (searchTimeout) clearTimeout(searchTimeout)
      performSearch(input.value)
      hideSuggestions()
    })
  }

  setupInputEvents(mainSearchInput, mainSearchBtn)
  setupInputEvents(navSearchInput, navSearchBtn)
  setupBtnEvent(mainSearchBtn, mainSearchInput)
  setupBtnEvent(navSearchBtn, navSearchInput)
}

// Handle request
function handleRequest(btn, serviceId, shopEmail) {
  const isLoggedIn = document.body.getAttribute('data-logged-in') === 'true'
  if (!isLoggedIn) { window.location.href = '/login'; return }
  const form = document.createElement('form')
  form.method = 'post'; form.action = '/book-service'
  const input = document.createElement('input')
  input.type = 'hidden'; input.name = 'service_id'; input.value = serviceId
  form.appendChild(input)
  document.body.appendChild(form)
  form.submit()
}

// Handle request from popup
function handleRequestFromPopup(serviceId, shopEmail) {
  const isLoggedIn = document.body.getAttribute('data-logged-in') === 'true'
  if (!isLoggedIn) { window.location.href = '/login'; return }
  const form = document.createElement('form')
  form.method = 'post'; form.action = '/book-service'
  const input = document.createElement('input')
  input.type = 'hidden'; input.name = 'service_id'; input.value = serviceId
  form.appendChild(input)
  document.body.appendChild(form)
  form.submit()
}

// Initialize search listeners
attachSearchListeners()

log('info', 'Home.js (MapLibre) loaded successfully')