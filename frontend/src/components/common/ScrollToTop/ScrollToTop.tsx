import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Componente que força o scroll para o topo da página sempre que a rota muda
 * Resolve o problema de navegação onde a nova página aparece na mesma posição de scroll da página anterior
 */
const ScrollToTop: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    // Aguarda um frame para garantir que o React terminou de renderizar
    const scrollToTop = () => {
      // Múltiplas abordagens para garantir compatibilidade
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      
      // Força o scroll em elementos que podem ter overflow
      const mainContent = document.querySelector('.main-content');
      if (mainContent) {
        mainContent.scrollTop = 0;
      }
    };

    // Executa imediatamente
    scrollToTop();
    
    // Executa novamente após um pequeno delay para garantir
    const timeoutId = setTimeout(scrollToTop, 100);
    
    return () => clearTimeout(timeoutId);
  }, [location.pathname, location.search]); // Monitora tanto pathname quanto search params

  return null; // Componente não renderiza nada visualmente
};

export default ScrollToTop;
