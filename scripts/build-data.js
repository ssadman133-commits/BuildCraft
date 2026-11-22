const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const exteriorDir = path.join(rootDir, 'Exterior');
const interiorDir = path.join(rootDir, 'Interior');

function isUtilityPass(filename) {
  const f = filename.toLowerCase();
  return f.includes('albedo') || f.includes('material') || f.includes('normal') || f.includes('roughness') || f.includes('ambient');
}

function getFiles(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(getFiles(full));
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
        if (!isUtilityPass(entry.name)) {
          results.push(full);
        }
      }
    }
  }
  return results;
}

const exteriorMetadata = {
  'Cliebt-Saidpur': {
    title: 'The Saidpur Horizon Residence',
    location: 'Saidpur, Nilphamari',
    type: 'Luxury Residential Villa',
    preferredCover: 'Front,Right Side.jpg',
    description: 'A contemporary multi-level private residence featuring dramatic cantilevers, stone veneer cladding, and seamless integration between indoor and outdoor landscape.',
    tag: 'Residential'
  },
  'Client-Saidpur': {
    title: 'Saidpur Modern Villa II',
    location: 'Saidpur, Nilphamari',
    type: 'Modern Residential Villa',
    preferredCover: 'FRONT-RIGHT SIDE 1.0.jpg',
    description: 'Sculptural architectural facade with warm vertical louvers, expansive glass panels, and bespoke driveway landscaping.',
    tag: 'Residential'
  },
  'Client-Badorganj': {
    title: 'Badorganj Contemporary Estate',
    location: 'Badorganj, Rangpur',
    type: 'Private Residence',
    preferredCover: 'Front Side 1.jpg',
    description: 'Clean geometric massing, warm timber accents, and balanced proportions designed for natural daylight and ventilation.',
    tag: 'Residential'
  },
  'Client-DU': {
    title: 'University of Dhaka Campus Pavilions & Mosque',
    location: 'Dhaka University Campus',
    type: 'Civic, Cultural & Sacred Architecture',
    preferredCover: 'Mosque/Front Side.jpg',
    description: 'A distinguished suite of architectural concepts including an iconic contemporary campus mosque, cultural festival pavilions, and ceremonial pavilions.',
    tag: 'Civic & Cultural'
  },
  'Client-Mirpur 01': {
    title: 'Mirpur 01 Modern Residence',
    location: 'Mirpur 01, Dhaka',
    type: 'Multi-Level Residence',
    preferredCover: 'FRONT SIDE.jpg',
    description: 'Sleek urban residential facade showcasing contrasting dark concrete panels, floor-to-ceiling glass, and dramatic night architectural lighting.',
    tag: 'Residential'
  },
  'Client-Mohammadpur': {
    title: 'Mohammadpur Luxury Duplex Estate',
    location: 'Mohammadpur, Dhaka',
    type: 'Luxury Duplex Residence',
    preferredCover: 'Front 1.jpg',
    description: 'An expansive modern exterior project featuring multiple camera angles: facade, terrace landscaping, rooftop pergola, and night atmosphere illumination.',
    tag: 'Residential'
  },
  'Client-Noakhali': {
    title: 'Noakhali Contemporary Villa',
    location: 'Noakhali',
    type: 'Contemporary Villa',
    preferredCover: '1.png',
    description: 'Crisp architectural lines, dual-volume living facade, integrated landscape planter boxes, and warm ambient outdoor lighting.',
    tag: 'Residential'
  },
  'Client-Panchagor': {
    title: 'Panchagor Modern Residence',
    location: 'Panchagarh',
    type: 'Modern Residential Estate',
    preferredCover: '1.jpg',
    description: 'Modern minimalist exterior architecture with clean horizontal planes, textured stone accents, and expansive garden integration.',
    tag: 'Residential'
  },
  'Client-Shewrapara': {
    title: 'Shewrapara Urban Complex',
    location: 'Shewrapara, Dhaka',
    type: 'Urban Multi-Story Complex',
    preferredCover: 'F1.jpg',
    description: 'Contemporary multi-family urban building facade emphasizing dynamic vertical screens, modern balcony geometries, and street-level elegance.',
    tag: 'Commercial / Multi-Unit'
  }
};

