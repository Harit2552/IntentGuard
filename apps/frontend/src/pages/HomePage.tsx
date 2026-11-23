type HomePageProps = {
  title: string;
  message: string;
};

export function HomePage({ title, message }: HomePageProps) {
  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="text-3xl font-semibold">{title}</h1>
      <p className="mt-4 text-slate-600">{message}</p>
    </main>
  );
}
