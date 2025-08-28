export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main lang="en">
      <div className="h-screen flex flex-col items-center justify-center">{children}</div>
    </main>
  );
}
