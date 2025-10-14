import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// --- Custom CSS for the map page ---
const customMapStyles = `
  .map-page {
    position: relative;
    height: 100%;
    width: 100%;
    overflow: hidden;
  }
  .map-overlay-controls {
    position: absolute;
    top: 15px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1000;
    display: flex;
    gap: 8px;
    background: rgba(255, 255, 255, 0.8);
    padding: 8px;
    border-radius: 30px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    backdrop-filter: blur(10px);
  }
  .map-btn {
    background: #f0f0f0;
    border: 1px solid #ddd;
    border-radius: 20px;
    padding: 8px 16px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 600;
    color: #333;
    transition: all 0.2s ease;
  }
  .map-btn:hover {
    background: #e0e0e0;
    border-color: #ccc;
  }
  .map-btn.active {
    background: #2e7d32;
    color: white;
    border-color: #2e7d32;
  }
  .ac-marker {
    display: grid;
    place-items: center;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    color: #fff;
    font-size: 18px;
    box-shadow: 0 6px 20px rgba(0,0,0,0.2);
    border: 2px solid rgba(255,255,255,0.8);
    user-select: none;
  }
  .ac-marker.crops { background: linear-gradient(135deg, #4CAF50, #2E7D32); }
  .ac-marker.equipment { background: linear-gradient(135deg, #FF9800, #F57C00); }
  .ac-marker.weather { background: linear-gradient(135deg, #2196F3, #1976D2); }
  .ac-marker.default { background: linear-gradient(135deg, #9C27B0, #7B1FA2); }
`;

// --- Sample Data ---
const farmData = [
    { id: 1, name: 'Green Valley Farm', type: 'crops', lat: 19.0350, lng: 73.0310, description: 'Wheat and Rice cultivation', status: 'active', icon: '🌾' },
    { id: 2, name: 'Organic Paradise', type: 'crops', lat: 19.0310, lng: 73.0280, description: 'Organic vegetables and fruits', status: 'active', icon: '🥬' },
    { id: 3, name: 'Equipment Hub', type: 'equipment', lat: 19.0370, lng: 73.0320, description: 'Tractors and farming equipment available', status: 'available', icon: '🚜' },
    { id: 4, name: 'Weather Station', type: 'weather', lat: 19.0340, lng: 73.0300, description: 'Local weather monitoring station', status: 'operational', icon: '🌤️' },
    { id: 5, name: 'Dairy Farm', type: 'all', lat: 19.0360, lng: 73.0270, description: 'Milk production and cattle farming', status: 'active', icon: '🐄' }
];
const mgmKamothe = { lat: 19.0330, lng: 73.0297 };

// --- Helper to create custom icons ---
const createIcon = (type, emoji) => L.divIcon({
    className: 'ac-div-icon',
    html: `<div class="ac-marker ${type || 'default'}">${emoji || '📍'}</div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18]
});

// A component to render markers based on the selected filter
const Markers = ({ filter }) => {
    const map = useMap();
    
    useEffect(() => {
        // Invalidate map size on change to fix potential rendering issues
        map.invalidateSize();
    }, [filter, map]);

    const filteredData = farmData.filter(farm => {
        if (filter === 'all') return true;
        return farm.type === filter || farm.type === 'all';
    });

    return (
        <>
            {filteredData.map(farm => (
                <Marker key={farm.id} position={[farm.lat, farm.lng]} icon={createIcon(farm.type, farm.icon)}>
                    <Popup>
                        <div style={{ maxWidth: "300px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                                <span style={{ fontSize: "1.4rem" }}>{farm.icon}</span>
                                <h3 style={{ margin: 0, color: "#2e7d32", fontSize: "1.1rem" }}>{farm.name}</h3>
                            </div>
                            <p style={{ margin: "0 0 8px 0", color: "#555", lineHeight: 1.4 }}>{farm.description}</p>
                            <div style={{ display: "inline-block", padding: "4px 10px", borderRadius: "14px", fontWeight: 700, fontSize: "0.85rem",
                                background: farm.status === 'active' ? '#e8f5e9' : farm.status === 'available' ? '#fff3e0' : '#e3f2fd',
                                color: farm.status === 'active' ? '#2e7d32' : farm.status === 'available' ? '#f57c00' : '#1976d2',
                                border: "1px solid rgba(0,0,0,0.06)" }}>{farm.status}</div>
                        </div>
                    </Popup>
                </Marker>
            ))}
            {/* MGM Marker */}
            <Marker position={[mgmKamothe.lat, mgmKamothe.lng]} icon={L.divIcon({ className: 'ac-div-icon', html: '<div class="ac-marker default" style="background:linear-gradient(135deg,#E91E63,#C2185B);font-size:14px;font-weight:700">M</div>', iconSize: [40, 40], iconAnchor: [20, 20], popupAnchor: [0, -20] })}>
                 <Popup>
                    <div style={{maxWidth: "300px"}}>
                        <div style={{display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px"}}>
                            <span style={{fontSize: "1.4rem"}}>🏫</span>
                            <h3 style={{margin: 0, color: "#E91E63", fontSize: "1.1rem"}}>MGM Kamothe</h3>
                        </div>
                        <p style={{margin: 0, color: "#555", lineHeight: 1.4}}>College Campus - Agri-Culture Project Center</p>
                    </div>
                 </Popup>
            </Marker>
        </>
    );
};

const Map = () => {
    const [filter, setFilter] = useState('all');

    return (
        <>
            <style>{customMapStyles}</style>
            <div className="map-page">
                <div className="map-overlay-controls">
                    <button className={`map-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}><span>🌾</span> All Farms</button>
                    <button className={`map-btn ${filter === 'crops' ? 'active' : ''}`} onClick={() => setFilter('crops')}><span>🌱</span> Crops</button>
                    <button className={`map-btn ${filter === 'equipment' ? 'active' : ''}`} onClick={() => setFilter('equipment')}><span>🚜</span> Equipment</button>
                    <button className={`map-btn ${filter === 'weather' ? 'active' : ''}`} onClick={() => setFilter('weather')}><span>🌤️</span> Weather</button>
                </div>
                <MapContainer center={[mgmKamothe.lat, mgmKamothe.lng]} zoom={15} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Markers filter={filter} />
                </MapContainer>
            </div>
        </>
    );
};

export default Map;