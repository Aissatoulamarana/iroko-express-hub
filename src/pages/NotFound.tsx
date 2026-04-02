import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Package } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <section className="min-h-screen flex items-center justify-center section-dark">
      <div className="grain-overlay" />
      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-8">
            <Package size={48} className="text-primary" />
          </div>
          <h1 className="font-display font-extrabold text-7xl md:text-9xl text-primary mb-4">404</h1>
          <p className="text-surface-foreground/70 text-xl md:text-2xl mb-10 max-w-md mx-auto">
            Ce colis semble égaré. La page que vous cherchez n'existe pas.
          </p>
          <Button variant="hero" size="xl" asChild className="group">
            <Link to="/">
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              Retour à l'accueil
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default NotFound;
