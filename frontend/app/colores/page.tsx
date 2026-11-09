
"use client";

import { useEffect, useState } from "react";

interface Color {
  id_color: number;
  nombre_color: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function ColoresPage() {
  const [colores, setColores] = useState<Color[]>([]);
  const [nombre, setNombre] = useState("");
  const [idEditar, setIdEditar] = useState<number | null>(null);
  const [colorSeleccionado, setColorSeleccionado] = useState<Color | null>(null);

  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  async function leerRespuesta(respuesta: Response) {
    const texto = await respuesta.text();
    return texto ? JSON.parse(texto) : {};
  }

  async function cargarColores() {
    setCargando(true);
    setError("");

    try {
      const respuesta = await fetch(`${API_URL}/api/colores`);
      const datos = await leerRespuesta(respuesta);

      if (!respuesta.ok) {
        throw new Error(datos.mensaje || "No se pudieron consultar los colores.");
      }

      const lista = Array.isArray(datos)
        ? datos
        : datos.colores || datos.data || [];

      setColores(lista);
    } catch {
      setError(
        "No fue posible cargar los colores. Verifica la conexión con el servidor."
      );
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarColores();
  }, []);

  function limpiarFormulario() {
    setIdEditar(null);
    setNombre("");
  }

  async function guardarColor(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMensaje("");
    setError("");

    const color = {
      nombre_color: nombre.trim(),
    };

    try {
      const respuesta = await fetch(
        idEditar
          ? `${API_URL}/api/colores/${idEditar}`
          : `${API_URL}/api/colores`,
        {
          method: idEditar ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(color),
        }
      );

      const datos = await leerRespuesta(respuesta);

      if (!respuesta.ok) {
        throw new Error(datos.mensaje || "No se pudo guardar el color.");
      }

      setMensaje(
        idEditar
          ? "Color actualizado correctamente."
          : "Color registrado correctamente."
      );

      limpiarFormulario();
      await cargarColores();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Ocurrió un error al guardar."
      );
    }
  }

  async function verColor(id: number) {
    setMensaje("");
    setError("");

    try {
      const respuesta = await fetch(`${API_URL}/api/colores/${id}`);
      const datos = await leerRespuesta(respuesta);

      if (!respuesta.ok) {
        throw new Error(datos.mensaje || "No se pudo consultar el color.");
      }

      setColorSeleccionado(datos.color || datos.data || datos);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Ocurrió un error al consultar."
      );
    }
  }

  function prepararEdicion(color: Color) {
    setIdEditar(color.id_color);
    setNombre(color.nombre_color);
    setColorSeleccionado(null);
    setMensaje("");
    setError("");
  }

  async function eliminarColor(id: number) {
    if (!window.confirm("¿Estás segura de eliminar este color?")) {
      return;
    }

    setMensaje("");
    setError("");

    try {
      const respuesta = await fetch(`${API_URL}/api/colores/${id}`, {
        method: "DELETE",
      });

      const datos = await leerRespuesta(respuesta);

      if (!respuesta.ok) {
        throw new Error(datos.mensaje || "No se pudo eliminar el color.");
      }

      setMensaje("Color eliminado correctamente.");
      setColorSeleccionado(null);
      await cargarColores();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Ocurrió un error al eliminar."
      );
    }
  }

  return (
    <main className="min-h-screen bg-[#F8F3EE] p-6 text-[#59483F] md:p-10">
      <div className="mx-auto max-w-5xl">

        {/* Encabezado */}
        <header className="mb-8">
          <p className="text-sm font-semibold tracking-widest text-[#A18A7B]">
            YEYLA · ADMINISTRACIÓN
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            Gestión de colores
          </h1>

          <p className="mt-2 text-[#806D60]">
            Registra y administra los colores disponibles para los productos.
          </p>
        </header>

        {/* Bienvenida */}
        <section className="mb-8 rounded-3xl bg-[#D6C0AE] p-7">
          <h2 className="text-2xl font-bold">
            Variedad de colores
          </h2>

          <p className="mt-2 text-[#59483F]">
            Organiza los colores de tu inventario y mantén actualizada la
            información de tu tienda.
          </p>
        </section>

        {/* Formulario */}
        <section className="mb-8 rounded-2xl border border-[#E8D8CC] bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-bold">
            {idEditar ? "Editar color" : "Registrar color"}
          </h2>

          <form onSubmit={guardarColor} className="space-y-5">
            <div>
              <label className="mb-2 block font-medium">
                Nombre del color
              </label>

              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej. Beige, Negro, Rosado"
                required
                className="w-full rounded-xl border border-[#E8D8CC] p-3 outline-none focus:border-[#B89B88]"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                className="rounded-xl bg-[#A17D68] px-6 py-3 font-semibold text-white transition hover:bg-[#80614F]"
              >
                {idEditar ? "Guardar cambios" : "Registrar color"}
              </button>

              {idEditar !== null && (
                <button
                  type="button"
                  onClick={limpiarFormulario}
                  className="rounded-xl border border-[#D6C0AE] px-6 py-3 hover:bg-[#F8F3EE]"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </section>

        {/* Mensajes */}
        {mensaje && (
          <p className="mb-5 rounded-xl bg-[#E5EFE5] p-4 text-[#426442]">
            {mensaje}
          </p>
        )}

        {error && (
          <p className="mb-5 rounded-xl bg-red-100 p-4 text-red-700">
            {error}
          </p>
        )}

        {/* Detalle del color */}
        {colorSeleccionado && (
          <section className="mb-8 rounded-2xl border border-[#E8D8CC] bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold">
              Detalle del color
            </h2>

            <p>
              <strong>ID:</strong> {colorSeleccionado.id_color}
            </p>

            <p>
              <strong>Nombre:</strong> {colorSeleccionado.nombre_color}
            </p>

            <button
              onClick={() => setColorSeleccionado(null)}
              className="mt-4 rounded-xl border border-[#D6C0AE] px-5 py-2 hover:bg-[#F8F3EE]"
            >
              Cerrar
            </button>
          </section>
        )}

        {/* Tabla */}
        <section className="rounded-2xl border border-[#E8D8CC] bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-bold">
            Colores registrados
          </h2>

          {cargando ? (
            <p className="text-[#806D60]">Cargando colores...</p>
          ) : colores.length === 0 ? (
            <p className="text-[#927D6F]">
              No hay colores registrados.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[#E8D8CC] bg-[#F8F3EE]">
                    <th className="p-3">ID</th>
                    <th className="p-3">Nombre del color</th>
                    <th className="p-3">Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {colores.map((color) => (
                    <tr
                      key={color.id_color}
                      className="border-b border-[#F2E8DF]"
                    >
                      <td className="p-3">{color.id_color}</td>

                      <td className="p-3 font-medium">
                        {color.nombre_color}
                      </td>

                      <td className="p-3">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => verColor(color.id_color)}
                            className="rounded-lg bg-[#D6C0AE] px-3 py-2 text-[#59483F] hover:bg-[#C6AB97]"
                          >
                            Ver
                          </button>

                          <button
                            onClick={() => prepararEdicion(color)}
                            className="rounded-lg bg-[#A17D68] px-3 py-2 text-white hover:bg-[#80614F]"
                          >
                            Editar
                          </button>

                          <button
                            onClick={() => eliminarColor(color.id_color)}
                            className="rounded-lg bg-[#59483F] px-3 py-2 text-white hover:bg-[#3F322C]"
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

        <footer className="mt-8 text-center text-sm text-[#A18A7B]">
          YEYLA © 2026 · Gestión de colores
        </footer>

      </div>
    </main>
  );
}
