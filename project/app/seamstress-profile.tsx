import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Animated,
  Dimensions,
  Platform,
  Image,
  Linking,
  Alert,
  Share,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { COLORS, FONTS, SIZES } from '@/utils/constants';
import { fetchSeamstressProfile } from '@/services/api';
import LoadingSkeleton from '@/components/LoadingSkeleton';

const { width, height } = Dimensions.get('window');

interface SeamstressProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  photo: any;
  bio: string;
  rating: string;
  reviewCount: number;
  experience: number;
  services: Array<{
    name: string;
    priceRange: string;
  }>;
  workingHours: string;
  status: string;
  specialization: string;
  education: string;
  reviews: Array<{
    id: number;
    customerName: string;
    rating: number;
    comment: string;
    date: string;
  }>;
  portfolioImages: string[];
  distance: string;
}

export default function SeamstressProfileScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const seamstressId = params.seamstressId as string;
  
  const [profile, setProfile] = useState<SeamstressProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadProfile();
  }, [seamstressId]);

  const loadProfile = async () => {
    try {
      const data = await fetchSeamstressProfile(seamstressId);
      setProfile(data);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao carregar perfil da costureira');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  };

  const handleShare = async () => {
    if (!profile) return;
    
    try {
      await Share.share({
        message: `Confira o perfil de ${profile.name} no AteliêPerto! Especialista em costura com ${profile.rating} estrelas.`,
        title: `Perfil de ${profile.name}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleContact = (type: 'whatsapp' | 'call' | 'email') => {
    if (!profile) return;
    
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    switch (type) {
      case 'whatsapp':
        const whatsappMessage = `Olá ${profile.name}! Vi seu perfil no AteliêPerto e gostaria de contratar seus serviços.`;
        const whatsappUrl = `whatsapp://send?phone=55${profile.phone.replace(/\D/g, '')}&text=${encodeURIComponent(whatsappMessage)}`;
        Linking.openURL(whatsappUrl).catch(() => {
          Alert.alert('Erro', 'WhatsApp não está instalado');
        });
        break;
      case 'call':
        Linking.openURL(`tel:${profile.phone}`);
        break;
      case 'email':
        Linking.openURL(`mailto:${profile.email}?subject=Contato via AteliêPerto`);
        break;
    }
  };

  const handleHire = () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    handleContact('whatsapp');
  };

  const toggleFavorite = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setIsFavorite(!isFavorite);
  };

  const handleOpenMaps = () => {
    if (!profile) return;
    const url = Platform.select({
      ios: `maps://app?q=${encodeURIComponent(profile.address)}`,
      android: `geo:0,0?q=${encodeURIComponent(profile.address)}`,
      default: `https://maps.google.com/maps?q=${encodeURIComponent(profile.address)}`,
    });
    Linking.openURL(url);
  };

  // Header animation based on scroll
  useEffect(() => {
    const listener = scrollY.addListener(({ value }) => {
      const opacity = Math.min(value / 200, 1);
      headerOpacity.setValue(opacity);
    });

    return () => scrollY.removeListener(listener);
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
        <LoadingSkeleton />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Perfil não encontrado</Text>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      
      {/* Animated Header */}
      <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
        <TouchableOpacity style={styles.headerButton} onPress={handleBack}>
          <Text style={styles.headerButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {profile.name}
        </Text>
        <TouchableOpacity style={styles.headerButton} onPress={handleShare}>
          <Text style={styles.headerButtonText}>↗</Text>
        </TouchableOpacity>
      </Animated.View>

      <Animated.ScrollView
        style={styles.scrollView}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <TouchableOpacity style={styles.backButtonFloat} onPress={handleBack}>
            <Text style={styles.backButtonFloatText}>←</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.shareButtonFloat} onPress={handleShare}>
            <Text style={styles.shareButtonFloatText}>↗</Text>
          </TouchableOpacity>

          <View style={styles.profileImageContainer}>
            <Image source={profile.photo} style={styles.profileImage} />
            <View style={[styles.statusIndicator, { 
              backgroundColor: profile.status === 'Disponível' ? COLORS.success : COLORS.warning 
            }]} />
          </View>

          <Text style={styles.profileName}>{profile.name}</Text>
          <Text style={styles.specialization}>{profile.specialization}</Text>
          
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingStars}>⭐⭐⭐⭐⭐</Text>
            <Text style={styles.ratingText}>
              {profile.rating} ({profile.reviewCount} avaliações)
            </Text>
          </View>

          <View style={styles.locationContainer}>
            <Text style={styles.locationIcon}>📍</Text>
            <Text style={styles.locationText}>{profile.address}</Text>
          </View>

          <View style={styles.statusContainer}>
            <View style={[styles.statusDot, { 
              backgroundColor: profile.status === 'Disponível' ? COLORS.success : COLORS.warning 
            }]} />
            <Text style={styles.statusText}>{profile.status}</Text>
          </View>
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações de Contato</Text>
          
          <TouchableOpacity style={styles.contactItem} onPress={() => handleContact('whatsapp')}>
            <Text style={styles.contactIcon}>📱</Text>
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>WhatsApp</Text>
              <Text style={styles.contactValue}>{profile.phone}</Text>
            </View>
            <Text style={styles.contactArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactItem} onPress={() => handleContact('email')}>
            <Text style={styles.contactIcon}>✉️</Text>
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>E-mail</Text>
              <Text style={styles.contactValue}>{profile.email}</Text>
            </View>
            <Text style={styles.contactArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactItem} onPress={handleOpenMaps}>
            <Text style={styles.contactIcon}>📍</Text>
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>Endereço</Text>
              <Text style={styles.contactValue}>{profile.address}</Text>
            </View>
            <Text style={styles.contactArrow}>→</Text>
          </TouchableOpacity>

          <View style={styles.contactItem}>
            <Text style={styles.contactIcon}>🕒</Text>
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>Horário</Text>
              <Text style={styles.contactValue}>{profile.workingHours}</Text>
            </View>
          </View>
        </View>

        {/* Services & Pricing */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Serviços e Preços</Text>
          
          <View style={styles.servicesGrid}>
            {profile.services.map((service, index) => (
              <View key={index} style={styles.serviceCard}>
                <Text style={styles.serviceName}>{service.name}</Text>
                <Text style={styles.servicePrice}>{service.priceRange}</Text>
              </View>
            ))}
          </View>
          
          <Text style={styles.priceNote}>
            * Preços podem variar conforme complexidade
          </Text>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sobre</Text>
          <Text style={styles.aboutText}>{profile.bio}</Text>
          
          <View style={styles.aboutDetails}>
            <View style={styles.aboutItem}>
              <Text style={styles.aboutLabel}>Experiência:</Text>
              <Text style={styles.aboutValue}>{profile.experience} anos</Text>
            </View>
            <View style={styles.aboutItem}>
              <Text style={styles.aboutLabel}>Formação:</Text>
              <Text style={styles.aboutValue}>{profile.education}</Text>
            </View>
          </View>
        </View>

        {/* Reviews Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Avaliações ({profile.reviewCount})
            </Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Ver todas</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.overallRating}>
            <Text style={styles.overallRatingNumber}>{profile.rating}</Text>
            <View style={styles.overallRatingStars}>
              <Text style={styles.ratingStarsLarge}>⭐⭐⭐⭐⭐</Text>
              <Text style={styles.overallRatingText}>
                Baseado em {profile.reviewCount} avaliações
              </Text>
            </View>
          </View>

          {profile.reviews.slice(0, 3).map((review) => (
            <View key={review.id} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <View style={styles.reviewerInfo}>
                  <View style={styles.reviewerAvatar}>
                    <Text style={styles.reviewerInitial}>
                      {review.customerName.charAt(0)}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.reviewerName}>{review.customerName}</Text>
                    <Text style={styles.reviewDate}>{review.date}</Text>
                  </View>
                </View>
                <View style={styles.reviewRating}>
                  <Text style={styles.reviewStars}>
                    {'⭐'.repeat(review.rating)}
                  </Text>
                </View>
              </View>
              <Text style={styles.reviewComment}>{review.comment}</Text>
            </View>
          ))}
        </View>

        {/* Portfolio Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Trabalhos Realizados</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Ver mais</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.portfolioGrid}>
            {profile.portfolioImages.slice(0, 4).map((image, index) => (
              <TouchableOpacity key={index} style={styles.portfolioItem}>
                <View style={styles.portfolioPlaceholder}>
                  <Text style={styles.portfolioIcon}>🧵</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Location Map */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Localização</Text>
          
          <TouchableOpacity style={styles.mapContainer} onPress={handleOpenMaps}>
            <View style={styles.mapPlaceholder}>
              <Text style={styles.mapIcon}>🗺️</Text>
              <Text style={styles.mapText}>Toque para abrir no Maps</Text>
            </View>
          </TouchableOpacity>
          
          <Text style={styles.distanceText}>
            📍 {profile.distance} de você
          </Text>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </Animated.ScrollView>

      {/* Fixed Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={styles.primaryButton} 
          onPress={handleHire}
        >
          <Text style={styles.primaryButtonText}>CONTRATAR AGORA</Text>
        </TouchableOpacity>
        
        <View style={styles.secondaryButtons}>
          <TouchableOpacity 
            style={styles.whatsappButton} 
            onPress={() => handleContact('whatsapp')}
          >
            <Text style={styles.whatsappButtonText}>WhatsApp</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.callButton} 
            onPress={() => handleContact('call')}
          >
            <Text style={styles.callButtonText}>Ligar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.favoriteButton} 
            onPress={toggleFavorite}
          >
            <Text style={styles.favoriteIcon}>
              {isFavorite ? '❤️' : '🤍'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Background Pattern */}
      <View style={styles.backgroundPattern}>
        <Text style={styles.patternText}>🧵</Text>
        <Text style={styles.patternText}>✂️</Text>
        <Text style={styles.patternText}>🪡</Text>
        <Text style={styles.patternText}>🧵</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 90,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.padding,
    paddingBottom: 15,
    zIndex: 1000,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerButtonText: {
    fontSize: 18,
    color: COLORS.dark,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.dark,
    textAlign: 'center',
    marginHorizontal: 15,
    fontFamily: FONTS.bold,
  },
  scrollView: {
    flex: 1,
  },
  heroSection: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: SIZES.padding,
    paddingBottom: 30,
    backgroundColor: COLORS.white,
  },
  backButtonFloat: {
    position: 'absolute',
    top: 50,
    left: SIZES.padding,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButtonFloatText: {
    fontSize: 18,
    color: COLORS.dark,
  },
  shareButtonFloat: {
    position: 'absolute',
    top: 50,
    right: SIZES.padding,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  shareButtonFloatText: {
    fontSize: 18,
    color: COLORS.dark,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: COLORS.primary,
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: COLORS.white,
  },
  profileName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.dark,
    textAlign: 'center',
    marginBottom: 5,
    fontFamily: FONTS.bold,
  },
  specialization: {
    fontSize: 16,
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 15,
    fontFamily: FONTS.medium,
  },
  ratingContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  ratingStars: {
    fontSize: 20,
    marginBottom: 5,
  },
  ratingText: {
    fontSize: 14,
    color: COLORS.gray,
    fontFamily: FONTS.regular,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  locationIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  locationText: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: 'center',
    fontFamily: FONTS.regular,
    flex: 1,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    color: COLORS.gray,
    fontFamily: FONTS.medium,
  },
  section: {
    paddingHorizontal: SIZES.padding,
    paddingVertical: 25,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: 20,
    fontFamily: FONTS.bold,
  },
  seeAllText: {
    fontSize: 14,
    color: COLORS.primary,
    fontFamily: FONTS.medium,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  contactIcon: {
    fontSize: 20,
    marginRight: 15,
    width: 30,
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 14,
    color: COLORS.gray,
    fontFamily: FONTS.regular,
  },
  contactValue: {
    fontSize: 16,
    color: COLORS.dark,
    fontFamily: FONTS.medium,
    marginTop: 2,
  },
  contactArrow: {
    fontSize: 16,
    color: COLORS.gray,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -5,
  },
  serviceCard: {
    width: (width - 60) / 2,
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    padding: 15,
    margin: 5,
    alignItems: 'center',
  },
  serviceName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.dark,
    textAlign: 'center',
    marginBottom: 5,
    fontFamily: FONTS.bold,
  },
  servicePrice: {
    fontSize: 12,
    color: COLORS.primary,
    fontFamily: FONTS.medium,
  },
  priceNote: {
    fontSize: 12,
    color: COLORS.gray,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 15,
    fontFamily: FONTS.regular,
  },
  aboutText: {
    fontSize: 16,
    color: COLORS.dark,
    lineHeight: 24,
    marginBottom: 20,
    fontFamily: FONTS.regular,
  },
  aboutDetails: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    padding: 15,
  },
  aboutItem: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  aboutLabel: {
    fontSize: 14,
    color: COLORS.gray,
    fontFamily: FONTS.medium,
    width: 100,
  },
  aboutValue: {
    fontSize: 14,
    color: COLORS.dark,
    fontFamily: FONTS.regular,
    flex: 1,
  },
  overallRating: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  overallRatingNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginRight: 20,
    fontFamily: FONTS.bold,
  },
  overallRatingStars: {
    flex: 1,
  },
  ratingStarsLarge: {
    fontSize: 20,
    marginBottom: 5,
  },
  overallRatingText: {
    fontSize: 14,
    color: COLORS.gray,
    fontFamily: FONTS.regular,
  },
  reviewCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  reviewerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  reviewerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  reviewerInitial: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
    fontFamily: FONTS.bold,
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.dark,
    fontFamily: FONTS.bold,
  },
  reviewDate: {
    fontSize: 12,
    color: COLORS.gray,
    fontFamily: FONTS.regular,
  },
  reviewRating: {
    alignItems: 'flex-end',
  },
  reviewStars: {
    fontSize: 14,
  },
  reviewComment: {
    fontSize: 14,
    color: COLORS.dark,
    lineHeight: 20,
    fontFamily: FONTS.regular,
  },
  portfolioGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -5,
  },
  portfolioItem: {
    width: (width - 50) / 2,
    height: 120,
    margin: 5,
  },
  portfolioPlaceholder: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  portfolioIcon: {
    fontSize: 32,
  },
  mapContainer: {
    height: 150,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 10,
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  mapText: {
    fontSize: 14,
    color: COLORS.gray,
    fontFamily: FONTS.medium,
  },
  distanceText: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: 'center',
    fontFamily: FONTS.regular,
  },
  bottomSpacing: {
    height: 120,
  },
  actionButtons: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    paddingHorizontal: SIZES.padding,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: FONTS.bold,
  },
  secondaryButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  whatsappButton: {
    backgroundColor: '#25D366',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flex: 1,
    marginRight: 5,
    alignItems: 'center',
  },
  whatsappButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: FONTS.bold,
  },
  callButton: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  callButtonText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: FONTS.bold,
  },
  favoriteButton: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginLeft: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteIcon: {
    fontSize: 18,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
  },
  errorText: {
    fontSize: 18,
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: FONTS.regular,
  },
  backButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  backButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: FONTS.bold,
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    flexWrap: 'wrap',
    opacity: 0.02,
    zIndex: -1,
  },
  patternText: {
    fontSize: 40,
    margin: 30,
    color: COLORS.primary,
  },
});