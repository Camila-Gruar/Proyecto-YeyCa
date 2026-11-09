
"use client";

import { useEffect, useState } from "react";

interface Categoria {
  id_categoria: number;
  nombre_categoria: string;
  descripcion: string;
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [idEditar, setIdEditar] = useState<number | null>(null);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  async function cargarCategorias() {
    setCargando(true);
    setError("");

    try {
      const respuesta = await fetch(`${API_URL}/api/categorias`);

      if (!respuesta.ok) {
        throw new Error("No se pudieron consultar las categorías.");
      }

      const datos = await respuesta.json();

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

  async function guardarCategoria(e: React.FormEvent<HTMLFormElement>) {
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

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.mensaje || "No se pudo guardar la categoría.");
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
        err instanceof Error ? err.message : "Ocurrió un error al guardar."
      );
    }
  }

  function prepararEdicion(categoria: Categoria) {
    setIdEditar(categoria.id_categoria);
    setNombre(categoria.nombre_categoria);
    setDescripcion(categoria.descripcion || "");
    setMensaje("");
    setError("");
  }

  function limpiarFormulario() {
    setIdEditar(null);
    setNombre("");
    setDescripcion("");
  }

  async function eliminarCategoria(id: number) {
    if (!window.confirm("¿Estás segura de eliminar esta categoría?")) {
      return;
    }

    setMensaje("");
    setError("");

    try {
      const respuesta = await fetch(`${API_URL}/api/categorias/${id}`, {
        method: "DELETE",
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.mensaje || "No se pudo eliminar la categoría.");
      }

      setMensaje("Categoría eliminada correctamente.");
      await cargarCategorias();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Ocurrió un error al eliminar."
      );
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6 text-gray-800">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-2 text-3xl font-bold">
          Administración de categorías
        </h1>

        <p className="mb-8 text-gray-600">
          Registra y administra las categorías de la boutique.
        </p>

        <section className="mb-8 rounded-xl bg-white p-6 shadow">
          <h2 className="mb-5 text-xl font-semibold">
            {idEditar ? "Editar categoría" : "Registrar categoría"}
          </h2>

          <form onSubmit={guardarCategoria} className="space-y-4">
            <div>
              <label className="mb-1 block font-medium">
                Nombre de la categoría
              </label>

              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej. Blusas"
                required
                className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-pink-500"
              />
            </div>

            <div>
              <label className="mb-1 block font-medium">
                Descripción
              </label>

              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Describe la categoría"
                className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-pink-500"
                rows={3}
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                className="rounded-lg bg-pink-600 px-5 py-3 font-medium text-white hover:bg-pink-700"
              >
                {idEditar ? "Guardar cambios" : "Registrar categoría"}
              </button>

              {idEditar !== null && (
                <button
                  type="button"
                  onClick={limpiarFormulario}
                  className="rounded-lg border border-gray-300 px-5 py-3"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </section>

        {mensaje && (
          <p className="mb-4 rounded-lg bg-green-100 p-3 text-green-800">
            {mensaje}
          </p>
        )}

        {error && (
          <p className="mb-4 rounded-lg bg-red-100 p-3 text-red-700">
            {error}
          </p>
        )}

        <section className="rounded-xl bg-white p-6 shadow">
          <h2 className="mb-5 text-xl font-semibold">
            Categorías registradas
          </h2>

          {cargando ? (
            <p>Cargando categorías...</p>
          ) : categorias.length === 0 ? (
            <p className="text-gray-500">
              No hay categorías registradas.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="p-3">ID</th>
                    <th className="p-3">Nombre</th>
                    <th className="p-3">Descripción</th>
                    <th className="p-3">Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {categorias.map((categoria) => (
                    <tr
                      key={categoria.id_categoria}
                      className="border-b"
                    >
                      <td className="p-3">{categoria.id_categoria}</td>
                      <td className="p-3">{categoria.nombre_categoria}</td>
                      <td className="p-3">{categoria.descripcion}</td>
                      <td className="p-3">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => prepararEdicion(categoria)}
                            className="rounded bg-blue-600 px-3 py-2 text-white hover:bg-blue-700"
                          >
                            Editar
                          </button>

                          <button
                            onClick={() =>
                              eliminarCategoria(categoria.id_categoria)
                            }
                            className="rounded bg-red-600 px-3 py-2 text-white hover:bg-red-700"
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
