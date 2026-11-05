export const metadata = {
  title: 'AgriLegal - LegalTech for Agri-Export',
  description: 'Legal & Export Document Management Platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body style={{ margin: 0, padding: 0, backgroundColor: '#f8fafc' }}>
        {children}
      </body>
    </html>
  );
}