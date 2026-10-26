// App.tsx — Wander Full Stack Challenge con mejoras reales (Prioridad + Visita)
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

type Destino = {
  id: number;
  ciudad: string;
  pais: string;
  descripcion: string;
  prioridad: string; // 'ALTA' | 'MEDIA' | 'BAJA'
  visitado: boolean;
};

// En móvil físico sustituye por tu IP local (ej: http://192.168.1.XX:3000)
const API_URL = 'http://localhost:3000';

export default function App() {
  const [destinos, setDestinos] = useState<Destino[]>([]);
  const [ciudad, setCiudad] = useState('');
  const [pais, setPais] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [prioridad, setPrioridad] = useState('ALTA');
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  async function request(url: string, options?: RequestInit) {
    const r = await fetch(url, options);
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return r;
  }

  async function cargar() {
    try {
      const r = await request(API_URL + '/destinos');
      const datos: Destino[] = await r.json();
      setDestinos(datos);
      setError('');
    } catch {
      setError('No se pudieron cargar los destinos de la API.');
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargar();
  }, []);

  async function crear() {
    if (!ciudad.trim() || !pais.trim()) {
      setError('Introduce ciudad y país');
      return;
    }

    setGuardando(true);
    try {
      await request(API_URL + '/destinos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ciudad,
          pais,
          descripcion: descripcion.trim() || 'Nuevo destino por explorar',
          prioridad,
          visitado: false,
        }),
      });
      setCiudad('');
      setPais('');
      setDescripcion('');
      await cargar();
    } catch {
      setError('No se pudo crear el destino.');
    } finally {
      setGuardando(false);
    }
  }

  async function toggleVisita(id: number) {
    try {
      await request(API_URL + '/destinos/' + id + '/visitar', {
        method: 'PATCH',
      });
      await cargar();
    } catch {
      setError('No se pudo actualizar el estado de visita.');
    }
  }

  async function editarDescripcion(id: number, descripcionActual: string) {
    try {
      const nuevaDesc = descripcionActual + ' (Revisado)';
      await request(API_URL + '/destinos/' + id, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ descripcion: nuevaDesc }),
      });
      await cargar();
    } catch {
      setError('No se pudo editar el destino.');
    }
  }

  async function eliminar(id: number) {
    try {
      await request(API_URL + '/destinos/' + id, { method: 'DELETE' });
      await cargar();
    } catch {
      setError('No se pudo eliminar el destino.');
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <Text style={styles.eyebrow}>WANDER</Text>
        <Text style={styles.title}>Destinos de viaje</Text>
        <Text style={styles.subtitle}>Gestión completa Full Stack con Prioridad y Visitas</Text>
      </View>

      {/* Formulario de Creación */}
      <View style={styles.formCard}>
        <Text style={styles.formTitle}>＋ Añadir nuevo destino</Text>

        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="Ciudad (ej: Oslo)"
            value={ciudad}
            onChangeText={setCiudad}
          />
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="País (ej: Noruega)"
            value={pais}
            onChangeText={setPais}
          />
        </View>

        <TextInput
          style={styles.input}
          placeholder="Descripción o plan"
          value={descripcion}
          onChangeText={setDescripcion}
        />

        <View style={styles.prioritySelector}>
          <Text style={styles.priorityLabel}>Prioridad:</Text>
          {(['ALTA', 'MEDIA', 'BAJA'] as const).map((p) => (
            <TouchableOpacity
              key={p}
              style={[styles.priorityChip, prioridad === p && styles.priorityChipActive]}
              onPress={() => setPrioridad(p)}
            >
              <Text
                style={[
                  styles.priorityChipText,
                  prioridad === p && styles.priorityChipTextActive,
                ]}
              >
                {p}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.createButton, guardando && styles.buttonDisabled]}
          onPress={crear}
          disabled={guardando}
        >
          {guardando ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.createButtonText}>Guardar destino</Text>
          )}
        </TouchableOpacity>
      </View>

      {error !== '' && <Text style={styles.error}>{error}</Text>}

      {cargando ? (
        <ActivityIndicator size="large" color="#059669" style={styles.center} />
      ) : (
        <FlatList
          data={destinos}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.cardInfo}>
                  <Text style={styles.destinationTitle}>🌍 {item.ciudad}</Text>
                  <Text style={styles.country}>{item.pais}</Text>
                </View>

                <View style={styles.badgesCol}>
                  <View
                    style={[
                      styles.priorityBadge,
                      item.prioridad === 'ALTA'
                        ? styles.priorityHigh
                        : item.prioridad === 'MEDIA'
                        ? styles.priorityMedium
                        : styles.priorityLow,
                    ]}
                  >
                    <Text
                      style={[
                        styles.priorityText,
                        item.prioridad === 'ALTA'
                          ? styles.priorityHighText
                          : item.prioridad === 'MEDIA'
                          ? styles.priorityMediumText
                          : styles.priorityLowText,
                      ]}
                    >
                      Prioridad {item.prioridad}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={[styles.visitedBadge, item.visitado ? styles.visitedTrue : styles.visitedFalse]}
                    onPress={() => toggleVisita(item.id)}
                  >
                    <Text
                      style={[styles.visitedText, item.visitado ? styles.visitedTrueText : styles.visitedFalseText]}
                    >
                      {item.visitado ? 'Visitado ✓' : 'Pendiente'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {item.descripcion ? (
                <Text style={styles.description}>{item.descripcion}</Text>
              ) : null}

              <View style={styles.cardActions}>
                <TouchableOpacity
                  style={[styles.btn, styles.btnEdit]}
                  onPress={() => editarDescripcion(item.id, item.descripcion)}
                >
                  <Text style={styles.btnEditText}>Editar nota</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.btn, styles.btnDelete]}
                  onPress={() => eliminar(item.id)}
                >
                  <Text style={styles.btnDeleteText}>Eliminar</Text>
                </TouchableOpacity>
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
    backgroundColor: '#F0FDF4',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 12,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '800',
    color: '#059669',
    letterSpacing: 2,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#064E3B',
    marginTop: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  formTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#065F46',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  halfInput: {
    flex: 1,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    fontSize: 14,
    color: '#0F172A',
  },
  prioritySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  priorityLabel: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '600',
  },
  priorityChip: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  priorityChipActive: {
    backgroundColor: '#059669',
  },
  priorityChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  priorityChipTextActive: {
    color: '#FFFFFF',
  },
  createButton: {
    backgroundColor: '#059669',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
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
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  cardInfo: {
    flex: 1,
  },
  destinationTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  country: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
  },
  badgesCol: {
    alignItems: 'flex-end',
    gap: 6,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  priorityHigh: {
    backgroundColor: '#FEF2F2',
  },
  priorityHighText: {
    color: '#DC2626',
  },
  priorityMedium: {
    backgroundColor: '#FEF3C7',
  },
  priorityMediumText: {
    color: '#D97706',
  },
  priorityLow: {
    backgroundColor: '#F0FDF4',
  },
  priorityLowText: {
    color: '#16A34A',
  },
  priorityText: {
    fontSize: 11,
    fontWeight: '700',
  },
  visitedBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  visitedTrue: {
    backgroundColor: '#DCFCE7',
  },
  visitedTrueText: {
    color: '#166534',
  },
  visitedFalse: {
    backgroundColor: '#F1F5F9',
  },
  visitedFalseText: {
    color: '#64748B',
  },
  visitedText: {
    fontSize: 11,
    fontWeight: '700',
  },
  description: {
    fontSize: 13,
    color: '#334155',
    marginBottom: 10,
    backgroundColor: '#F8FAFC',
    padding: 8,
    borderRadius: 8,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
  },
  btn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  btnEdit: {
    backgroundColor: '#E0F2FE',
  },
  btnEditText: {
    color: '#0369A1',
    fontWeight: '600',
    fontSize: 12,
  },
  btnDelete: {
    backgroundColor: '#FEE2E2',
  },
  btnDeleteText: {
    color: '#B91C1C',
    fontWeight: '600',
    fontSize: 12,
  },
  center: {
    marginTop: 50,
  },
  error: {
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 10,
    paddingHorizontal: 20,
  },
});