const interiorMetadata = {
  'Client -mirpur 01': {
    title: 'Mirpur 01 Luxury Apartment',
    location: 'Mirpur 01, Dhaka',
    type: 'Bespoke Residential Interior',
    preferredCover: 'Drawing/Dr.1.png',
    description: 'A complete interior master plan featuring tailored master bedrooms, whimsical child bedrooms, custom modular kitchen, and an ornate modern mandir prayer space.',
    tag: 'Residential'
  },
  'Client -Vola': {
    title: 'The Bhola Grand Residence',
    location: 'Bhola',
    type: 'Full Residence Interior',
    preferredCover: 'Drawing And Dining/1.png',
    description: 'Extensive multi-room interior architecture comprising grand living & dining salons, multiple guest and family bedrooms, modern vanity basin units, and bespoke dinner wagons.',
    tag: 'Residential'
  },
  'Client Basundhar a 02': {
    title: 'Bashundhara Executive Penthouse II',
    location: 'Bashundhara R/A, Dhaka',
    type: 'Luxury Penthouse',
    preferredCover: 'Master BEd/1.jpg',
    description: 'Refined modern luxury interior including a master suite with fluted wall paneling, private study library, and guest suites.',
    tag: 'Residential'
  },
  'Client-Bashundhara': {
    title: 'Bashundhara Dual Units (Unit A & B)',
    location: 'Bashundhara R/A, Dhaka',
    type: 'Dual Luxury Apartments',
    preferredCover: 'Images/Unit-B/Drawing Room 01.png',
    description: 'Comprehensive interior styling for Unit-A and Unit-B showcasing open-concept living, acoustic wall paneling, Italian marble flooring, and bespoke lighting.',
    tag: 'Residential'
  },
  'Client-Cumilla': {
    title: 'Cumilla Contemporary Residence',
    location: 'Cumilla',
    type: 'Contemporary Residence',
    preferredCover: 'drawing room 01.png',
    description: 'Extensive 26-render interior series featuring warm Scandinavian minimalism, custom bed backdrops, ambient cove lighting, and cohesive spatial harmony.',
    tag: 'Residential'
  },
  'Client-Feni': {
    title: 'Feni Modern Living Space',
    location: 'Feni',
    type: 'Modern Living Space',
    preferredCover: '1.jpg',
    description: 'Modern transitional interior combining warm walnut wood veneer, subtle brass profiles, and elegant functional cabinetry.',
    tag: 'Residential'
  },
  'Client-Gulshan': {
    title: 'Gulshan High-End Apartment',
    location: 'Gulshan, Dhaka',
    type: 'Ultra-Luxury Apartment',
    preferredCover: 'Images/Scene 2.png',
    description: 'Prestige interior with high-gloss finishes, curved architectural elements, statement chandeliers, and plush modern furnishing.',
    tag: 'Residential'
  },
  'Client-KarwanBAzar': {
    title: 'Karwan Bazar Multi-Suite Residence',
    location: 'Karwan Bazar, Dhaka',
    type: 'Executive Residential Suites',
    preferredCover: '1/Drawing & Dining/1.jpg',
    description: 'Multi-unit luxury interior design covering multiple master suites, children bedrooms, open plan dining spaces, modern kitchen, and dedicated prayer room.',
    tag: 'Residential'
  },
  'Client-Uttara': {
    title: 'Uttara Modern Minimalist Residence',
    location: 'Uttara, Dhaka',
    type: 'Minimalist Residence',
    preferredCover: 'Render 2.0/d-1.jpg',
    description: 'Calm, neutral tones, concealed linear lighting, modern acoustic slat walls, and tailored furniture creating an oasis of understated luxury.',
    tag: 'Residential'
  },
  'office Design': {
    title: 'Corporate Executive Office HQ',
    location: 'Dhaka',
    type: 'Commercial Office Space',
    preferredCover: 'Image/1.jpg',
    description: 'Dynamic corporate work environment featuring modern reception lounge, director suites, ergonomic workstations, and glass partition conference rooms.',
    tag: 'Commercial / Office'
  },
  'Office design 02': {
    title: 'Modern Creative Agency Office',
    location: 'Dhaka',
    type: 'Creative Workplace',
    preferredCover: 'New folder/test.jpg',
    description: 'Inspiring collaborative workspace design incorporating open-ceiling industrial elements, acoustic pods, timber meeting tables, and vibrant breakout zones.',
    tag: 'Commercial / Office'
  },
  'Playground': {
    title: 'Wonderland Indoor Kids Play Zone',
    location: 'Dhaka',
    type: 'Children Recreation & Play Center',
    preferredCover: 'New folder/Image 2.png',
    description: 'Safe, imaginative, and colorful indoor activity center designed with soft play structures, thematic activity corners, and interactive play areas.',
    tag: 'Hospitality / Play'
  }
};

