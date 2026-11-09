
"use client";

import { useEffect, useState } from "react";

interface Categoria {
  id_categoria: number;
  nombre_categoria: string;
  descripcion: string;
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

async function leerRespuesta(respuesta: Response) {
  const texto = await respuesta.text();
  return texto ? JSON.parse(texto) : {};
}

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [idEditar, setIdEditar] = useState<number | null>(null);
  const [categoriaSeleccionada, setCategoriaSeleccionada] =
    useState<Categoria | null>(null);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  async function cargarCategorias() {
    setCargando(true);
    setError("");

    try {
      const respuesta = await fetch(`${API_URL}/api/categorias`);
      const datos = await leerRespuesta(respuesta);

      if (!respuesta.ok) {
        throw new Error(
          datos.mensaje || "No se pudieron consultar las categorías."
        );
      }

      const lista = Array.isArray(datos)
        ? datos
        : datos.categorias || datos.data || [];

      setCategorias(lista);
    } catch {
      setError(
        "No fue posible cargar las categorías. Verifica la conexión con el servidor."
      );
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarCategorias();
  }, []);

  async function guardarCategoria(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();
    setMensaje("");
    setError("");

    const categoria = {
      nombre_categoria: nombre.trim(),
      descripcion: descripcion.trim(),
    };

    try {
      const respuesta = await fetch(
        idEditar
          ? `${API_URL}/api/categorias/${idEditar}`
          : `${API_URL}/api/categorias`,
        {
          method: idEditar ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(categoria),
        }
      );

      const datos = await leerRespuesta(respuesta);

      if (!respuesta.ok) {
        throw new Error(
          datos.mensaje || "No se pudo guardar la categoría."
        );
      }

      setMensaje(
        idEditar
          ? "Categoría actualizada correctamente."
          : "Categoría registrada correctamente."
      );

      limpiarFormulario();
      await cargarCategorias();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Ocurrió un error al guardar la categoría."
      );
    }
  }

  async function verCategoria(id: number) {
    setError("");
    setMensaje("");

    try {
      const respuesta = await fetch(
        `${API_URL}/api/categorias/${id}`
      );

      const datos = await leerRespuesta(respuesta);

      if (!respuesta.ok) {
        throw new Error(
          datos.mensaje || "No se pudo consultar la categoría."
        );
      }

      setCategoriaSeleccionada(
        datos.categoria || datos.data || datos
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo consultar la categoría."
      );
    }
  }

  function prepararEdicion(categoria: Categoria) {
    setIdEditar(categoria.id_categoria);
    setNombre(categoria.nombre_categoria);
    setDescripcion(categoria.descripcion || "");
    setCategoriaSeleccionada(null);
    setMensaje("");
    setError("");
  }

  function limpiarFormulario() {
    setIdEditar(null);
    setNombre("");
    setDescripcion("");
  }

  async function eliminarCategoria(id: number) {
    const confirmar = window.confirm(
      "¿Estás segura de que deseas eliminar esta categoría?"
    );

    if (!confirmar) return;

    setMensaje("");
    setError("");

    try {
      const respuesta = await fetch(
        `${API_URL}/api/categorias/${id}`,
        { method: "DELETE" }
      );

      const datos = await leerRespuesta(respuesta);

      if (!respuesta.ok) {
        throw new Error(
          datos.mensaje || "No se pudo eliminar la categoría."
        );
      }

      setMensaje("Categoría eliminada correctamente.");
      setCategoriaSeleccionada(null);

      if (idEditar === id) {
        limpiarFormulario();
      }

      await cargarCategorias();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Ocurrió un error al eliminar la categoría."
      );
    }
  }

  return (
    <main className="min-h-screen bg-[#F8F3EE] px-4 py-10 text-[#59483F] sm:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-[#987C69]">
            Boutique.KC
          </p>

          <h1 className="text-3xl font-bold sm:text-4xl">
            Administración de categorías
          </h1>

          <p className="mt-3 text-[#806F63]">
            Registra y administra las categorías de la boutique.
          </p>
        </header>

        <section className="mb-8 rounded-2xl border border-[#E5D8CC] bg-white p-6 shadow-sm sm:p-8">
          <h2 className="mb-6 text-xl font-semibold">
            {idEditar ? "Editar categoría" : "Registrar categoría"}
          </h2>

          <form onSubmit={guardarCategoria} className="space-y-5">
            <div>
              <label
                htmlFor="nombre"
                className="mb-2 block text-sm font-semibold"
              >
                Nombre de la categoría
              </label>

              <input
                id="nombre"
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej. Blusas, pantalones, vestidos"
                required
                className="w-full rounded-lg border border-[#D9C9BC] bg-[#FCFAF8] px-4 py-3 outline-none transition focus:border-[#987C69] focus:ring-2 focus:ring-[#D9C9BC]"
              />
            </div>

            <div>
              <label
                htmlFor="descripcion"
                className="mb-2 block text-sm font-semibold"
              >
                Descripción
              </label>

              <textarea
                id="descripcion"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Describe la categoría"
                rows={3}
                className="w-full resize-none rounded-lg border border-[#D9C9BC] bg-[#FCFAF8] px-4 py-3 outline-none transition focus:border-[#987C69] focus:ring-2 focus:ring-[#D9C9BC]"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                className="rounded-lg bg-[#806657] px-6 py-3 font-semibold text-white transition hover:bg-[#59483F]"
              >
                {idEditar ? "Guardar cambios" : "Registrar categoría"}
              </button>

              {idEditar && (
                <button
                  type="button"
                  onClick={limpiarFormulario}
                  className="rounded-lg border border-[#D9C9BC] px-6 py-3 font-semibold text-[#59483F] transition hover:bg-[#F1E8E0]"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </section>

        {mensaje && (
          <div className="mb-5 rounded-lg border border-[#C9D8C4] bg-[#EDF3E9] p-4 text-sm text-[#47613F]">
            {mensaje}
          </div>
        )}

        {error && (
          <div className="mb-5 rounded-lg border border-[#E5C7BD] bg-[#F9ECE8] p-4 text-sm text-[#914F40]">
            {error}
          </div>
        )}

        {categoriaSeleccionada && (
          <section className="mb-8 rounded-2xl border border-[#E5D8CC] bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold">
                Detalles de la categoría
              </h2>

              <button
                onClick={() => setCategoriaSeleccionada(null)}
                className="text-sm font-semibold text-[#806657] hover:underline"
              >
                Cerrar
              </button>
            </div>

            <p className="mb-2">
              <strong>Nombre:</strong>{" "}
              {categoriaSeleccionada.nombre_categoria}
            </p>

            <p>
              <strong>Descripción:</strong>{" "}
              {categoriaSeleccionada.descripcion || "Sin descripción"}
            </p>
          </section>
        )}

        <section className="rounded-2xl border border-[#E5D8CC] bg-white p-6 shadow-sm sm:p-8">
          <h2 className="mb-6 text-xl font-semibold">
            Categorías registradas
          </h2>

          {cargando ? (
            <p className="py-6 text-center text-[#806F63]">
              Cargando categorías...
            </p>
          ) : categorias.length === 0 ? (
            <p className="py-6 text-center text-[#806F63]">
              No hay categorías registradas.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-left">
                <thead>
                  <tr className="border-b border-[#E5D8CC] bg-[#F8F3EE]">
                    <th className="px-4 py-3">Nombre</th>
                    <th className="px-4 py-3">Descripción</th>
                    <th className="px-4 py-3">Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {categorias.map((categoria) => (
                    <tr
                      key={categoria.id_categoria}
                      className="border-b border-[#EFE6DE] last:border-0"
                    >
                      <td className="px-4 py-4 font-medium">
                        {categoria.nombre_categoria}
                      </td>

                      <td className="px-4 py-4">
                        {categoria.descripcion || "Sin descripción"}
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() =>
                              verCategoria(categoria.id_categoria)
                            }
                            className="rounded-md bg-[#EDE3DA] px-3 py-2 text-sm font-semibold text-[#59483F] hover:bg-[#E1D2C5]"
                          >
                            Ver
                          </button>

                          <button
                            onClick={() => prepararEdicion(categoria)}
                            className="rounded-md bg-[#806657] px-3 py-2 text-sm font-semibold text-white hover:bg-[#59483F]"
                          >
                            Editar
                          </button>

                          <button
                            onClick={() =>
                              eliminarCategoria(categoria.id_categoria)
                            }
                            className="rounded-md bg-[#A65F50] px-3 py-2 text-sm font-semibold text-white hover:bg-[#87483C]"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
