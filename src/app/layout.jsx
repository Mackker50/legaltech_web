export const metadata = {
  title: 'AgriLegal Workspace - LegalTech for Agri-Export',
  description: 'Agricultural Export Transaction & Legal Management Platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body style={{ margin: 0, padding: 0, backgroundColor: '#f1f5f9', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        {children}
      </body>
    </html>
  );
}