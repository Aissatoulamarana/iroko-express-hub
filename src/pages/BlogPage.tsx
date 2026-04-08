import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Calendar, ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const categories = ["Tous", "Transit", "Import/Export", "Douane", "Sourcing", "Actualités"];

const posts = [
  {
    id: 1, featured: true,
    title: "Comment importer depuis la Chine vers la RDC : Guide complet 2025",
    excerpt: "Découvrez toutes les étapes pour réussir votre importation de marchandises depuis la Chine jusqu'à Kinshasa, en passant par le dédouanement.",
    category: "Import/Export", date: "15 Mars 2025", readTime: "8 min",
    image: "https://images.unsplash.com/photo-1494412574643-ff11b0a5eb19?w=800&q=80",
  },
  {
    id: 2,
    title: "Les nouvelles réglementations douanières en RDC",
    excerpt: "Tout ce que vous devez savoir sur les changements récents dans la législation douanière congolaise.",
    category: "Douane", date: "10 Mars 2025", readTime: "5 min",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80",
  },
  {
    id: 3,
    title: "Sourcing Alibaba : 5 erreurs à éviter",
    excerpt: "Évitez les pièges courants lors de vos achats sur Alibaba grâce à nos conseils d'experts.",
    category: "Sourcing", date: "5 Mars 2025", readTime: "6 min",
    image: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&q=80",
  },
  {
    id: 4,
    title: "Transit Douala-Kinshasa : optimiser vos délais",
    excerpt: "Nos astuces pour réduire les temps de transit entre le Cameroun et la RDC.",
    category: "Transit", date: "28 Fév 2025", readTime: "4 min",
    image: "https://images.unsplash.com/photo-1605745341112-85968b19335b?w=800&q=80",
  },
  {
    id: 5,
    title: "L'avenir de la logistique en Afrique centrale",
    excerpt: "Tendances et innovations qui transforment le secteur du transport et de la logistique.",
    category: "Actualités", date: "20 Fév 2025", readTime: "7 min",
    image: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&q=80",
  },
  {
    id: 6,
    title: "Comprendre les incoterms pour mieux négocier",
    excerpt: "FOB, CIF, EXW... Maîtrisez le langage du commerce international.",
    category: "Import/Export", date: "15 Fév 2025", readTime: "6 min",
    image: "https://images.unsplash.com/photo-1494412574643-ff11b0a5eb19?w=800&q=80",
  },
];

const BlogPage = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const heroInView = useInView(heroRef, { once: true });
  const [activeCategory, setActiveCategory] = useState("Tous");

  const filtered = activeCategory === "Tous"
    ? posts
    : posts.filter((p) => p.category === activeCategory);

  const featured = filtered.find((p) => p.featured);
  const rest = filtered.filter((p) => !p.featured);

  return (
    <>
      {/* Hero */}
      <section className="section-dark relative overflow-hidden pt-32 pb-20">
        <div className="grain-overlay" />
        <div className="container mx-auto px-4 lg:px-8 relative z-20" ref={heroRef}>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-primary font-semibold tracking-widest uppercase text-sm mb-4"
          >
            Ressources & Actualités
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display font-extrabold text-4xl md:text-6xl lg:text-7xl text-surface-foreground leading-tight mb-6"
          >
            Notre <span className="text-gradient-primary">Blog</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-surface-foreground/70 text-lg md:text-xl max-w-2xl"
          >
            Conseils, guides et actualités du monde du transit et du commerce international.
          </motion.p>
        </div>
      </section>

      {/* Filters + posts */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Category tabs */}
          <div className="flex flex-wrap gap-2 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Featured post */}
          {featured && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid md:grid-cols-2 gap-8 mb-12 group cursor-pointer"
            >
              <div className="rounded-2xl overflow-hidden h-64 md:h-auto">
                <img
                  src={featured.image}
                  alt={featured.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="flex flex-col justify-center">
                <Badge className="w-fit mb-3 bg-primary/10 text-primary border-0">
                  {featured.category}
                </Badge>
                <h2 className="font-display font-bold text-2xl md:text-3xl text-foreground mb-3 group-hover:text-primary transition-colors">
                  {featured.title}
                </h2>
                <p className="text-muted-foreground mb-4">{featured.excerpt}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{featured.date}</span>
                  <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{featured.readTime}</span>
                </div>
                <Button variant="link" className="px-0 text-primary w-fit">
                  Lire l'article <ArrowRight className="ml-1 w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Post grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((post, i) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="rounded-2xl border border-border bg-card overflow-hidden hover-lift group cursor-pointer"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="p-6">
                  <Badge className="mb-3 bg-primary/10 text-primary border-0 text-xs">
                    {post.category}
                  </Badge>
                  <h3 className="font-display font-bold text-lg text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground text-sm line-clamp-2 mb-4">{post.excerpt}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{post.date}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{post.readTime}</span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-12">Aucun article dans cette catégorie pour le moment.</p>
          )}
        </div>
      </section>
    </>
  );
};

export default BlogPage;
