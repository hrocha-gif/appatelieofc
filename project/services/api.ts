interface User {
  id: number;
  firstName: string;
  lastName: string;
  address: {
    address: string;
    city: string;
  };
  image: string;
}

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

const sewingServices = [
  'Consertos', 'Ajustes', 'Costura Personalizada', 'Bordados',
  'Barra de Calça', 'Zurcir Roupa', 'Customização', 'Reforma'
];

// Perfis únicos para cada costureira
const uniqueSeamstressProfiles = [
  {
    id: 1,
    name: 'Maria Silva Santos',
    specialization: 'Especialista em Vestidos de Festa',
    bio: 'Com mais de 15 anos de experiência, sou especializada em vestidos de festa, noiva e formatura. Cada peça é única e feita com muito carinho e atenção aos detalhes. Trabalho com tecidos nobres e sempre busco realizar o sonho das minhas clientes.',
    experience: 15,
    education: 'Formada em Design de Moda - Universidade Anhembi Morumbi',
    rating: '4.9',
    reviewCount: 187,
    status: 'Disponível',
    workingHours: 'Segunda a Sexta: 9h às 19h, Sábado: 9h às 15h',
    phone: '(85) 99876-5432',
    email: 'maria.silva@atelieperto.com',
    services: [
      { name: 'Vestidos de Festa', priceRange: 'R$ 200 - R$ 800' },
      { name: 'Vestidos de Noiva', priceRange: 'R$ 500 - R$ 2000' },
      { name: 'Ajustes Finos', priceRange: 'R$ 50 - R$ 150' },
      { name: 'Bordados à Mão', priceRange: 'R$ 80 - R$ 300' }
    ],
    mainServices: ['Vestidos de Festa', 'Bordados', 'Ajustes'],
    price: 'R$ 80/hora'
  },
  {
    id: 2,
    name: 'Ana Paula Oliveira',
    specialization: 'Expert em Roupas Masculinas',
    bio: 'Especialista em alfaiataria masculina com técnicas tradicionais e modernas. Trabalho com ternos sob medida, camisas sociais e ajustes de alta precisão. Meu objetivo é fazer cada homem se sentir elegante e confiante.',
    experience: 12,
    education: 'Curso Técnico em Alfaiataria - SENAI',
    rating: '4.8',
    reviewCount: 156,
    status: 'Ocupada',
    workingHours: 'Segunda a Sexta: 8h às 18h, Sábado: 8h às 12h',
    phone: '(85) 99765-4321',
    email: 'ana.oliveira@atelieperto.com',
    services: [
      { name: 'Ternos Sob Medida', priceRange: 'R$ 400 - R$ 1200' },
      { name: 'Camisas Sociais', priceRange: 'R$ 80 - R$ 200' },
      { name: 'Ajustes de Calça', priceRange: 'R$ 25 - R$ 60' },
      { name: 'Consertos Gerais', priceRange: 'R$ 20 - R$ 80' }
    ],
    mainServices: ['Alfaiataria', 'Ajustes', 'Consertos'],
    price: 'R$ 65/hora'
  },
  {
    id: 3,
    name: 'Carla Mendes Costa',
    specialization: 'Costureira Criativa e Sustentável',
    bio: 'Apaixonada por moda sustentável e upcycling. Transformo peças antigas em criações modernas e únicas. Especialista em customização, reforma de roupas e criação de peças exclusivas com materiais reaproveitados.',
    experience: 8,
    education: 'Formada em Moda Sustentável - Instituto Europeu de Design',
    rating: '4.7',
    reviewCount: 134,
    status: 'Disponível',
    workingHours: 'Terça a Sábado: 10h às 18h',
    phone: '(85) 99654-3210',
    email: 'carla.mendes@atelieperto.com',
    services: [
      { name: 'Customização', priceRange: 'R$ 60 - R$ 200' },
      { name: 'Upcycling', priceRange: 'R$ 80 - R$ 250' },
      { name: 'Peças Exclusivas', priceRange: 'R$ 150 - R$ 500' },
      { name: 'Reforma de Roupas', priceRange: 'R$ 40 - R$ 120' }
    ],
    mainServices: ['Customização', 'Costura Personalizada', 'Reforma'],
    price: 'R$ 55/hora'
  },
  {
    id: 4,
    name: 'Lucia Ferreira Lima',
    specialization: 'Mestre em Bordados Tradicionais',
    bio: 'Preservo a arte tradicional do bordado nordestino há mais de 20 anos. Especializada em bordados à mão, richelieu, ponto cruz e crivo. Cada peça é uma obra de arte única que conta uma história através dos fios.',
    experience: 22,
    education: 'Mestre Artesã - Certificação SEBRAE',
    rating: '5.0',
    reviewCount: 203,
    status: 'Disponível',
    workingHours: 'Segunda a Sexta: 7h às 17h',
    phone: '(85) 99543-2109',
    email: 'lucia.ferreira@atelieperto.com',
    services: [
      { name: 'Bordados Tradicionais', priceRange: 'R$ 100 - R$ 400' },
      { name: 'Richelieu', priceRange: 'R$ 120 - R$ 350' },
      { name: 'Ponto Cruz', priceRange: 'R$ 50 - R$ 200' },
      { name: 'Crivo Cearense', priceRange: 'R$ 80 - R$ 300' }
    ],
    mainServices: ['Bordados', 'Costura Personalizada', 'Ajustes'],
    price: 'R$ 70/hora'
  },
  {
    id: 5,
    name: 'Fernanda Santos Rocha',
    specialization: 'Especialista em Moda Infantil',
    bio: 'Dedico meu trabalho à moda infantil com muito amor e cuidado. Crio roupinhas únicas para bebês e crianças, sempre priorizando o conforto e a segurança. Trabalho com tecidos hipoalergênicos e designs encantadores.',
    experience: 10,
    education: 'Especialização em Moda Infantil - Faculdade Santa Marcelina',
    rating: '4.9',
    reviewCount: 167,
    status: 'Disponível',
    workingHours: 'Segunda a Sexta: 8h às 16h',
    phone: '(85) 99432-1098',
    email: 'fernanda.santos@atelieperto.com',
    services: [
      { name: 'Roupas de Bebê', priceRange: 'R$ 40 - R$ 120' },
      { name: 'Moda Infantil', priceRange: 'R$ 50 - R$ 150' },
      { name: 'Fantasias', priceRange: 'R$ 80 - R$ 200' },
      { name: 'Ajustes Infantis', priceRange: 'R$ 20 - R$ 50' }
    ],
    mainServices: ['Costura Personalizada', 'Ajustes', 'Consertos'],
    price: 'R$ 50/hora'
  },
  {
    id: 6,
    name: 'Beatriz Almeida Souza',
    specialization: 'Costureira de Alta Costura',
    bio: 'Formada em Paris, trago técnicas de alta costura francesa para o Brasil. Especializada em peças exclusivas, roupas de gala e trabalhos de alta complexidade. Cada criação é uma obra de arte única e sofisticada.',
    experience: 18,
    education: 'École de la Chambre Syndicale de la Couture Parisienne',
    rating: '4.9',
    reviewCount: 89,
    status: 'Ocupada',
    workingHours: 'Segunda a Quinta: 10h às 19h, Sexta: 10h às 16h',
    phone: '(85) 99321-0987',
    email: 'beatriz.almeida@atelieperto.com',
    services: [
      { name: 'Alta Costura', priceRange: 'R$ 800 - R$ 3000' },
      { name: 'Roupas de Gala', priceRange: 'R$ 500 - R$ 2000' },
      { name: 'Peças Exclusivas', priceRange: 'R$ 400 - R$ 1500' },
      { name: 'Consultoria de Estilo', priceRange: 'R$ 200 - R$ 500' }
    ],
    mainServices: ['Costura Personalizada', 'Ajustes', 'Bordados'],
    price: 'R$ 120/hora'
  },
  {
    id: 7,
    name: 'Rosa Maria Pereira',
    specialization: 'Especialista em Consertos',
    bio: 'Com 25 anos de experiência, sou conhecida por dar nova vida às roupas. Especialista em consertos impossíveis, zurcidura invisível e restauração de peças vintage. Nenhum desafio é grande demais para mim!',
    experience: 25,
    education: 'Curso Técnico em Costura Industrial - SENAC',
    rating: '4.8',
    reviewCount: 298,
    status: 'Disponível',
    workingHours: 'Segunda a Sábado: 7h às 18h',
    phone: '(85) 99210-9876',
    email: 'rosa.pereira@atelieperto.com',
    services: [
      { name: 'Consertos Complexos', priceRange: 'R$ 30 - R$ 100' },
      { name: 'Zurcidura Invisível', priceRange: 'R$ 40 - R$ 80' },
      { name: 'Restauração Vintage', priceRange: 'R$ 60 - R$ 200' },
      { name: 'Ajustes Gerais', priceRange: 'R$ 20 - R$ 60' }
    ],
    mainServices: ['Consertos', 'Ajustes', 'Costura Personalizada'],
    price: 'R$ 45/hora'
  },
  {
    id: 8,
    name: 'Juliana Costa Martins',
    specialization: 'Moda Fitness e Esportiva',
    bio: 'Especializada em roupas fitness e esportivas sob medida. Trabalho com tecidos tecnológicos e modelagem anatômica para garantir máximo conforto e performance. Ideal para atletas e praticantes de atividades físicas.',
    experience: 7,
    education: 'Especialização em Moda Esportiva - Universidade Anhanguera',
    rating: '4.7',
    reviewCount: 112,
    status: 'Disponível',
    workingHours: 'Segunda a Sexta: 6h às 14h, Sábado: 8h às 12h',
    phone: '(85) 99109-8765',
    email: 'juliana.martins@atelieperto.com',
    services: [
      { name: 'Roupas Fitness', priceRange: 'R$ 80 - R$ 200' },
      { name: 'Uniformes Esportivos', priceRange: 'R$ 60 - R$ 150' },
      { name: 'Ajustes Esportivos', priceRange: 'R$ 30 - R$ 80' },
      { name: 'Peças Técnicas', priceRange: 'R$ 100 - R$ 300' }
    ],
    mainServices: ['Costura Personalizada', 'Ajustes', 'Consertos'],
    price: 'R$ 60/hora'
  },
  {
    id: 9,
    name: 'Isabel Rodrigues Silva',
    specialization: 'Costureira de Uniformes',
    bio: 'Especialista em uniformes profissionais, escolares e corporativos. Trabalho com grandes volumes mantendo sempre a qualidade e os prazos. Atendo desde pequenas empresas até grandes corporações.',
    experience: 14,
    education: 'Curso Técnico em Produção de Vestuário - SENAI',
    rating: '4.6',
    reviewCount: 245,
    status: 'Ocupada',
    workingHours: 'Segunda a Sexta: 7h às 17h',
    phone: '(85) 99098-7654',
    email: 'isabel.rodrigues@atelieperto.com',
    services: [
      { name: 'Uniformes Profissionais', priceRange: 'R$ 50 - R$ 120' },
      { name: 'Uniformes Escolares', priceRange: 'R$ 40 - R$ 80' },
      { name: 'Uniformes Corporativos', priceRange: 'R$ 60 - R$ 150' },
      { name: 'Bordados em Uniformes', priceRange: 'R$ 15 - R$ 40' }
    ],
    mainServices: ['Costura Personalizada', 'Bordados', 'Ajustes'],
    price: 'R$ 55/hora'
  },
  {
    id: 10,
    name: 'Patricia Gomes Nascimento',
    specialization: 'Especialista em Lingerie',
    bio: 'Trabalho exclusivamente com lingerie sob medida há 9 anos. Especializada em modelagem anatômica, tecidos delicados e acabamentos refinados. Cada peça é pensada para valorizar e proporcionar conforto único.',
    experience: 9,
    education: 'Curso de Modelagem de Lingerie - Instituto Zuzu Angel',
    rating: '4.8',
    reviewCount: 156,
    status: 'Disponível',
    workingHours: 'Terça a Sexta: 9h às 18h, Sábado: 9h às 13h',
    phone: '(85) 98987-6543',
    email: 'patricia.gomes@atelieperto.com',
    services: [
      { name: 'Lingerie Sob Medida', priceRange: 'R$ 80 - R$ 250' },
      { name: 'Sutiãs Especiais', priceRange: 'R$ 60 - R$ 180' },
      { name: 'Pijamas Personalizados', priceRange: 'R$ 100 - R$ 200' },
      { name: 'Ajustes de Lingerie', priceRange: 'R$ 25 - R$ 60' }
    ],
    mainServices: ['Costura Personalizada', 'Ajustes', 'Consertos'],
    price: 'R$ 65/hora'
  }
];

