import { useTheme } from '@/constants/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

// Entregas mock com coordenadas (São Paulo)
const ENTREGAS_MAPA = [
  { id: '1', cliente: 'Supermercado Bom Preço', lat: -23.5505, lng: -46.6333, status: 'transito', eta: '09:45' },
  { id: '2', cliente: 'Farmácia Saúde Total', lat: -23.5595, lng: -46.6550, status: 'pendente', eta: '10:30' },
  { id: '3', cliente: 'Padaria Pão de Ouro', lat: -23.5430, lng: -46.6290, status: 'entregue', eta: '08:15' },
  { id: '4', cliente: 'Atacado Distribuidora Sul', lat: -23.5650, lng: -46.6200, status: 'pendente', eta: '11:00' },
  { id: '5', cliente: 'Loja Elétrica Brilha Mais', lat: -23.5480, lng: -46.6450, status: 'transito', eta: '11:45' },
];

const STATUS_COLORS: Record<string, string> = {
  transito: '#F5A623',
  pendente: '#9E9E9E',
  entregue: '#4CAF50',
};

function buildMapHtml(userLat: number, userLng: number, isDark: boolean): string {
  const tileUrl = isDark
    ? 'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'
    : 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

  const attribution = isDark
    ? '&copy; <a href="https://carto.com/">CARTO</a>'
    : '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>';

  const nextEntrega = ENTREGAS_MAPA.find((e) => e.status === 'transito');

  const markersJs = ENTREGAS_MAPA.map((e) => {
    const color = STATUS_COLORS[e.status] || '#9E9E9E';
    const isNext = e.id === nextEntrega?.id;
    return `
      L.circleMarker([${e.lat}, ${e.lng}], {
        radius: ${isNext ? 13 : 10},
        fillColor: '${color}',
        color: '#fff',
        weight: ${isNext ? 3 : 2},
        opacity: 1,
        fillOpacity: 0.95
      }).addTo(map).bindPopup(
        '<b>${e.cliente}</b><br>ETA: ${e.eta}<br>Status: ${e.status}'
      )${isNext ? ".openPopup()" : ""};
    `;
  }).join('\n');

  // Busca rota da API OSRM e desenha no mapa
  const routeJs = nextEntrega ? `
    fetch('https://router.project-osrm.org/route/v1/driving/${userLng},${userLat};${nextEntrega.lng},${nextEntrega.lat}?overview=full&geometries=geojson')
      .then(r => r.json())
      .then(data => {
        if (data.routes && data.routes.length > 0) {
          var coords = data.routes[0].geometry.coordinates.map(function(c) {
            return [c[1], c[0]];
          });
          L.polyline(coords, {
            color: '#4A90E2',
            weight: 5,
            opacity: 0.85,
            lineJoin: 'round',
            lineCap: 'round'
          }).addTo(map);
        }
      })
      .catch(function(e) { console.log('Erro rota:', e); });
  ` : '';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body, #map { height: 100%; width: 100%; background: ${isDark ? '#1a1a2e' : '#f0f0f0'}; }
    .leaflet-popup-content-wrapper {
      border-radius: 10px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.25);
      font-family: -apple-system, sans-serif;
    }
    .leaflet-popup-content b { color: #333; font-size: 13px; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    var map = L.map('map', { zoomControl: true, attributionControl: true })
                .setView([${userLat}, ${userLng}], 14);

    L.tileLayer('${tileUrl}', {
      attribution: '${attribution}',
      maxZoom: 19
    }).addTo(map);

    // Marcador do motorista (carro azul)
    var driverIcon = L.divIcon({
      html: '<div style="width:32px;height:32px;border-radius:50%;background:#1A237E;border:3px solid white;box-shadow:0 3px 8px rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;font-size:14px;">🚗</div>',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      className: ''
    });
    L.marker([${userLat}, ${userLng}], { icon: driverIcon })
      .addTo(map)
      .bindPopup('<b>Você está aqui</b>');

    // Marcadores de entrega
    ${markersJs}

    // Rota via OSRM
    ${routeJs}

    // Expõe função para centralizar
    window.centerOnMe = function() {
      map.setView([${userLat}, ${userLng}], 15, { animate: true });
    };
  </script>
</body>
</html>
  `;
}

export default function MapsScreen() {
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [loading, setLoading] = useState(true);
  const webViewRef = useRef<WebView>(null);

  const s = styles(theme, isDark);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setPermissionDenied(true);
        setLoading(false);
        return;
      }
      try {
        const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        setLocation({ lat: loc.coords.latitude, lng: loc.coords.longitude });
      } catch {
        setLocation({ lat: -23.5505, lng: -46.6333 });
      }
      setLoading(false);
    })();
  }, []);

  const centerOnMe = () => {
    webViewRef.current?.injectJavaScript('window.centerOnMe(); true;');
  };

  if (loading) {
    return (
      <View style={s.centered}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={s.loadingText}>Obtendo localização...</Text>
      </View>
    );
  }

  if (permissionDenied) {
    return (
      <View style={s.centered}>
        <Ionicons name="location-outline" size={56} color={theme.textMuted} />
        <Text style={s.permTitle}>Permissão negada</Text>
        <Text style={s.permText}>
          Acesse as configurações do dispositivo e permita o acesso à localização para o LappJ.
        </Text>
      </View>
    );
  }

  const mapHtml = buildMapHtml(location!.lat, location!.lng, isDark);
  const nextEntrega = ENTREGAS_MAPA.find((e) => e.status === 'transito');

  return (
    <View style={[s.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={s.header}>
        <Text style={s.headerTitle}>Mapa de Entregas</Text>
        <View style={s.legend}>
          {Object.entries(STATUS_COLORS).map(([key, color]) => (
            <View key={key} style={s.legendItem}>
              <View style={[s.legendDot, { backgroundColor: color }]} />
              <Text style={s.legendText}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Mapa */}
      <View style={s.mapContainer}>
        <WebView
          ref={webViewRef}
          originWhitelist={['*']}
          source={{ html: mapHtml }}
          style={s.map}
          javaScriptEnabled
          domStorageEnabled
          scalesPageToFit={false}
          onMessage={() => {}}
        />

        {/* Botão centralizar */}
        <TouchableOpacity style={s.centerButton} onPress={centerOnMe}>
          <Ionicons name="navigate" size={22} color={theme.primary} />
        </TouchableOpacity>
      </View>

      {/* Card inferior */}
      <View style={s.infoCard}>
        <View style={s.infoCardLeft}>
          <View style={[s.statusDot, { backgroundColor: STATUS_COLORS['transito'] }]} />
          <View>
            <Text style={s.infoLabel}>PRÓXIMA PARADA</Text>
            <Text style={s.infoValue}>
              {nextEntrega?.cliente ?? 'Nenhuma em trânsito'}
            </Text>
          </View>
        </View>
        <View style={s.infoCardRight}>
          <Text style={s.infoEtaLabel}>ETA</Text>
          <Text style={s.infoEtaValue}>
            {nextEntrega?.eta ?? '—'}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = (theme: any, isDark: boolean) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background },
    centered: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.background,
      padding: 32,
      gap: 16,
    },
    loadingText: { fontSize: 15, color: theme.textSecondary, marginTop: 8 },
    permTitle: { fontSize: 18, fontWeight: '700', color: theme.textPrimary, textAlign: 'center' },
    permText: { fontSize: 14, color: theme.textSecondary, textAlign: 'center', lineHeight: 22 },
    header: {
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
      backgroundColor: theme.surface,
    },
    headerTitle: { fontSize: 17, fontWeight: '700', color: theme.textPrimary, marginBottom: 8 },
    legend: { flexDirection: 'row', gap: 16 },
    legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
    legendDot: { width: 10, height: 10, borderRadius: 5 },
    legendText: { fontSize: 12, color: theme.textSecondary, fontWeight: '600' },
    mapContainer: { flex: 1, position: 'relative' },
    map: { flex: 1 },
    centerButton: {
      position: 'absolute',
      bottom: 16,
      right: 16,
      width: 46,
      height: 46,
      borderRadius: 23,
      backgroundColor: theme.surface,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      borderWidth: 1,
      borderColor: theme.border,
    },
    infoCard: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginHorizontal: 16,
      marginVertical: 12,
      padding: 14,
      backgroundColor: theme.surface,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: isDark ? theme.border : 'transparent',
      elevation: 2,
    },
    infoCardLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
    statusDot: { width: 10, height: 10, borderRadius: 5, marginTop: 2 },
    infoLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 1, color: theme.textMuted },
    infoValue: { fontSize: 14, fontWeight: '600', color: theme.textPrimary, marginTop: 2 },
    infoCardRight: { alignItems: 'flex-end' },
    infoEtaLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 1, color: theme.textMuted },
    infoEtaValue: { fontSize: 18, fontWeight: '700', color: theme.primary, marginTop: 2 },
  });