function processProjects(baseDir, metaMap, categoryName) {
  const projects = [];
  if (!fs.existsSync(baseDir)) return projects;
  const dirs = fs.readdirSync(baseDir, { withFileTypes: true }).filter(d => d.isDirectory());

  for (const dir of dirs) {
    const fullDirPath = path.join(baseDir, dir.name);
    const files = getFiles(fullDirPath);
    if (files.length === 0) continue;

    const relImages = files.map(f => path.relative(rootDir, f).replace(/\\/g, '/'));

    const meta = metaMap[dir.name] || {
      title: dir.name.replace(/^(Client|Cliebt)[-_ ]*/i, '') + ' Project',
      location: 'Bangladesh',
      type: categoryName + ' Project',
      preferredCover: '',
      description: 'Architectural ' + categoryName.toLowerCase() + ' design by BuildCraft Studio.',
      tag: categoryName
    };

    // Find preferred cover image
    let cover = relImages[0];
    if (meta.preferredCover) {
      const match = relImages.find(img => img.toLowerCase().endsWith(meta.preferredCover.toLowerCase()) || img.toLowerCase().includes(meta.preferredCover.toLowerCase()));
      if (match) cover = match;
    }

    projects.push({
      id: `${categoryName.toLowerCase()}-${dir.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      folderName: dir.name,
      category: categoryName,
      title: meta.title,
      location: meta.location,
      type: meta.type,
      description: meta.description,
      tag: meta.tag,
      imageCount: relImages.length,
      coverImage: cover,
      images: relImages
    });
  }
  return projects;
}

const exterior = processProjects(exteriorDir, exteriorMetadata, 'Exterior');
const interior = processProjects(interiorDir, interiorMetadata, 'Interior');

const portfolioData = {
  studioInfo: {
    name: 'BUILDCRAFT',
    tagline: 'Architectural & Interior Design Studio',
    phone: '+880 1540-053889',
    phoneRaw: '+8801540053889',
    whatsappUrl: 'https://wa.me/8801540053889',
    email: 'info.buildcraft.bd@gmail.com',
    location: 'Dhaka, Bangladesh',
    experienceYears: '8+',
    heroHeadline: 'CRAFTING SPACES. SHAPING TOMORROW.',
    heroSubtitle: 'Minimalist Architecture & Bespoke Interior Design Services'
  },
  exterior,
  interior,
  summary: {
    totalExteriorProjects: exterior.length,
    totalExteriorImages: exterior.reduce((acc, p) => acc + p.imageCount, 0),
    totalInteriorProjects: interior.length,
    totalInteriorImages: interior.reduce((acc, p) => acc + p.imageCount, 0),
    totalProjects: exterior.length + interior.length,
    totalImages: exterior.reduce((acc, p) => acc + p.imageCount, 0) + interior.reduce((acc, p) => acc + p.imageCount, 0)
  }
};

fs.writeFileSync(
  path.join(rootDir, 'data', 'projects.json'),
  JSON.stringify(portfolioData, null, 2),
  'utf8'
);

const jsContent = `// Auto-generated BuildCraft Portfolio Data
const BUILDCRAFT_DATA = ${JSON.stringify(portfolioData, null, 2)};
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BUILDCRAFT_DATA;
}
`;

fs.writeFileSync(path.join(rootDir, 'data', 'projects.js'), jsContent, 'utf8');

console.log('BuildCraft portfolio data regenerated successfully!');
console.log('Exterior Projects:', exterior.length, 'Images:', portfolioData.summary.totalExteriorImages);
console.log('Interior Projects:', interior.length, 'Images:', portfolioData.summary.totalInteriorImages);
console.log('Total Clean Final Images:', portfolioData.summary.totalImages);