// Reviews únicos para cada costureira
const uniqueReviews = {
  1: [
    { customerName: 'Amanda Silva', rating: 5, comment: 'Maria fez meu vestido de formatura e ficou simplesmente perfeito! Atenção aos detalhes impecável.', date: '2 semanas atrás' },
    { customerName: 'Bruna Costa', rating: 5, comment: 'Profissional excepcional! Meu vestido de madrinha ficou um sonho. Super recomendo!', date: '1 mês atrás' },
    { customerName: 'Camila Santos', rating: 4, comment: 'Trabalho de alta qualidade, prazo cumprido. Muito satisfeita com o resultado.', date: '2 meses atrás' }
  ],
  2: [
    { customerName: 'Roberto Lima', rating: 5, comment: 'Ana é uma verdadeira artista da alfaiataria! Meu terno ficou perfeito, caimento impecável.', date: '1 semana atrás' },
    { customerName: 'Carlos Mendes', rating: 5, comment: 'Excelente profissional! Ajustou várias camisas sociais com precisão cirúrgica.', date: '3 semanas atrás' },
    { customerName: 'João Pedro', rating: 4, comment: 'Muito competente e pontual. Recomendo para quem busca qualidade em alfaiataria.', date: '1 mês atrás' }
  ],
  3: [
    { customerName: 'Marina Oliveira', rating: 5, comment: 'Carla transformou minha jaqueta antiga numa peça moderna e única! Criatividade sem limites.', date: '10 dias atrás' },
    { customerName: 'Leticia Rocha', rating: 4, comment: 'Adorei o conceito sustentável! Ela deu nova vida às minhas roupas antigas.', date: '3 semanas atrás' },
    { customerName: 'Gabriela Alves', rating: 5, comment: 'Trabalho incrível de customização! Superou todas as minhas expectativas.', date: '1 mês atrás' }
  ],
  4: [
    { customerName: 'Dona Francisca', rating: 5, comment: 'Lucia é uma verdadeira mestra! Seus bordados são obras de arte. Tradição preservada com excelência.', date: '5 dias atrás' },
    { customerName: 'Maria José', rating: 5, comment: 'Bordado richelieu perfeito! Trabalho artesanal de altíssima qualidade.', date: '2 semanas atrás' },
    { customerName: 'Ana Beatriz', rating: 5, comment: 'Cada ponto é feito com amor e perfeição. Recomendo de olhos fechados!', date: '1 mês atrás' }
  ],
  5: [
    { customerName: 'Juliana Mãe', rating: 5, comment: 'Fernanda fez o enxoval do meu bebê com tanto carinho! Peças lindas e super confortáveis.', date: '1 semana atrás' },
    { customerName: 'Priscila Santos', rating: 5, comment: 'Roupinhas da minha filha ficaram um amor! Tecidos de qualidade e acabamento perfeito.', date: '2 semanas atrás' },
    { customerName: 'Renata Lima', rating: 4, comment: 'Excelente trabalho com moda infantil. Meus filhos adoraram as roupas novas!', date: '1 mês atrás' }
  ],
  6: [
    { customerName: 'Elegante Cliente', rating: 5, comment: 'Beatriz é simplesmente excepcional! Técnica francesa impecável, resultado de alta costura.', date: '3 semanas atrás' },
    { customerName: 'Sofisticada Dama', rating: 5, comment: 'Peça exclusiva de gala ficou perfeita! Qualidade internacional aqui no Brasil.', date: '1 mês atrás' },
    { customerName: 'Cliente VIP', rating: 4, comment: 'Trabalho refinado e sofisticado. Vale cada centavo investido.', date: '2 meses atrás' }
  ],
  7: [
    { customerName: 'Antônio Silva', rating: 5, comment: 'Rosa salvou minha camisa favorita! Conserto invisível, parece nova. Profissional incrível!', date: '4 dias atrás' },
    { customerName: 'Marcos Pereira', rating: 5, comment: 'Zurcidura perfeita! Nem parece que a roupa estava rasgada. Recomendo muito!', date: '1 semana atrás' },
    { customerName: 'José Carlos', rating: 4, comment: 'Excelente para consertos difíceis. Rosa tem mãos de fada!', date: '2 semanas atrás' }
  ],
  8: [
    { customerName: 'Atleta Pro', rating: 5, comment: 'Juliana entende de moda fitness! Roupas sob medida com caimento perfeito para treino.', date: '1 semana atrás' },
    { customerName: 'Personal Trainer', rating: 4, comment: 'Uniformes esportivos de qualidade! Tecido tecnológico e modelagem anatômica.', date: '2 semanas atrás' },
    { customerName: 'Corredor Amador', rating: 5, comment: 'Roupas fitness personalizadas ficaram ótimas! Conforto e performance garantidos.', date: '3 semanas atrás' }
  ],
  9: [
    { customerName: 'Empresa ABC', rating: 4, comment: 'Isabel entregou todos os uniformes no prazo! Qualidade consistente em grande volume.', date: '2 semanas atrás' },
    { customerName: 'Escola Municipal', rating: 5, comment: 'Uniformes escolares de excelente qualidade! Crianças ficaram lindas.', date: '1 mês atrás' },
    { customerName: 'Corporação XYZ', rating: 4, comment: 'Profissional confiável para uniformes corporativos. Recomendamos!', date: '1 mês atrás' }
  ],
  10: [
    { customerName: 'Cliente Especial', rating: 5, comment: 'Patricia fez lingerie sob medida perfeita! Conforto e elegância em cada peça.', date: '1 semana atrás' },
    { customerName: 'Noiva Feliz', rating: 5, comment: 'Lingerie para lua de mel ficou um sonho! Trabalho delicado e refinado.', date: '3 semanas atrás' },
    { customerName: 'Cliente Satisfeita', rating: 4, comment: 'Sutiãs sob medida com caimento perfeito! Finalmente encontrei meu tamanho ideal.', date: '1 mês atrás' }
  ]
};
const profilePhotos = [
  require('../assets/images/images.jpg'),
  require('../assets/images/af46976b1f4c3d26d7f43d6a5ff484e4.jpg'),
  require('../assets/images/menina-dos-desenhos-animados-com-máquina-de-costura-28443834.webp'),
  require('../assets/images/istockphoto-165673529-612x612.jpg'),
  require('../assets/images/png-transparent-sewing-illustration-cartoon-woman-cartoon-character-reading-people.png'),
];
const getRandomServices = (): string[] => {
  const shuffled = [...sewingServices].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.floor(Math.random() * 3) + 2);
};

