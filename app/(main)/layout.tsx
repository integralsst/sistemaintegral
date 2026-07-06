import Navbar from "../components/main/navbar";
import Footer from "../components/main/Footer"; // 1. Importación del componente

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // 2. Contenedor principal Flexbox para asegurar que ocupe al menos toda la pantalla
    <div className="flex flex-col min-h-screen bg-white">
      
      <Navbar />
      
      {/* 3. flex-grow empuja automáticamente el Footer hacia el fondo */}
      <main className="flex-grow pt-20"> 
        {children}
      </main>
      
      {/* 4. El Footer se renderizará siempre al final de la estructura */}
      <Footer />
      
    </div>
  );
}