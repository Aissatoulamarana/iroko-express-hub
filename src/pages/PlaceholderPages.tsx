const PlaceholderPage = ({ title }: { title: string }) => {
  return (
    <section className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4 lg:px-8">
        <h1 className="font-display font-extrabold text-4xl md:text-5xl text-foreground mb-4">{title}</h1>
        <p className="text-muted-foreground text-lg">Cette page est en cours de construction.</p>
      </div>
    </section>
  );
};

export const QuotePage = () => <PlaceholderPage title="Demander un devis" />;
export const LegalPage = () => <PlaceholderPage title="Mentions légales" />;
export const PrivacyPage = () => <PlaceholderPage title="Politique de confidentialité" />;
