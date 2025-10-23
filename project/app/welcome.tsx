import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
  Alert,
  FlatList,
  TextInput,
  Image,
} from 'react-native';
import { COLORS, FONTS, SIZES } from '@/utils/constants';
import { fetchSeamstresses, fetchFeaturedSeamstresses } from '@/services/api';
import SeamstressCard from '@/components/SeamstressCard';
import ServiceCard from '@/components/ServiceCard';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';

interface Seamstress {
  id: number;
  name: string;
  address: string;
  photo: string;
  rating: string;
  distance: string;
  services: string[];
  price: string;
}

export default function WelcomeScreen() {
  const { isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  const [seamstresses, setSeamstresses] = useState<Seamstress[]>([]);
  const [featuredSeamstresses, setFeaturedSeamstresses] = useState<Seamstress[]>([]);
  const [filteredSeamstresses, setFilteredSeamstresses] = useState<Seamstress[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [featuredLoading, setFeaturedLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const services = [
    { id: 1, title: 'Consertos', icon: '🔧', color: '#4A90E2' },
    { id: 2, title: 'Ajustes', icon: '📏', color: '#50E3C2' },
    { id: 3, title: 'Costura Personalizada', icon: '✨', color: '#F5A623' },
    { id: 4, title: 'Bordados', icon: '🌸', color: '#D63384' },
  ];

  useEffect(() => {
    // Load seamstresses when component mounts
    if (!isLoading) {
      loadSeamstresses();
      loadFeaturedSeamstresses();
    }
  }, [isLoading]);

  useEffect(() => {
    // Filter seamstresses based on search query
    if (searchQuery.trim() === '') {
      setFilteredSeamstresses(seamstresses);
    } else {
      const filtered = seamstresses.filter(seamstress => 
        seamstress.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        seamstress.services.some(service => 
          service.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      setFilteredSeamstresses(filtered);
    }
  }, [searchQuery, seamstresses]);
  const loadSeamstresses = async () => {
    try {
      const data = await fetchSeamstresses();
      setSeamstresses(data);
      setFilteredSeamstresses(data);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao carregar costureiras');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadFeaturedSeamstresses = async () => {
    try {
      const data = await fetchFeaturedSeamstresses();
      setFeaturedSeamstresses(data);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao carregar costureiras em destaque');
    } finally {
      setFeaturedLoading(false);
    }
  };
  const onRefresh = () => {
    setRefreshing(true);
    setFeaturedLoading(true);
    setSearchQuery('');
    loadSeamstresses();
    loadFeaturedSeamstresses();
  };

  const handleLogout = async () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Sair', 
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/login');
          }
        }
      ]
    );
  };

  const handleServicePress = (serviceTitle: string) => {
    setSearchQuery(serviceTitle);
  };
  const renderServiceItem = ({ item }: { item: any }) => (
    <ServiceCard
      title={item.title}
      icon={item.icon}
      color={item.color}
      onPress={() => handleServicePress(item.title)}
    />
  );

  const renderSeamstressItem = ({ item }: { item: Seamstress }) => (
    <SeamstressCard
      seamstress={item}
      onPress={() => router.push(`/seamstress-profile?seamstressId=${item.id}`)}
    />
  );

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#F5F5DC" />
        <Text style={styles.loadingText}>AteliêPerto</Text>
        <Text style={styles.loadingSubtext}>✂️ 🪡</Text>
      </View>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.locationContainer}>
          <Text style={styles.locationLabel}>SUA LOCALIZAÇÃO</Text>
          <View style={styles.locationRow}>
            <Text style={styles.locationText}>Timon, MA</Text>
            <Text style={styles.locationIcon}>📍</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.filterButton} onPress={handleLogout}>
          <Text style={styles.filterText}>Sair</Text>
          <Text style={styles.filterIcon}>🚪</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
          />
        }
      >
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar costureiras..."
              placeholderTextColor={COLORS.gray}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity 
                style={styles.clearButton}
                onPress={() => setSearchQuery('')}
              >
                <Text style={styles.clearIcon}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Featured Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Principais Costureiras</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Ver todas</Text>
            </TouchableOpacity>
          </View>
          
          {featuredLoading ? (
            <LoadingSkeleton />
          ) : (
            <FlatList
              data={featuredSeamstresses}
              renderItem={renderSeamstressItem}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.featuredList}
            />
          )}
        </View>

        {/* Services Grid */}
        <View style={styles.section}>
          <View style={{ paddingHorizontal: SIZES.padding }}>
            <Text style={styles.sectionTitle}>Nossos Serviços</Text>
          </View>
          <FlatList
            data={services}
            renderItem={renderServiceItem}
            numColumns={2}
            scrollEnabled={false}
            contentContainerStyle={styles.servicesGrid}
          />
        </View>

        {/* Seamstresses List */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {searchQuery ? `Resultados para "${searchQuery}"` : 'Costureiras Próximas'}
            </Text>
            {searchQuery && (
              <Text style={styles.resultCount}>
                {filteredSeamstresses.length} encontrada(s)
              </Text>
            )}
          </View>
          {loading ? (
            <LoadingSkeleton />
          ) : (
            filteredSeamstresses.length > 0 ? (
            <FlatList
              data={filteredSeamstresses}
              renderItem={renderSeamstressItem}
              scrollEnabled={false}
              contentContainerStyle={styles.seamstressList}
            />
            ) : (
              <View style={styles.noResultsContainer}>
                <Text style={styles.noResultsIcon}>🔍</Text>
                <Text style={styles.noResultsTitle}>Nenhuma costureira encontrada</Text>
                <Text style={styles.noResultsText}>
                  Tente buscar por outro nome ou serviço
                </Text>
                <TouchableOpacity 
                  style={styles.clearSearchButton}
                  onPress={() => setSearchQuery('')}
                >
                  <Text style={styles.clearSearchText}>Limpar busca</Text>
                </TouchableOpacity>
              </View>
            )
          )}
        </View>

        {/* Promotional Banner */}
        <View style={styles.promoBanner}>
          <View style={styles.promoContent}>
            <Text style={styles.promoIcon}>🎉</Text>
            <Text style={styles.promoTitle}>Desconto no 1º Serviço!</Text>
            <Text style={styles.promoSubtitle}>
              Agende seu primeiro serviço e ganhe 20% de desconto
            </Text>
            <TouchableOpacity style={styles.promoButton}>
              <Text style={styles.promoButtonText}>AGENDAR AGORA</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5DC',
  },
  loadingText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
    fontFamily: FONTS.bold,
    marginBottom: 10,
  },
  loadingSubtext: {
    fontSize: 24,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.padding,
    paddingTop: 50,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  locationContainer: {
    flex: 1,
  },
  locationLabel: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: FONTS.medium,
    opacity: 0.8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  locationText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: FONTS.bold,
  },
  locationIcon: {
    marginLeft: 8,
    fontSize: 16,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: FONTS.bold,
    marginRight: 5,
  },
  filterIcon: {
    fontSize: 14,
  },
  content: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: SIZES.padding,
    marginTop: 10 ,
    marginBottom: 20,
  },
  searchBar: {
    backgroundColor: COLORS.white,
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: COLORS.gray,
    fontSize: 16,
    fontFamily: FONTS.regular,
  },
  clearButton: {
    padding: 5,
  },
  clearIcon: {
    fontSize: 16,
    color: COLORS.gray,
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.dark,
    fontFamily: FONTS.bold,
  },
  seeAllText: {
    color: COLORS.primary,
    fontSize: 16,
    fontFamily: FONTS.medium,
  },
  resultCount: {
    color: COLORS.gray,
    fontSize: 14,
    fontFamily: FONTS.regular,
  },
  featuredList: {
    paddingHorizontal: SIZES.padding,
  },
  servicesGrid: {
    paddingHorizontal: SIZES.padding,
  },
  seamstressList: {
    paddingHorizontal: SIZES.padding,
  },
  noResultsContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: SIZES.padding,
  },
  noResultsIcon: {
    fontSize: 48,
    marginBottom: 15,
  },
  noResultsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.dark,
    fontFamily: FONTS.bold,
    marginBottom: 8,
  },
  noResultsText: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: 'center',
    fontFamily: FONTS.regular,
    marginBottom: 20,
  },
  clearSearchButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  clearSearchText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: FONTS.bold,
  },
  promoBanner: {
    backgroundColor: '#FFF8DC',
    marginHorizontal: SIZES.padding,
    marginBottom: 20,
    borderRadius: 15,
    padding: 25,
    borderLeftWidth: 5,
    borderLeftColor: COLORS.primary,
  },
  promoContent: {
    alignItems: 'center',
  },
  promoIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  promoTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.dark,
    fontFamily: FONTS.bold,
    marginBottom: 8,
  },
  promoSubtitle: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: 'center',
    fontFamily: FONTS.regular,
    marginBottom: 20,
    lineHeight: 20,
  },
  promoButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  promoButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: FONTS.bold,
  },
});