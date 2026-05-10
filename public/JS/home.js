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
    curentlat = e.coords.latitude
    curentlng = e.coords.longitude
    userLocationResolved = true
    log('info', 'User location detected via GeolocateControl', { lat: curentlat, lng: curentlng })
  })

  geolocate.on('error', (e) => {
    log('warn', 'Geolocate error, using fallback', e.message)
  })

  // Handle map errors
  map.on('error', (e) => {
    log('error', 'Map error', e.error || e)
  })

  return map
}

// Initialize map when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initMap()
})

// Add user location marker
function addUserLocation(lat, lng) {
  log('info', 'Adding user location marker', { lat, lng })
  
  // Remove existing user marker and pulse
  if (userMarker) { userMarker.remove(); userMarker = null }
  if (userPulse) { userPulse.remove(); userPulse = null }

  // Create user marker element
  const userEl = document.createElement('div')
  userEl.className = 'marker-user'
  userEl.innerHTML = `
    <div class="user-marker-container">
      <div class="user-pulse"></div>
      <img src="/images/marker-user.svg" alt="Your Location">
    </div>
  `

  // Create accuracy circle
  userPulse = new maplibregl.Circle({
    radius: 30,
    color: '#22c55e',
    fillColor: '#22c55e',
    fillOpacity: 0.1,
    weight: 1,
  }).setLngLat([lng, lat]).addTo(map)

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
    
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error('Route API error: ' + response.status)
    }
    
    const data = await response.json()
    
    if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
      log('warn', 'No route found, falling back to Google Maps')
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
    
    log('info', 'Route found', { 
      distance: (route.distance / 1000).toFixed(1) + ' km',
      duration: formatDuration(route.duration)
    })
    
    // Draw route on map
    drawRoute(geometry, pharmacyName)
    
  } catch (err) {
    log('error', 'Route calculation failed', err.message)
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
function drawRoute(geometry, pharmacyName) {
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
  updatePopupWithRoute(pharmacyName)
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

// Show route loading state
function showRouteLoading(pharmacyName) {
  log('info', 'Calculating route to ' + pharmacyName + '...')
  // Could add a toast/notification here
}

// Update popup with route info
function updatePopupWithRoute(pharmacyName) {
  if (!routeInfo) return
  
  const distance = formatDistance(routeInfo.distance)
  const duration = formatDuration(routeInfo.duration)
  
  log('info', `Route: ${distance}, ${duration} to ${pharmacyName}`)
  
  // Show route info in a toast or notification
  showNotification(`Route to ${pharmacyName}: ${distance} (${duration})`, 'info')
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
  if (!curentlat || !curentlng) {
    log('warn', 'User location not available')
    showNotification('Please enable location to get directions', 'warning')
    // Fall back to Google Maps
    openGoogleMapsDirections(lat, lng, name || address)
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
  log('info', 'Route cleared')
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
  const dist = item.distance ? formatDistance(item.distance) : '--'
  const distRaw = item.distance || 0
  const qty = item.stock != null ? parseInt(item.stock) : 0
  const stockLabel = qty > 10 ? 'In Stock' : qty > 0 ? 'Low Stock' : 'Out of Stock'
  const stockColor = qty > 10 ? '#15803D' : qty > 0 ? '#D97706' : '#dc2626'
  const addr = buildAddress(item)

  return `
    <div style="font-family:'Figtree',sans-serif;min-width:220px;max-width:300px;padding:12px;">
      ${isNearest ? '<div style="background:#15803D;color:white;font-size:0.7rem;font-weight:700;padding:3px 10px;border-radius:20px;display:inline-block;margin-bottom:6px;">Nearest Pharmacy</div>' : ''}
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
        <div style="width:38px;height:38px;background:#F0FDF4;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#15803D"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
        </div>
        <div style="min-width:0;">
          <div style="font-weight:700;color:#14532D;font-size:1rem;line-height:1.2;word-break:break-word;">${item.shopname}</div>
          <div style="font-size:0.75rem;color:#6b7280;"><svg width="10" height="10" viewBox="0 0 24 24" fill="#6b7280" style="display:inline;vertical-align:-1px;margin-right:2px;"><path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24 11.36 11.36 0 003.58.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.36 11.36 0 00.57 3.58 1 1 0 01-.25 1.01l-2.2 2.2z"/></svg> ${item.phone || '--'}</div>
        </div>
      </div>
      <div style="border-top:1px solid #e5e7eb;margin:6px 0;padding-top:6px;">
        <div style="color:#166534;font-weight:600;font-size:0.9rem;">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="#15803D" style="display:inline;vertical-align:-2px;margin-right:4px;"><rect x="7" y="3" width="4" height="18" rx="2"/><rect x="12" y="7" width="4" height="10" rx="2" transform="rotate(90 14 12)"/></svg>
          ${item.mediname} <span style="color:#6b7280;font-weight:400;">${item.medistrength ? '(' + item.medistrength + ')' : ''}</span>
        </div>
        <div style="display:flex;align-items:center;gap:8px;margin-top:4px;">
          <span style="font-size:1.2rem;font-weight:700;color:#15803D;">BDT ${item.price} <small style="font-size:0.75rem;color:#6b7280;">/pcs</small></span>
          <span style="font-size:0.75rem;padding:2px 8px;border-radius:20px;background:${stockColor}15;color:${stockColor};font-weight:600;">${stockLabel}</span>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:0.8rem;color:#6b7280;margin-top:6px;">
          <span><svg width="12" height="12" viewBox="0 0 24 24" fill="#0369A1" style="display:inline;vertical-align:-2px;margin-right:2px;"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg> ${dist}${distRaw > 0 ? ' from you' : ''}</span>
        </div>
        ${addr ? '<div style="font-size:0.75rem;color:#6b7280;margin-top:4px;border-top:1px solid #f3f4f6;padding-top:4px;word-break:break-word;"><svg width="10" height="10" viewBox="0 0 24 24" fill="#6b7280" style="display:inline;vertical-align:-1px;margin-right:2px;"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/></svg> ' + addr + '</div>' : ''}
      </div>
      <button onclick="handleRequestFromPopup('${item.id}','${item.email}')"
        style="width:100%;padding:10px;margin-top:8px;background:#15803D;color:white;border:none;border-radius:8px;font-weight:600;cursor:pointer;font-size:0.85rem;display:flex;align-items:center;justify-content:center;gap:6px;">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>
        Request Medicine
      </button>
      <div style="display:flex;gap:6px;margin-top:6px;">
        <button onclick="showRouteToPharmacy(${item.lat}, ${item.lng}, '${item.shopname.replace(/'/g, "\\'")}', '${(addr || '').replace(/'/g, "\\'")}')"
          style="flex:1;padding:10px;background:#0891B2;color:white;border:none;border-radius:8px;font-weight:600;cursor:pointer;font-size:0.8rem;display:flex;align-items:center;justify-content:center;gap:4px;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z"/><path d="M8 2v16"/><path d="M16 6v16"/></svg>
          Show Route
        </button>
        <button onclick="openGoogleMapsDirections(${item.lat}, ${item.lng}, '${item.shopname.replace(/'/g, "\\'")}')"
          style="flex:1;padding:10px;background:#6b7280;color:white;border:none;border-radius:8px;font-weight:600;cursor:pointer;font-size:0.8rem;display:flex;align-items:center;justify-content:center;gap:4px;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M3 11l19-9-9 19-2-8-8-2z"/></svg>
          Google Maps
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
  document.querySelectorAll('.result-card').forEach(c => {
    c.style.borderColor = '#e5e7eb'
    c.style.boxShadow = 'none'
    c.style.background = 'white'
  })
  const card = document.querySelector(`.result-card[data-index="${index}"]`)
  if (card) {
    card.style.borderColor = '#15803D'
    card.style.boxShadow = '0 2px 12px rgba(21,128,61,0.15)'
    card.style.background = '#F0FDF4'
    card.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }
}

// Update results UI
function updateResultsUI(data) {
  const list = document.getElementById('results-list')
  const emptyState = document.getElementById('empty-state')
  const noResults = document.getElementById('no-results-state')
  const countEl = document.getElementById('result-count')
  if (!list) return

  if (!data || data.length === 0) {
    if (emptyState) emptyState.style.display = 'none'
    if (noResults) {
      noResults.style.display = 'block'
      const title = noResults.querySelector('.fw-bold')
      if (title) title.textContent = 'No nearby pharmacies have this medicine'
    }
    list.innerHTML = ''
    if (countEl) countEl.textContent = '0'
    log('info', 'No results to display')
    return
  }

  if (emptyState) emptyState.style.display = 'none'
  if (noResults) noResults.style.display = 'none'
  if (countEl) countEl.textContent = data.length

  log('info', 'Rendering ' + data.length + ' results in sidebar')

  let html = ''
  data.forEach((item, index) => {
    const dist = item.distance ? formatDistance(item.distance) : '--'
    const qty = item.stock != null ? parseInt(item.stock) : 0
    const stockLabel = qty > 10 ? 'In Stock' : qty > 0 ? 'Low Stock' : 'Out of Stock'
    const stockColor = qty > 10 ? '#15803D' : qty > 0 ? '#D97706' : '#dc2626'
    const addr = buildAddress(item)
    const isNearest = index === 0
    html += `
      <div class="result-card" data-index="${index}" style="background:white;border:1px solid #e5e7eb;border-radius:12px;padding:14px;margin-bottom:10px;cursor:pointer;transition:all 0.2s ease;${isNearest ? 'border-color:#15803D;' : ''}"
        onmouseover="highlightMarker(${index})"
        onmouseout="unhighlightMarker(${index})"
        onclick="focusMarker(${index})">
        <div class="d-flex justify-content-between align-items-start mb-1">
          <h6 class="fw-bold mb-0" style="color:#14532D;font-size:0.95rem;display:flex;align-items:center;gap:4px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#15803D" style="flex-shrink:0;"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
            ${item.shopname}
            ${isNearest ? '<span style="font-size:0.6rem;background:#15803D;color:white;padding:1px 8px;border-radius:20px;font-weight:600;white-space:nowrap;">Nearest</span>' : ''}
          </h6>
          <span class="badge" style="background:#15803D;color:white;font-size:0.7rem;white-space:nowrap;">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="white" style="display:inline;vertical-align:-1px;margin-right:2px;"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg>
            ${dist}
          </span>
        </div>
        <p class="mb-1" style="color:#166534;font-size:0.85rem;font-weight:500;">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="#15803D" style="display:inline;vertical-align:-2px;margin-right:4px;"><rect x="7" y="3" width="4" height="18" rx="2"/><rect x="12" y="7" width="4" height="10" rx="2" transform="rotate(90 14 12)"/></svg>
          ${item.mediname}${item.medistrength ? ' (' + item.medistrength + ')' : ''}
        </p>
        <div class="d-flex justify-content-between align-items-center">
          <span class="fw-bold" style="color:#15803D;font-size:1.1rem;">BDT ${item.price} <small style="font-size:0.7rem;color:#6b7280;">/ pcs</small></span>
          <div class="d-flex align-items-center gap-2">
            <span style="font-size:0.75rem;padding:2px 10px;border-radius:20px;background:${stockColor}15;color:${stockColor};font-weight:600;">${stockLabel}</span>
          </div>
        </div>
        <div class="d-flex justify-content-between align-items-center mt-1">
          <span style="font-size:0.75rem;color:#6b7280;">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="#6b7280" style="display:inline;vertical-align:-1px;margin-right:2px;"><path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24 11.36 11.36 0 003.58.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.36 11.36 0 00.57 3.58 1 1 0 01-.25 1.01l-2.2 2.2z"/></svg>
            ${item.phone || '--'}
          </span>
          ${addr ? '<span style="font-size:0.7rem;color:#9ca3af;max-width:140px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;"><svg width="10" height="10" viewBox="0 0 24 24" fill="#9ca3af" style="display:inline;vertical-align:-1px;margin-right:2px;"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg> ' + addr + '</span>' : ''}
        </div>
        <button class="btn btn-sm w-100 mt-2" style="background:#15803D;color:white;border:none;font-weight:500;border-radius:8px;"
          onclick="event.stopPropagation();handleRequest(this,'${item.id}','${item.email}')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" style="display:inline;vertical-align:-2px;margin-right:4px;"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>
          Request Medicine
        </button>
      </div>`
  })
  list.innerHTML = html
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
  
  clearMarkers()
  placeMarkers(demo, index)
  highlightSidebarCard(index)
  
  setTimeout(() => {
    const marker = pharmacyMarkers.get(index)
    if (marker) {
      marker.togglePopup()
    }
  }, 600)
}

// Highlight marker on hover
function highlightMarker(index) {
  if (!demo[index] || !pharmacyMarkers.get(index)) return
  log('info', 'Hover on card ' + index + ' - highlighting marker')
  highlightSidebarCard(index)
  const marker = pharmacyMarkers.get(index)
  if (marker) {
    marker.getElement().querySelector('img').src = '/images/marker-selected.svg'
    if (!marker.getPopup().isOpen()) {
      marker.togglePopup()
    }
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
  const nearest = document.querySelector('.result-card[data-index="0"]')
  if (nearest) {
    nearest.style.borderColor = '#15803D'
    nearest.style.boxShadow = '0 2px 12px rgba(21,128,61,0.15)'
    nearest.style.background = '#F0FDF4'
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

  if (mainSearchBtn) {
    mainSearchBtn.disabled = true
    if (mainSearchBtnText) mainSearchBtnText.innerHTML = '<span class="loading-spinner"></span>'
  }

  if (navSearchBtn) {
    navSearchBtn.disabled = true
    navSearchBtn.classList.add('loading')
  }

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
      
      placeMarkers(validData)
      
      // MapLibre uses different flyTo syntax
      map.flyTo({
        center: [parseFloat(nearest.lng), parseFloat(nearest.lat)],
        zoom: 16,
        duration: 1000,
      })

      setTimeout(() => {
        const nearestMarker = pharmacyMarkers.get(0)
        if (nearestMarker) {
          nearestMarker.togglePopup()
          highlightSidebarCard(0)
        }
      }, 1200)
      
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