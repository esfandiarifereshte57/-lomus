export const metadata = {
  title: 'Lomus - شبکه اجتماعی',
  description: 'شبکه اجتماعی متن‌محور',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl">
      <body>{children}</body>
    </html>
  )
}