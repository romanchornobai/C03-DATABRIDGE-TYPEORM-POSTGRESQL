// App.tsx
// RESPONSABILIDAD: solicitar una mascota concreta y mostrar su ficha completa con nivelEnergia.
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type Mascota = {
  id: number;
  nombre: string;
  raza: string;
  edad: number;
  ciudad: string;
  nivelEnergia: string;
};

// En móvil físico sustituye por tu IP local (ej: http://192.168.1.XX:3000)
const API_URL = 'http://localhost:3000';

export default function App() {
  const [mascota, setMascota] = useState<Mascota | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function cargarMascota() {
      try {
        // Solicitamos la mascota concreta con ID 1
        const respuesta = await fetch(API_URL + '/mascotas/1');
        if (!respuesta.ok) {
          throw new Error('Mascota no encontrada o error en la API');
        }
        const dato: Mascota = await respuesta.json();
        setMascota(dato);
      } catch {
        setError('No se ha podido conectar con NestJS. Revisa la IP y el backend.');
      } finally {
        setCargando(false);
      }
    }

    cargarMascota();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <Text style={styles.eyebrow}>PET PROFILE</Text>
        <Text style={styles.headerTitle}>Ficha de mascota</Text>
      </View>

      {cargando && (
        <ActivityIndicator size="large" color="#0284C7" style={styles.center} />
      )}

      {error !== '' && (
        <Text style={styles.error}>{error}</Text>
      )}

      {!cargando && mascota && (
        <View style={styles.card}>
          <View style={styles.avatarContainer}>
            <Text style={styles.emoji}>🐶</Text>
          </View>

          <Text style={styles.name}>{mascota.nombre}</Text>
          <Text style={styles.breed}>{mascota.raza}</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoText}>
              {mascota.edad} años · {mascota.ciudad}
            </Text>
          </View>

          <View style={styles.energyBadge}>
            <Text style={styles.energyText}>
              ⚡ Nivel de energía: <Text style={styles.energyValue}>{mascota.nivelEnergia.toUpperCase()}</Text>
            </Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEF6FF',
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0284C7',
    letterSpacing: 2,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 28,
    borderRadius: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  avatarContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emoji: {
    fontSize: 48,
  },
  name: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
  },
  breed: {
    fontSize: 16,
    color: '#64748B',
    marginTop: 4,
  },
  infoRow: {
    marginTop: 8,
    marginBottom: 18,
  },
  infoText: {
    fontSize: 15,
    color: '#475569',
  },
  energyBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    width: '100%',
    alignItems: 'center',
  },
  energyText: {
    color: '#92400E',
    fontSize: 14,
    fontWeight: '600',
  },
  energyValue: {
    fontWeight: '800',
  },
  center: {
    marginTop: 40,
  },
  error: {
    color: '#EF4444',
    textAlign: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
});