const generateRating = (): string => {
  return (Math.random() * (5.0 - 4.0) + 4.0).toFixed(1);
};

const generateDistance = (): string => {
  return `${Math.floor(Math.random() * 25 + 5)}min`;
};

const generatePrice = (): string => {
  return `R$ ${Math.floor(Math.random() * 40 + 30)}/hora`;
};

export const fetchSeamstresses = async (): Promise<Seamstress[]> => {
  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Use os perfis únicos criados
    const seamstresses: Seamstress[] = uniqueSeamstressProfiles.map((profile, index) => ({
      id: profile.id,
      name: profile.name,
      address: `Rua das Flores, ${100 + index * 50} - Centro, Timon - MA`,
      photo: profilePhotos[index % profilePhotos.length],
      rating: profile.rating,
      distance: generateDistance(),
      services: profile.mainServices,
      price: profile.price,
    }));

    return seamstresses;
  } catch (error) {
    console.error('Error fetching seamstresses:', error);
    throw new Error('Falha ao carregar dados das costureiras');
  }
};

export const fetchFeaturedSeamstresses = async (): Promise<Seamstress[]> => {
  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Use as 5 primeiras costureiras como destaque
    const featuredSeamstresses: Seamstress[] = uniqueSeamstressProfiles.slice(0, 5).map((profile, index) => ({
      id: profile.id + 100, // Different IDs to avoid conflicts
      name: profile.name,
      address: `Rua Principal, ${200 + index * 30} - Centro, Timon - MA`,
      photo: profilePhotos[index % profilePhotos.length],
      rating: profile.rating,
      distance: generateDistance(),
      services: profile.mainServices,
      price: profile.price,
    }));

    return featuredSeamstresses;
  } catch (error) {
    console.error('Error fetching featured seamstresses:', error);
    throw new Error('Falha ao carregar costureiras em destaque');
  }
};

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


