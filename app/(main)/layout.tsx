import Navbar from "../components/main/navbar";
import Footer from "../components/main/Footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      
      <Navbar />
      
      {/* ¡EL FIX! Sin el "pt-20", el Hero ahora subirá hasta el tope de la pantalla */}
      <main className="flex-grow"> 
        {children}
      </main>
      
      {/* El Footer se renderizará siempre al final de la estructura */}
      <Footer />
      
    </div>
  );
}