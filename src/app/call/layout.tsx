export default function CallLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <div className='bg-foreground h-screen'>{children}</div>;
}