const formatPhoneNumber = (phone: string): string => {
  // Generate a Brazilian phone number format
  const numbers = phone.replace(/\D/g, '');
  if (numbers.length >= 10) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  }
  return '(85) 99999-9999'; // Default fallback
};

export const fetchSeamstressProfile = async (seamstressId: string): Promise<SeamstressProfile> => {
  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const id = parseInt(seamstressId);
    const profileData = uniqueSeamstressProfiles.find(p => p.id === id) || uniqueSeamstressProfiles[0];
    const profileReviews = uniqueReviews[id] || uniqueReviews[1];

    const profile: SeamstressProfile = {
      id: profileData.id,
      name: profileData.name,
      email: profileData.email,
      phone: profileData.phone,
      address: `Rua das Flores, ${100 + profileData.id * 50} - Centro, Timon - MA`,
      photo: profilePhotos[(profileData.id - 1) % profilePhotos.length],
      bio: profileData.bio,
      rating: profileData.rating,
      reviewCount: profileData.reviewCount,
      experience: profileData.experience,
      services: profileData.services,
      workingHours: profileData.workingHours,
      status: profileData.status,
      specialization: profileData.specialization,
      education: profileData.education,
      reviews: profileReviews.map((review, index) => ({
        id: index + 1,
        ...review
      })),
      portfolioImages: ['1', '2', '3', '4'], // Placeholder for portfolio images
      distance: generateDistance(),
    };

    return profile;
  } catch (error) {
    console.error('Error fetching seamstress profile:', error);
    throw new Error('Falha ao carregar perfil da costureira');
  }
};