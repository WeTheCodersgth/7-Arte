import React from 'react';

const Rodape = () => {
  return (
    <footer className="bg-black bg-opacity-50 border-t border-gray-800 py-8 mt-16">
      <div className="container mx-auto px-6 lg:px-16 text-center text-brand-secondary">
        <div className="flex justify-center mb-6">
          <a href="#" className="mx-4 text-2xl hover:text-brand-accent transition-colors duration-300"><i className="fab fa-facebook-f"></i></a>
          <a href="#" className="mx-4 text-2xl hover:text-brand-accent transition-colors duration-300"><i className="fab fa-twitter"></i></a>
          <a href="#" className="mx-4 text-2xl hover:text-brand-accent transition-colors duration-300"><i className="fab fa-instagram"></i></a>
          <a href="#" className="mx-4 text-2xl hover:text-brand-accent transition-colors duration-300"><i className="fab fa-youtube"></i></a>
        </div>
        <div className="flex justify-center flex-wrap mb-6 text-sm">
          <a href="#" className="mx-3 my-1 hover:text-brand-primary transition-colors duration-300">Termos de Serviço</a>
          <a href="#" className="mx-3 my-1 hover:text-brand-primary transition-colors duration-300">Política de Privacidade</a>
          <a href="#" className="mx-3 my-1 hover:text-brand-primary transition-colors duration-300">Ajuda</a>
          <a href="#" className="mx-3 my-1 hover:text-brand-primary transition-colors duration-300">Sobre Nós</a>
          <a href="#" className="mx-3 my-1 hover:text-brand-primary transition-colors duration-300">Carreiras</a>
        </div>
        <p className="text-xs">&copy; {new Date().getFullYear()} 7ª Arte. Todos os direitos reservados.</p>
        <div className="mt-4 text-sm text-brand-secondary">
          Desenvolvido com <i className="fas fa-heart text-brand-accent mx-1"></i> por We, The Coders
        </div>
      </div>
    </footer>
  );
};

export default Rodape;
