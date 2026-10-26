// App.tsx — formulario POST y tarjeta creada
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
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

type Restaurante = {
  id: number;
  nombre: string;
  tipo: string;
  ciudad: string;
  puntuacion: number;
  precioMedio: number;
};

// En móvil físico sustituye por tu IP local (ej: http://192.168.1.XX:3000)
const API_URL = 'http://localhost:3000';

export default function App() {
  const [nombre, setNombre] = useState('La Trattoria');
  const [tipo, setTipo] = useState('Italiano');
  const [ciudad, setCiudad] = useState('Zaragoza');
  const [precioMedio, setPrecioMedio] = useState('25');
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [ultimoCreado, setUltimoCreado] = useState<Restaurante | null>(null);

  async function guardar() {
    if (!nombre.trim() || !tipo.trim() || !ciudad.trim() || !precioMedio.trim()) {
      setMensaje('Por favor, completa todos los campos');
      return;
    }

    setGuardando(true);
    setMensaje('');

    try {
      const respuesta = await fetch(API_URL + '/restaurantes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre,
          tipo,
          ciudad,
          puntuacion: 9.0,
          precioMedio: parseFloat(precioMedio) || 0,
        }),
      });

      if (!respuesta.ok) {
        throw new Error('Error al guardar en el servidor');
      }

      const creado: Restaurante = await respuesta.json();
      setUltimoCreado(creado);
      setMensaje('Restaurante guardado ✓');
    } catch {
      setMensaje('Error de conexión con el backend');
    } finally {
      setGuardando(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>FOOD SPOTS</Text>
          <Text style={styles.title}>Nuevo restaurante</Text>
        </View>

        {ultimoCreado && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardIcon}>🍜</Text>
              <View style={styles.cardTitleContainer}>
                <Text style={styles.cardTitle}>{ultimoCreado.nombre}</Text>
                <Text style={styles.cardSubtitle}>
                  {ultimoCreado.tipo} · {ultimoCreado.ciudad}
                </Text>
              </View>
            </View>

            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Precio medio:</Text>
              <View style={styles.priceBadge}>
                <Text style={styles.priceValue}>{Number(ultimoCreado.precioMedio).toFixed(0)} €</Text>
              </View>
            </View>
          </View>
        )}

        <View style={styles.form}>
          <Text style={styles.label}>Nombre</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: La Trattoria"
            value={nombre}
            onChangeText={setNombre}
          />

          <Text style={styles.label}>Tipo de cocina</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Italiano"
            value={tipo}
            onChangeText={setTipo}
          />

          <Text style={styles.label}>Ciudad</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Zaragoza"
            value={ciudad}
            onChangeText={setCiudad}
          />

          <Text style={styles.label}>Precio medio (€)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: 25"
            keyboardType="numeric"
            value={precioMedio}
            onChangeText={setPrecioMedio}
          />

          <TouchableOpacity
            style={[styles.button, guardando && styles.buttonDisabled]}
            onPress={guardar}
            disabled={guardando}
          >
            {guardando ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>＋ Guardar restaurante</Text>
            )}
          </TouchableOpacity>

          {mensaje !== '' && (
            <View style={[styles.statusBox, mensaje.includes('✓') ? styles.statusSuccess : styles.statusError]}>
              <Text style={styles.statusText}>{mensaje}</Text>
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
    backgroundColor: '#FFF7ED',
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
    color: '#EA580C',
    letterSpacing: 2,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#431407',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 20,
    marginBottom: 24,
    shadowColor: '#EA580C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#EA580C',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  cardTitleContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1C1917',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#78716C',
    marginTop: 2,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F4',
  },
  priceLabel: {
    fontSize: 14,
    color: '#57534E',
    fontWeight: '500',
  },
  priceBadge: {
    backgroundColor: '#FFEDD5',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  priceValue: {
    color: '#9A3412',
    fontWeight: '800',
    fontSize: 14,
  },
  form: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#78716C',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: '#F5F5F4',
    padding: 14,
    borderRadius: 12,
    marginBottom: 14,
    fontSize: 15,
    color: '#1C1917',
  },
  button: {
    backgroundColor: '#EA580C',
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 6,
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
  statusText: {
    fontWeight: '600',
    fontSize: 14,
  },
});
