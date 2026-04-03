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
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

  const attribution = isDark
    ? '&copy; <a href="https://carto.com/">CARTO</a>'
    : '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>';

  const markersJs = ENTREGAS_MAPA.map((e) => {
    const color = STATUS_COLORS[e.status] || '#9E9E9E';
    return `
      L.circleMarker([${e.lat}, ${e.lng}], {
        radius: 10,
        fillColor: '${color}',
        color: '#fff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.9
      }).addTo(map).bindPopup(
        '<b>${e.cliente}</b><br>ETA: ${e.eta}<br>Status: ${e.status}'
      );
    `;
  }).join('\n');

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
    html, body, #map { height: 100%; width: 100%; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    var map = L.map('map', { zoomControl: true, attributionControl: true })
                .setView([${userLat}, ${userLng}], 13);

    L.tileLayer('${tileUrl}', {
      attribution: '${attribution}',
      maxZoom: 19
    }).addTo(map);

    // Marcador do motorista (azul)
    var driverIcon = L.divIcon({
      html: '<div style="width:18px;height:18px;border-radius:50%;background:#1A237E;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.4);"></div>',
      iconSize: [18, 18],
      className: ''
    });
    L.marker([${userLat}, ${userLng}], { icon: driverIcon })
      .addTo(map)
      .bindPopup('<b>Você está aqui</b>');

    // Marcadores de entrega
    ${markersJs}
  </script>
</body>
</html>
  `;
}

export default function MapsScreen() {
  const { theme, isDark } = useTheme();
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedEntrega, setSelectedEntrega] = useState<typeof ENTREGAS_MAPA[0] | null>(null);
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
        // fallback: centro de São Paulo
        setLocation({ lat: -23.5505, lng: -46.6333 });
      }
      setLoading(false);
    })();
  }, []);

  const centerOnMe = () => {
    if (!location || !webViewRef.current) return;
    webViewRef.current.injectJavaScript(
      `map.setView([${location.lat}, ${location.lng}], 14); true;`
    );
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

  return (
    <View style={s.container}>
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

      {/* Card inferior — próxima entrega */}
      <View style={s.infoCard}>
        <View style={s.infoCardLeft}>
          <Ionicons name="cube" size={20} color={theme.primary} />
          <View>
            <Text style={s.infoLabel}>PRÓXIMA PARADA</Text>
            <Text style={s.infoValue}>
              {ENTREGAS_MAPA.find((e) => e.status === 'transito')?.cliente ?? 'Nenhuma em trânsito'}
            </Text>
          </View>
        </View>
        <View style={s.infoCardRight}>
          <Text style={s.infoEtaLabel}>ETA</Text>
          <Text style={s.infoEtaValue}>
            {ENTREGAS_MAPA.find((e) => e.status === 'transito')?.eta ?? '—'}
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
    infoLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 1, color: theme.textMuted },
    infoValue: { fontSize: 14, fontWeight: '600', color: theme.textPrimary, marginTop: 2 },
    infoCardRight: { alignItems: 'flex-end' },
    infoEtaLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 1, color: theme.textMuted },
    infoEtaValue: { fontSize: 18, fontWeight: '700', color: theme.primary, marginTop: 2 },
  });
