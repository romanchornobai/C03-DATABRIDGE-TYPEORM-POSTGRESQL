// App.tsx — solicitar eventos combinando filtros ciudad + categoria con Query Params
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type Evento = {
  id: number;
  nombre: string;
  ciudad: string;
  categoria: string;
  fecha: string;
};

// En móvil físico sustituye por tu IP local (ej: http://192.168.1.XX:3000)
const API_URL = 'http://localhost:3000';

export default function App() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [ciudadFiltro, setCiudadFiltro] = useState('Zaragoza');
  const [categoriaFiltro, setCategoriaFiltro] = useState('Tecnología');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  async function filtrar(ciudad?: string, categoria?: string) {
    setCargando(true);
    setError('');

    try {
      const params = new URLSearchParams();
      if (ciudad) params.append('ciudad', ciudad);
      if (categoria) params.append('categoria', categoria);

      const queryStr = params.toString() ? '?' + params.toString() : '';
      const r = await fetch(API_URL + '/eventos' + queryStr);

      if (!r.ok) throw new Error('Error al filtrar eventos');
      const datos: Evento[] = await r.json();
      setEventos(datos);
    } catch {
      setError('No se pudo conectar con la API de eventos');
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    filtrar(ciudadFiltro, categoriaFiltro);
  }, []);

  function aplicarFiltro(c: string, cat: string) {
    setCiudadFiltro(c);
    setCategoriaFiltro(cat);
    filtrar(c, cat);
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <Text style={styles.eyebrow}>EVENT RADAR</Text>
        <Text style={styles.title}>Eventos filtrados</Text>
        <Text style={styles.subtitle}>Filtros combinados con Query Params (?ciudad=&categoria=)</Text>
      </View>

      {/* Selectores de Filtro */}
      <View style={styles.filterSection}>
        <Text style={styles.filterTitle}>Filtros rápidos:</Text>
        <View style={styles.chipsRow}>
          <TouchableOpacity
            style={[
              styles.chip,
              ciudadFiltro === 'Zaragoza' && categoriaFiltro === 'Tecnología' && styles.chipActive,
            ]}
            onPress={() => aplicarFiltro('Zaragoza', 'Tecnología')}
          >
            <Text
              style={[
                styles.chipText,
                ciudadFiltro === 'Zaragoza' && categoriaFiltro === 'Tecnología' && styles.chipTextActive,
              ]}
            >
              📍 Zaragoza · Tech
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.chip,
              ciudadFiltro === 'Zaragoza' && categoriaFiltro === '' && styles.chipActive,
            ]}
            onPress={() => aplicarFiltro('Zaragoza', '')}
          >
            <Text
              style={[
                styles.chipText,
                ciudadFiltro === 'Zaragoza' && categoriaFiltro === '' && styles.chipTextActive,
              ]}
            >
              Zaragoza (Todas)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.chip,
              ciudadFiltro === 'Madrid' && categoriaFiltro === 'Tecnología' && styles.chipActive,
            ]}
            onPress={() => aplicarFiltro('Madrid', 'Tecnología')}
          >
            <Text
              style={[
                styles.chipText,
                ciudadFiltro === 'Madrid' && categoriaFiltro === 'Tecnología' && styles.chipTextActive,
              ]}
            >
              Madrid · Tech
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.chip,
              ciudadFiltro === '' && categoriaFiltro === '' && styles.chipActive,
            ]}
            onPress={() => aplicarFiltro('', '')}
          >
            <Text
              style={[
                styles.chipText,
                ciudadFiltro === '' && categoriaFiltro === '' && styles.chipTextActive,
              ]}
            >
              Todos
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.activeFilterBadge}>
          <Text style={styles.activeFilterText}>
            Mostrando: <Text style={styles.bold}>{ciudadFiltro || 'Todas las ciudades'}</Text> ·{' '}
            <Text style={styles.bold}>{categoriaFiltro || 'Todas las categorías'}</Text>
          </Text>
        </View>
      </View>

      {error !== '' && <Text style={styles.error}>{error}</Text>}

      {cargando ? (
        <ActivityIndicator size="large" color="#6366F1" style={styles.center} />
      ) : (
        <FlatList
          data={eventos}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.empty}>No se encontraron eventos con estos filtros.</Text>
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.eventIcon}>🎟️</Text>
                <View style={styles.eventInfo}>
                  <Text style={styles.eventName}>{item.nombre}</Text>
                  <Text style={styles.eventLocation}>
                    {item.ciudad} · {item.categoria}
                  </Text>
                </View>
              </View>

              <View style={styles.cardFooter}>
                <Text style={styles.dateLabel}>Fecha:</Text>
                <View style={styles.dateBadge}>
                  <Text style={styles.dateText}>{item.fecha}</Text>
                </View>
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 12,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '800',
    color: '#6366F1',
    letterSpacing: 2,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  filterSection: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  filterTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 8,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  chipActive: {
    backgroundColor: '#6366F1',
    borderColor: '#4F46E5',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4338CA',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  activeFilterBadge: {
    backgroundColor: '#F1F5F9',
    padding: 8,
    borderRadius: 8,
    marginTop: 10,
  },
  activeFilterText: {
    fontSize: 12,
    color: '#475569',
  },
  bold: {
    fontWeight: '700',
    color: '#0F172A',
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  eventIcon: {
    fontSize: 30,
    marginRight: 12,
  },
  eventInfo: {
    flex: 1,
  },
  eventName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
  },
  eventLocation: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
  },
  dateLabel: {
    fontSize: 13,
    color: '#64748B',
  },
  dateBadge: {
    backgroundColor: '#E0E7FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  dateText: {
    color: '#4338CA',
    fontWeight: '700',
    fontSize: 12,
  },
  center: {
    marginTop: 50,
  },
  empty: {
    textAlign: 'center',
    color: '#94A3B8',
    marginTop: 40,
    fontSize: 15,
  },
  error: {
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 10,
    paddingHorizontal: 20,
  },
});
