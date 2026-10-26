// App.tsx — confirmar DELETE y marcar como leído con PATCH sincronizando la UI
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type Libro = {
  id: number;
  titulo: string;
  autor: string;
  genero: string;
  leido: boolean;
};

// En móvil físico sustituye por tu IP local (ej: http://192.168.1.XX:3000)
const API_URL = 'http://localhost:3000';

export default function App() {
  const [libros, setLibros] = useState<Libro[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  async function cargar() {
    try {
      const r = await fetch(API_URL + '/libros');
      if (!r.ok) throw new Error('Error al obtener libros');
      const datos: Libro[] = await r.json();
      setLibros(datos);
    } catch {
      setError('No se pudo conectar con la API de libros');
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargar();
  }, []);

  function confirmarEliminar(libro: Libro) {
    Alert.alert('Eliminar libro', `¿Deseas eliminar "${libro.titulo}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => eliminar(libro.id) },
    ]);
  }

  async function eliminar(id: number) {
    try {
      await fetch(API_URL + '/libros/' + id, { method: 'DELETE' });
      // Sincronizamos el estado local eliminando el elemento de la lista
      setLibros((actuales) => actuales.filter((l) => l.id !== id));
    } catch {
      Alert.alert('Error', 'No se pudo eliminar el libro');
    }
  }

  async function alternarLeido(libro: Libro) {
    try {
      const nuevoEstado = !libro.leido;
      const respuesta = await fetch(API_URL + '/libros/' + libro.id + '/leido', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leido: nuevoEstado }),
      });

      if (respuesta.ok) {
        // Sincronizamos la propiedad leido en el estado local de React
        setLibros((actuales) =>
          actuales.map((l) => (l.id === libro.id ? { ...l, leido: nuevoEstado } : l)),
        );
      }
    } catch {
      Alert.alert('Error', 'No se pudo actualizar el estado de lectura');
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <Text style={styles.eyebrow}>MY LIBRARY</Text>
        <Text style={styles.title}>Biblioteca</Text>
        <Text style={styles.subtitle}>Gestión de lecturas con persistencia real</Text>
      </View>

      {cargando && <ActivityIndicator size="large" color="#4F46E5" style={styles.center} />}

      {error !== '' && <Text style={styles.error}>{error}</Text>}

      {!cargando && error === '' && (
        <FlatList
          data={libros}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardTop}>
                <View style={styles.bookInfo}>
                  <Text style={styles.bookTitle}>📚 {item.titulo}</Text>
                  <Text style={styles.bookAuthor}>{item.autor}</Text>
                  <Text style={styles.bookGenre}>{item.genero}</Text>
                </View>

                <View style={[styles.statusBadge, item.leido ? styles.statusRead : styles.statusPending]}>
                  <Text style={[styles.statusText, item.leido ? styles.statusReadText : styles.statusPendingText]}>
                    {item.leido ? 'Leído ✓' : 'Pendiente'}
                  </Text>
                </View>
              </View>

              <View style={styles.cardActions}>
                <TouchableOpacity
                  style={[styles.actionBtn, styles.toggleBtn]}
                  onPress={() => alternarLeido(item)}
                >
                  <Text style={styles.toggleBtnText}>
                    {item.leido ? 'Marcar pendiente' : 'Marcar como leído'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionBtn, styles.deleteBtn]}
                  onPress={() => confirmarEliminar(item)}
                >
                  <Text style={styles.deleteBtnText}>Eliminar</Text>
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
    color: '#4F46E5',
    letterSpacing: 2,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 4,
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
    borderRadius: 18,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  bookInfo: {
    flex: 1,
    paddingRight: 10,
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  bookAuthor: {
    fontSize: 14,
    color: '#475569',
    marginTop: 3,
  },
  bookGenre: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  statusRead: {
    backgroundColor: '#DCFCE7',
  },
  statusPending: {
    backgroundColor: '#FEF3C7',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  statusReadText: {
    color: '#166534',
  },
  statusPendingText: {
    color: '#92400E',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 12,
  },
  actionBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  toggleBtn: {
    backgroundColor: '#EEF2FF',
  },
  toggleBtnText: {
    color: '#4338CA',
    fontWeight: '600',
    fontSize: 13,
  },
  deleteBtn: {
    backgroundColor: '#FEE2E2',
  },
  deleteBtnText: {
    color: '#B91C1C',
    fontWeight: '600',
    fontSize: 13,
  },
  center: {
    marginTop: 60,
  },
  error: {
    color: '#EF4444',
    textAlign: 'center',
    marginTop: 30,
    paddingHorizontal: 20,
  },
});
