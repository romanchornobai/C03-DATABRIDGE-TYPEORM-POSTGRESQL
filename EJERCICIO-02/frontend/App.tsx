// App.tsx
// RESPONSABILIDAD: pedir la colección y mostrar una cartelera con soporte de favoritas.
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type Pelicula = {
  id: number;
  titulo: string;
  genero: string;
  anio: number;
  puntuacion: number;
  favorita: boolean;
};

// En móvil físico sustituye TU_IP_LOCAL por la IP del ordenador (ej: http://192.168.1.XX:3000)
const API_URL = 'http://localhost:3000';

export default function App() {
  const [peliculas, setPeliculas] = useState<Pelicula[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function cargarPeliculas() {
      try {
        const respuesta = await fetch(API_URL + '/peliculas');
        if (!respuesta.ok) {
          throw new Error('La API no respondió correctamente');
        }
        const datos: Pelicula[] = await respuesta.json();
        setPeliculas(datos);
      } catch {
        setError('No se ha podido conectar con NestJS. Revisa la IP y el puerto.');
      } finally {
        setCargando(false);
      }
    }

    cargarPeliculas();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.eyebrow}>CINEBOX</Text>
        <Text style={styles.title}>Cartelera</Text>
        <Text style={styles.subtitle}>
          Colección ordenada por puntuación desde PostgreSQL
        </Text>
      </View>

      {cargando && <ActivityIndicator size="large" color="#0284C7" style={styles.center} />}

      {error !== '' && <Text style={styles.error}>{error}</Text>}

      {!cargando && error === '' && (
        <FlatList
          data={peliculas}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.movie}>🎬 {item.titulo}</Text>
                <Text style={[styles.heart, item.favorita ? styles.heartActive : styles.heartInactive]}>
                  {item.favorita ? '♥' : '♡'}
                </Text>
              </View>
              <View style={styles.cardFooter}>
                <Text style={styles.details}>{item.genero} · {item.anio}</Text>
                <View style={styles.badge}>
                  <Text style={styles.score}>★ {Number(item.puntuacion).toFixed(1)}</Text>
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
    paddingBottom: 16,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0284C7',
    letterSpacing: 2,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 2,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  movie: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
  },
  heart: {
    fontSize: 22,
    marginLeft: 10,
  },
  heartActive: {
    color: '#E11D48',
  },
  heartInactive: {
    color: '#94A3B8',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  details: {
    color: '#64748B',
    fontSize: 14,
  },
  badge: {
    backgroundColor: '#FEF08A',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  score: {
    color: '#854D0E',
    fontWeight: '700',
    fontSize: 13,
  },
  center: {
    marginTop: 60,
  },
  error: {
    color: '#EF4444',
    textAlign: 'center',
    marginHorizontal: 24,
    marginTop: 40,
  },
});
