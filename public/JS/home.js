const markers = []
const markerToIndexMap = {}
let demo = []
let curentlat = 23.8103
let curentlng = 90.4125
let searchTimeout = null
let suggestionsTimeout = null
let userMarker = null
let userPulse = null
let userLocationResolved = false

const pharmacyIcon = L.icon({
  iconUrl: '/images/marker-pharmacy.svg',
  iconSize: [32, 48],
  iconAnchor: [16, 48],
  popupAnchor: [0, -48],
})

const userIcon = L.icon({
  iconUrl: '/images/marker-user.svg',
  iconSize: [32, 48],
  iconAnchor: [16, 48],
  popupAnchor: [0, -48],
})

const selectedIcon = L.icon({
  iconUrl: '/images/marker-selected.svg',
  iconSize: [40, 56],
  iconAnchor: [20, 56],
  popupAnchor: [0, -56],
})

function log(level, msg, data) {
  const prefix = '[EMF]'
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

const map = L.map('shopmap', {
  doubleClickZoom: false,
  zoomControl: true
}).setView([23.8103, 90.4125], 12)

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map)

function onMapReady() {
  log('info', 'Map initialized successfully')
}
map.whenReady(onMapReady)

function addUserLocation(lat, lng) {
  log('info', 'Adding user location marker', { lat, lng })
  if (userMarker) { map.removeLayer(userMarker); userMarker = null }
  if (userPulse) { map.removeLayer(userPulse); userPulse = null }

  var pulseCircle = L.circleMarker([lat, lng], {
    radius: 14, color: '#15803D', fillColor: '#22C55E',
    fillOpacity: 0.15, weight: 2, opacity: 0.4,
    className: 'user-location-pulse',
  }).addTo(map)
  userPulse = pulseCircle

  userMarker = L.marker([lat, lng], {
    icon: userIcon, draggable: false, zIndexOffset: 1000,
  }).addTo(map)
  userMarker.bindPopup(`
    <div style="font-family:'Figtree',sans-serif;text-align:center;">
      <div style="font-weight:700;color:#0369A1;font-size:0.95rem;">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0369A1" stroke-width="2" style="display:inline;vertical-align:-2px;margin-right:4px;"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3" fill="#0369A1"/></svg>
        Your Location
      </div>
      <div style="font-size:0.8rem;color:#6b7280;margin-top:2px;">${lat.toFixed(4)}, ${lng.toFixed(4)}</div>
    </div>
  `)
}

function locateUser() {
  if (!navigator.geolocation) {
    log('warn', 'Geolocation not supported, using default center')
    map.setView([23.8103, 90.4125], 12)
    return
  }
  log('info', 'Requesting user location...')
  navigator.geolocation.getCurrentPosition(
    position => {
      const { latitude, longitude } = position.coords
      curentlat = latitude
      curentlng = longitude
      userLocationResolved = true
      log('info', 'User location resolved', { lat: latitude, lng: longitude })
      map.setView([latitude, longitude], 13)
      addUserLocation(latitude, longitude)
    },
    err => {
      log('warn', 'Geolocation denied/error, using default', err.message || err)
      map.setView([23.8103, 90.4125], 12)
    },
    { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
  )
}

locateUser()

function clearMarkers() {
  log('info', 'Clearing ' + markers.length + ' old markers')
  markers.forEach(m => {
    if (m && m._map) map.removeLayer(m)
  })
  markers.length = 0
  Object.keys(markerToIndexMap).forEach(k => delete markerToIndexMap[k])
}

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
  }
}

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

function focusMarker(index) {
  if (!demo[index]) return
  log('info', 'Focusing marker index', index)
  const item = demo[index]
  
  map.flyTo([parseFloat(item.lat), parseFloat(item.lng)], 15, { 
    duration: 0.5,
    easeLinearity: 0.25
  })
  
  clearMarkers()
  placeMarkers(demo, index)
  highlightSidebarCard(index)
  
  setTimeout(() => {
    const marker = markerToIndexMap[index]
    if (marker) {
      marker.openPopup()
    }
  }, 600)
}

