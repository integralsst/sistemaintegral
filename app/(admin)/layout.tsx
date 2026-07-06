import React from "react";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="w-full">
      {/* Aquí irá la navegación o sidebar específica de esta sección en el futuro */}
      {children}
    </section>
  );
}