
import Link from "next/link";

const modulos = [
  {
    nombre: "Productos",
    descripcion: "Administra los productos de tu tienda.",
    cantidad: "Inventario",
    icono: "▧",
    ruta: "/productos",
  },
  {
    nombre: "Categorías",
    descripcion: "Organiza los productos por categorías.",
    cantidad: "Organización",
    icono: "▤",
    ruta: "/categorias",
  },
  {
    nombre: "Tallas",
    descripcion: "Gestiona las tallas disponibles.",
    cantidad: "Tallas disponibles",
    icono: "◫",
    ruta: "/tallas",
  },
  {
    nombre: "Colores",
    descripcion: "Administra los colores de los productos.",
    cantidad: "Variedad",
    icono: "◉",
    ruta: "/colores",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F8F3EE] text-[#59483F] md:flex">

      {/* Menú lateral */}
      <aside className="w-full bg-[#E8D8CC] p-6 md:min-h-screen md:w-64">
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-[0.2em]">
            YEYLA
          </h1>
          <p className="mt-1 text-sm text-[#806D60]">
            Tienda virtual
          </p>
        </div>

        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[#927D6F]">
          Menú principal
        </p>

        <nav className="flex flex-wrap gap-2 md:flex-col">
          <Link
            href="/"
            className="rounded-xl bg-[#F8F3EE] px-4 py-3 font-semibold"
          >
            ◈ Área de trabajo
          </Link>

          {modulos.map((modulo) => (
            <Link
              key={modulo.nombre}
              href={modulo.ruta}
              className="rounded-xl px-4 py-3 transition hover:bg-[#F2E8DF]"
            >
              {modulo.icono} {modulo.nombre}
            </Link>
          ))}
        </nav>

        <div className="mt-12 hidden rounded-2xl bg-[#F2E8DF] p-4 md:block">
          <p className="font-semibold">YEYLA</p>
          <p className="mt-1 text-sm text-[#806D60]">
            Administra tu tienda de manera fácil y organizada.
          </p>
        </div>
      </aside>

      {/* Contenido principal */}
      <section className="flex-1 p-6 md:p-10">

        {/* Encabezado */}
        <header className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-[#A18A7B]">
              PANEL DE ADMINISTRACIÓN
            </p>
            <h2 className="mt-2 text-3xl font-bold">
              Área de Trabajo
            </h2>
            <p className="mt-2 text-[#806D60]">
              Bienvenido al sistema de gestión de YEYLA.
            </p>
          </div>

          <div className="rounded-full border border-[#E8D8CC] bg-white px-5 py-3 text-sm">
            ✧ Panel administrativo
          </div>
        </header>

        {/* Bienvenida */}
        <div className="mb-10 rounded-3xl bg-[#D6C0AE] p-7 md:p-10">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#725B4D]">
            Bienvenido a YEYLA
          </p>

          <h3 className="max-w-xl text-2xl font-bold md:text-3xl">
            Todo lo que necesitas para administrar tu tienda, en un solo lugar.
          </h3>

          <p className="mt-4 max-w-xl text-[#59483F]">
            Consulta, registra, actualiza y organiza la información de tus productos.
          </p>
        </div>

        {/* Módulos */}
        <div className="mb-6">
          <h3 className="text-xl font-bold">Módulos de gestión</h3>
          <p className="mt-1 text-sm text-[#927D6F]">
            Selecciona el módulo que deseas administrar.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {modulos.map((modulo) => (
            <Link
              key={modulo.nombre}
              href={modulo.ruta}
              className="group rounded-2xl border border-[#E8D8CC] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#F2E8DF] text-2xl">
                {modulo.icono}
              </div>

              <h4 className="text-lg font-bold">
                {modulo.nombre}
              </h4>

              <p className="mt-2 min-h-12 text-sm leading-6 text-[#927D6F]">
                {modulo.descripcion}
              </p>

              <div className="mt-5 flex items-center justify-between border-t border-[#F2E8DF] pt-4">
                <span className="text-xs text-[#A18A7B]">
                  {modulo.cantidad}
                </span>

                <span className="font-semibold text-[#A17D68] group-hover:translate-x-1">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Pie de página */}
        <footer className="mt-12 border-t border-[#E8D8CC] pt-5 text-center text-sm text-[#A18A7B]">
          YEYLA © 2026 · Sistema de gestión de tienda virtual
        </footer>

      </section>
    </main>
  );
}
