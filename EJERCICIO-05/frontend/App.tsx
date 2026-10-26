// App.tsx — editar viaje (estado y fecha) con PATCH
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

type Viaje = {
  id: number;
  destino: string;
  pais: string;
  estado: string;
  fecha: string;
};

// En móvil físico sustituye por tu IP local (ej: http://192.168.1.XX:3000)
const API_URL = 'http://localhost:3000';

export default function App() {
  const [viaje, setViaje] = useState<Viaje | null>(null);
  const [estado, setEstado] = useState('RESERVADO');
  const [fecha, setFecha] = useState('2027-04-10');
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState('');

  // Cargamos los datos del viaje 1 al iniciar
  useEffect(() => {
    async function cargarViaje() {
      try {
        const respuesta = await fetch(API_URL + '/viajes/1');
        if (respuesta.ok) {
          const dato: Viaje = await respuesta.json();
          setViaje(dato);
          setEstado(dato.estado);
          setFecha(dato.fecha);
        }
      } catch {
        // En caso de estar arrancando
      }
    }
    cargarViaje();
  }, []);

  async function actualizar() {
    setGuardando(true);
    setMensaje('');

    try {
      const respuesta = await fetch(API_URL + '/viajes/1', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          estado,
          fecha,
        }),
      });

      if (!respuesta.ok) {
        throw new Error('No se pudo actualizar');
      }

      const actualizado: Viaje = await respuesta.json();
      setViaje(actualizado);
      setMensaje('Viaje actualizado ✓');
    } catch {
      setMensaje('No se pudo conectar o actualizar');
    } finally {
      setGuardando(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>TRAVEL BOOK</Text>
          <Text style={styles.title}>Editar viaje</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.destination}>✈️ {viaje?.destino ?? 'Tokio'}</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusBadgeText}>{viaje?.estado ?? estado}</Text>
            </View>
          </View>

          <Text style={styles.country}>{viaje?.pais ?? 'Japón'}</Text>

          <View style={styles.dateRow}>
            <Text style={styles.dateLabel}>📅 Fecha programada:</Text>
            <Text style={styles.dateValue}>{viaje?.fecha ?? fecha}</Text>
          </View>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Estado del viaje</Text>
          <TextInput
            style={styles.input}
            value={estado}
            onChangeText={setEstado}
            placeholder="Ej: RESERVADO, EN CURSO, REALIZADO"
          />

          <Text style={styles.label}>Fecha (YYYY-MM-DD)</Text>
          <TextInput
            style={styles.input}
            value={fecha}
            onChangeText={setFecha}
            placeholder="YYYY-MM-DD"
          />

          <TouchableOpacity
            style={[styles.button, guardando && styles.buttonDisabled]}
            onPress={actualizar}
            disabled={guardando}
          >
            {guardando ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Guardar cambios</Text>
            )}
          </TouchableOpacity>

          {mensaje !== '' && (
            <View style={[styles.statusBox, mensaje.includes('✓') ? styles.statusSuccess : styles.statusError]}>
              <Text style={styles.statusBoxText}>{mensaje}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scroll: {
    padding: 24,
  },
  header: {
    marginBottom: 20,
    marginTop: 10,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0284C7',
    letterSpacing: 2,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  destination: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
  },
  statusBadge: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusBadgeText: {
    color: '#0369A1',
    fontWeight: '700',
    fontSize: 12,
  },
  country: {
    fontSize: 15,
    color: '#64748B',
    marginTop: 4,
    marginBottom: 16,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 12,
  },
  dateLabel: {
    fontSize: 14,
    color: '#475569',
  },
  dateValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  form: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: '#F1F5F9',
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
    fontSize: 15,
    color: '#0F172A',
  },
  button: {
    backgroundColor: '#0284C7',
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  statusBox: {
    marginTop: 14,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  statusSuccess: {
    backgroundColor: '#DCFCE7',
  },
  statusError: {
    backgroundColor: '#FEE2E2',
  },
  statusBoxText: {
    fontWeight: '600',
    fontSize: 14,
  },
});
