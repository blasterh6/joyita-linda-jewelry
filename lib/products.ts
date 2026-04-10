export interface Product {
  id: number;
  slug: string;
  name: string;
  price: number;
  image: string;
  category: string;
  collection: string;
  description: string;
  availability: string;
  details: string[];
}

export const products: Product[] = [
  { 
    id: 1, 
    slug: "aretes-gota-plata-925",
    name: "Aretes de Gota Plata .925", 
    price: 450, 
    image: "/assets/earrings.png", 
    category: "Aretes", 
    collection: "esenciales",
    description: "Elegantes aretes en forma de gota, diseñados para resaltar la brillantez natural de la plata ley .925. Un clásico atemporal que complementa cualquier atuendo, desde casual hasta formal.",
    availability: "En Stock",
    details: [
      "Material: Plata Ley .925",
      "Peso aproximado: 4.5g",
      "Dimensiones: 15mm x 8mm",
      "Acabado: Pulido espejo"
    ]
  },
  { 
    id: 2, 
    slug: "collar-lujo-signature-925",
    name: "Collar Lujo Signature", 
    price: 1200, 
    image: "/assets/necklace.png", 
    category: "Collares", 
    collection: "noche",
    description: "Nuestra pieza insignia. Este collar combina la artesanía tradicional con un diseño vanguardista. Cada eslabón ha sido cuidadosamente pulido para ofrecer una textura suave y un brillo incomparable.",
    availability: "En Stock",
    details: [
      "Material: Plata Sterling .925",
      "Longitud: 45cm + 5cm de extensión",
      "Cierre: Tipo langosta reforzado",
      "Estuche premium incluido"
    ]
  },
  { 
    id: 3, 
    slug: "broquel-plata-joyita",
    name: "Broquel de Plata Joyita", 
    price: 250, 
    image: "/assets/earrings.png", 
    category: "Aretes", 
    collection: "esenciales",
    description: "Comodidad y estilo en una sola pieza. Estos broqueles son ideales para el uso diario, gracias a su diseño ligero y seguro. Son el toque de brillo sutil que tu rostro necesita.",
    availability: "En Stock",
    details: [
      "Material: Plata Ley .925",
      "Diámetro: 6mm",
      "Tipo de perno: Mariposa de seguridad",
      "Hipoalergénico"
    ]
  },
  { 
    id: 4, 
    slug: "gargantilla-plata-fina-925",
    name: "Gargantilla Plata Fina", 
    price: 850, 
    image: "/assets/necklace.png", 
    category: "Collares", 
    collection: "artesanal",
    description: "Una gargantilla delicada que captura la esencia de la feminidad. Su diseño minimalista la hace perfecta para usar sola o en capas con otros collares de nuestra colección.",
    availability: "Pocas Unidades",
    details: [
      "Material: Plata .925",
      "Ancho de cadena: 1.2mm",
      "Resistente al deslustre",
      "Garantía de calidad Joyita Linda"
    ]
  }
];

export const categories = ["Aretes", "Collares", "Pulseras", "Anillos"];
