import { useEffect } from 'react';

/**
 * Hook personalizado para rolar a página para o topo
 * @param deps - Array de dependências que disparam o scroll quando mudarem
 * @param delay - Delay em milissegundos antes de executar o scroll (padrão: 0)
 */
export const useScrollToTop = (deps?: React.DependencyList, delay: number = 0) => {
  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth' // Scroll suave
      });
      // Fallback para navegadores mais antigos
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    if (delay > 0) {
      const timeoutId = setTimeout(scrollToTop, delay);
      return () => clearTimeout(timeoutId);
    } else {
      scrollToTop();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};

/**
 * Hook para scroll instantâneo para o topo
 * @param deps - Array de dependências que disparam o scroll quando mudarem
 * @param delay - Delay em milissegundos antes de executar o scroll (padrão: 100ms)
 */
export const useScrollToTopInstant = (deps?: React.DependencyList, delay: number = 100) => {
  useEffect(() => {
    const scrollToTop = () => {
      // Múltiplas abordagens para garantir que funcione
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
    
    // Executa novamente após o delay para garantir
    const timeoutId = setTimeout(scrollToTop, delay);
    
    return () => clearTimeout(timeoutId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};

/**
 * Hook específico para navegação entre páginas/categorias
 * Força scroll imediato e aguarda renderização completa
 */
export const useScrollToTopOnNavigation = (deps?: React.DependencyList) => {
  useEffect(() => {
    const scrollToTop = () => {
      // Scroll imediato
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    // Executa múltiplas vezes para garantir
    scrollToTop();
    
    // Aguarda o próximo frame de renderização
    requestAnimationFrame(() => {
      scrollToTop();
      
      // Executa mais uma vez após um pequeno delay
      setTimeout(scrollToTop, 50);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};

export default useScrollToTop;