function highlightMarker(index) {
  if (!demo[index] || !markerToIndexMap[index]) return
  log('info', 'Hover on card ' + index + ' - highlighting marker')
  highlightSidebarCard(index)
  const marker = markerToIndexMap[index]
  marker.setIcon(selectedIcon)
  if (marker._popup && !marker._popup.isOpen()) {
    marker.openPopup()
  }
}

function unhighlightMarker(index) {
  if (!demo[index] || !markerToIndexMap[index]) return
  const marker = markerToIndexMap[index]
  if (marker._icon && marker._icon.classList.contains('selected-marker')) return
  marker.setIcon(pharmacyIcon)
}

function placeMarkers(data, focusIndex) {
  clearMarkers()
  log('info', 'Placing ' + data.length + ' markers on map')
  Object.keys(markerToIndexMap).forEach(k => delete markerToIndexMap[k])

  data.forEach((item, i) => {
    if (item.lat == null || item.lng == null) {
      log('warn', 'Skipping item without coordinates', item.shopname)
      return
    }
    var icon = i === focusIndex ? selectedIcon : pharmacyIcon
    var marker = L.marker([parseFloat(item.lat), parseFloat(item.lng)], {
      icon: icon, draggable: false,
    }).addTo(map)

    markerToIndexMap[i] = marker

    const dist = item.distance ? formatDistance(item.distance) : '--'
    const distRaw = item.distance || 0
    const qty = item.stock != null ? parseInt(item.stock) : 0
    const stockLabel = qty > 10 ? 'In Stock' : qty > 0 ? 'Low Stock' : 'Out of Stock'
    const stockColor = qty > 10 ? '#15803D' : qty > 0 ? '#D97706' : '#dc2626'
    const addr = buildAddress(item)
    const isNearest = i === 0

    marker.bindPopup(`
      <div style="font-family:'Figtree',sans-serif;min-width:220px;max-width:300px;">
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
          style="width:100%;padding:8px;margin-top:6px;background:#15803D;color:white;border:none;border-radius:8px;font-weight:600;cursor:pointer;font-size:0.85rem;display:flex;align-items:center;justify-content:center;gap:6px;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>
          Request This Medicine
        </button>
      </div>
    `, { maxWidth: 320, className: 'pharmacy-popup' })

    marker.on('mouseover', () => {
      log('info', 'Hover on marker ' + i)
      highlightSidebarCard(i)
    })

    marker.on('mouseout', () => {
      if (i !== focusIndex) {
        document.querySelectorAll('.result-card').forEach(c => {
          c.style.borderColor = '#e5e7eb'
          c.style.boxShadow = 'none'
          c.style.background = 'white'
        })
        const nearest = document.querySelector('.result-card[data-index="0"]')
        if (nearest) {
          nearest.style.borderColor = '#15803D'
        }
      }
    })

    marker.on('click', () => {
      highlightSidebarCard(i)
      const cards = document.querySelectorAll('.result-card')
      cards.forEach(c => c.style.borderColor = '#e5e7eb')
      if (cards[i]) cards[i].style.borderColor = '#15803D'
    })

    markers.push(marker)
  })

  log('info', markers.length + ' markers rendered on map')
}

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
    map.setZoom(12, { animate: true })
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
      
      map.flyTo([parseFloat(nearest.lat), parseFloat(nearest.lng)], 16, {
        duration: 1.0,
        easeLinearity: 0.25
      })

      setTimeout(() => {
        const nearestMarker = markerToIndexMap[0]
        if (nearestMarker) {
          nearestMarker.openPopup()
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

function hideSuggestions() {
  document.querySelectorAll('.suggestions-dropdown').forEach(el => el.style.display = 'none')
}

function selectSuggestion(name) {
  const input = getSearchInput()
  if (input) {
    input.value = name
    hideSuggestions()
    performSearch(name)
  }
}

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

attachSearchListeners()

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

log('info', 'Home.js loaded successfully')
