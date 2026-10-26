// App.tsx — mostrar Playlist y añadir canciones a una playlist concreta
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

type Cancion = {
  id: number;
  titulo: string;
  artista: string;
};

type Playlist = {
  id: number;
  nombre: string;
  canciones: Cancion[];
};

// En móvil físico sustituye por tu IP local (ej: http://192.168.1.XX:3000)
const API_URL = 'http://localhost:3000';

export default function App() {
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  // Formulario para nueva canción
  const [titulo, setTitulo] = useState('Midnight City');
  const [artista, setArtista] = useState('M83');
  const [guardando, setGuardando] = useState(false);

  async function cargar() {
    try {
      const r = await fetch(API_URL + '/playlists/1');
      if (!r.ok) throw new Error('Error al cargar playlist');
      const datos: Playlist = await r.json();
      setPlaylist(datos);
      setError('');
    } catch {
      setError('No se pudo conectar con la API de playlists');
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargar();
  }, []);

  async function anadirCancion() {
    if (!titulo.trim() || !artista.trim()) return;

    setGuardando(true);
    try {
      const r = await fetch(API_URL + '/playlists/1/canciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo,
          artista,
        }),
      });

      if (!r.ok) throw new Error('Error al guardar la canción');

      // Limpiamos los campos y recargamos la playlist con su relación
      setTitulo('');
      setArtista('');
      await cargar();
    } catch {
      setError('Error al añadir canción a la playlist');
    } finally {
      setGuardando(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <Text style={styles.eyebrow}>MY PLAYLISTS</Text>
        <Text style={styles.title}>{playlist?.nombre ?? 'Cargando playlist...'}</Text>
        <Text style={styles.subtitle}>
          Relación OneToMany (Playlist) ➔ ManyToOne (Canciones)
        </Text>
      </View>

      {/* Formulario para agregar canción */}
      <View style={styles.formCard}>
        <Text style={styles.formTitle}>＋ Añadir canción a Playlist 1</Text>

        <TextInput
          style={styles.input}
          placeholder="Título de la canción"
          value={titulo}
          onChangeText={setTitulo}
        />

        <TextInput
          style={styles.input}
          placeholder="Artista"
          value={artista}
          onChangeText={setArtista}
        />

        <TouchableOpacity
          style={[styles.addButton, guardando && styles.buttonDisabled]}
          onPress={anadirCancion}
          disabled={guardando}
        >
          {guardando ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.addButtonText}>＋ Añadir a la lista</Text>
          )}
        </TouchableOpacity>
      </View>

      {error !== '' && <Text style={styles.error}>{error}</Text>}

      {cargando ? (
        <ActivityIndicator size="large" color="#0D9488" style={styles.center} />
      ) : (
        <FlatList
          data={playlist?.canciones ?? []}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.iconBox}>
                <Text style={styles.musicEmoji}>🎵</Text>
              </View>

              <View style={styles.songContent}>
                <Text style={styles.songTitle}>{item.titulo}</Text>
                <Text style={styles.songArtist}>{item.artista}</Text>
              </View>

              <View style={styles.tag}>
                <Text style={styles.tagText}>Playlist {playlist?.id}</Text>
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
    backgroundColor: '#F0FDFA',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0D9488',
    letterSpacing: 2,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#134E4A',
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
    shadowColor: '#0D9488',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  formTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F766E',
    marginBottom: 10,
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
  addButton: {
    backgroundColor: '#0D9488',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#CCFBF1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  musicEmoji: {
    fontSize: 22,
  },
  songContent: {
    flex: 1,
  },
  songTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  songArtist: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
  },
  tag: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tagText: {
    color: '#475569',
    fontSize: 11,
    fontWeight: '600',
  },
  center: {
    marginTop: 40,
  },
  error: {
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 10,
    paddingHorizontal: 20,
  },
});
