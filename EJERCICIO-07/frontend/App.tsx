// App.tsx — CRUD completo Sneakers con regla de stock=0 -> AGOTADO
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

type Sneaker = {
  id: number;
  marca: string;
  modelo: string;
  precio: number;
  talla: number;
  stock: number;
};

// En móvil físico sustituye por tu IP local (ej: http://192.168.1.XX:3000)
const API_URL = 'http://localhost:3000';

export default function App() {
  const [items, setItems] = useState<Sneaker[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  async function request(url: string, options?: RequestInit) {
    const r = await fetch(url, options);
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return r;
  }

  async function cargar() {
    try {
      const r = await request(API_URL + '/sneakers');
      const datos: Sneaker[] = await r.json();
      setItems(datos);
      setError('');
    } catch {
      setError('No se pudo conectar con la API.');
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargar();
  }, []);

  async function crear() {
    try {
      await request(API_URL + '/sneakers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          marca: 'Nike',
          modelo: 'Air Jordan 1',
          precio: 169.99,
          talla: 43,
          stock: 3,
        }),
      });
      await cargar();
    } catch {
      setError('Error al crear sneaker.');
    }
  }

  async function rebajar(id: number, precioActual: number) {
    try {
      const nuevoPrecio = Math.max(10, Number(precioActual) - 10);
      await request(API_URL + '/sneakers/' + id, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ precio: nuevoPrecio }),
      });
      await cargar();
    } catch {
      setError('Error al actualizar precio.');
    }
  }

  async function modificarStock(id: number, stockActual: number, cambio: number) {
    try {
      const nuevoStock = Math.max(0, Number(stockActual) + cambio);
      await request(API_URL + '/sneakers/' + id, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock: nuevoStock }),
      });
      await cargar();
    } catch {
      setError('Error al actualizar stock.');
    }
  }

  async function eliminar(id: number) {
    try {
      await request(API_URL + '/sneakers/' + id, { method: 'DELETE' });
      await cargar();
    } catch {
      setError('Error al eliminar sneaker.');
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>SNEAKER VAULT</Text>
          <Text style={styles.title}>Inventario</Text>
        </View>
        <TouchableOpacity style={styles.newButton} onPress={crear}>
          <Text style={styles.newButtonText}>＋ Nueva</Text>
        </TouchableOpacity>
      </View>

      {error !== '' && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {cargando ? (
        <ActivityIndicator size="large" color="#0F172A" style={styles.center} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(x) => String(x.id)}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => {
            const agotado = Number(item.stock) === 0;

            return (
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={styles.sneakerMain}>
                    <Text style={styles.sneakerTitle}>👟 {item.modelo}</Text>
                    <Text style={styles.sneakerBrand}>
                      {item.marca} · Talla {item.talla}
                    </Text>
                  </View>

                  {/* REGLA DEL RETO: Si stock = 0 -> AGOTADO */}
                  <View
                    style={[
                      styles.stockBadge,
                      agotado ? styles.stockBadgeAgotado : styles.stockBadgeDisponible,
                    ]}
                  >
                    <Text
                      style={[
                        styles.stockText,
                        agotado ? styles.stockTextAgotado : styles.stockTextDisponible,
                      ]}
                    >
                      {agotado ? 'AGOTADO' : `Stock ${item.stock}`}
                    </Text>
                  </View>
                </View>

                <View style={styles.cardPriceRow}>
                  <Text style={styles.price}>{Number(item.precio).toFixed(2)} €</Text>
                </View>

                <View style={styles.cardActions}>
                  <TouchableOpacity
                    style={[styles.btn, styles.btnStock]}
                    onPress={() => modificarStock(item.id, item.stock, -1)}
                    disabled={agotado}
                  >
                    <Text style={styles.btnStockText}>-1 Stock</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.btn, styles.btnStock]}
                    onPress={() => modificarStock(item.id, item.stock, 1)}
                  >
                    <Text style={styles.btnStockText}>+1 Stock</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.btn, styles.btnRebajar]}
                    onPress={() => rebajar(item.id, item.precio)}
                  >
                    <Text style={styles.btnRebajarText}>Rebajar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.btn, styles.btnEliminar]}
                    onPress={() => eliminar(item.id)}
                  >
                    <Text style={styles.btnEliminarText}>Eliminar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    fontSize: 30,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 2,
  },
  newButton: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  newButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  errorBox: {
    marginHorizontal: 20,
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
  },
  errorText: {
    color: '#B91C1C',
    fontSize: 13,
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  sneakerMain: {
    flex: 1,
  },
  sneakerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  sneakerBrand: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 3,
  },
  stockBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  stockBadgeDisponible: {
    backgroundColor: '#E0F2FE',
  },
  stockBadgeAgotado: {
    backgroundColor: '#FEE2E2',
  },
  stockText: {
    fontSize: 12,
    fontWeight: '800',
  },
  stockTextDisponible: {
    color: '#0369A1',
  },
  stockTextAgotado: {
    color: '#B91C1C',
  },
  cardPriceRow: {
    marginVertical: 10,
  },
  price: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 12,
  },
  btn: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnStock: {
    backgroundColor: '#F1F5F9',
  },
  btnStockText: {
    color: '#334155',
    fontWeight: '600',
    fontSize: 12,
  },
  btnRebajar: {
    backgroundColor: '#FEF3C7',
  },
  btnRebajarText: {
    color: '#92400E',
    fontWeight: '600',
    fontSize: 12,
  },
  btnEliminar: {
    backgroundColor: '#FEE2E2',
    marginLeft: 'auto',
  },
  btnEliminarText: {
    color: '#B91C1C',
    fontWeight: '600',
    fontSize: 12,
  },
  center: {
    marginTop: 60,
  },
});
