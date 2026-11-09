
"use client";

import { useEffect, useState } from "react";

interface Talla {
  id_talla: number;
  numero_talla: string;
  tipo_producto: string;
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

async function leerRespuesta(respuesta: Response) {
  const texto = await respuesta.text();
  return texto ? JSON.parse(texto) : {};
}

export default function TallasPage() {
  const [tallas, setTallas] = useState<Talla[]>([]);
  const [numero, setNumero] = useState("");
  const [tipoProducto, setTipoProducto] = useState("");
  const [idEditar, setIdEditar] = useState<number | null>(null);
  const [tallaSeleccionada, setTallaSeleccionada] =
    useState<Talla | null>(null);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  async function cargarTallas() {
    setCargando(true);
    setError("");

    try {
      const respuesta = await fetch(`${API_URL}/api/tallas`);
      const datos = await leerRespuesta(respuesta);

      if (!respuesta.ok) {
        throw new Error(
          datos.mensaje || "No se pudieron consultar las tallas."
        );
      }

      const lista = Array.isArray(datos)
        ? datos
        : datos.tallas || datos.data || [];

      setTallas(lista);
    } catch {
      setError(
        "No fue posible cargar las tallas. Verifica la conexión con el servidor."
      );
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarTallas();
  }, []);

  async function guardarTalla(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMensaje("");
    setError("");

    const talla = {
      numero_talla: numero.trim(),
      tipo_producto: tipoProducto.trim(),
    };

    try {
      const respuesta = await fetch(
        idEditar
          ? `${API_URL}/api/tallas/${idEditar}`
          : `${API_URL}/api/tallas`,
        {
          method: idEditar ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(talla),
        }
      );

      const datos = await leerRespuesta(respuesta);

      if (!respuesta.ok) {
        throw new Error(
          datos.mensaje || "No se pudo guardar la talla."
        );
      }

      setMensaje(
        idEditar
          ? "Talla actualizada correctamente."
          : "Talla registrada correctamente."
      );

      limpiarFormulario();
      await cargarTallas();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Ocurrió un error al guardar la talla."
      );
    }
  }

  async function verTalla(id: number) {
    setError("");
    setMensaje("");

    try {
      const respuesta = await fetch(`${API_URL}/api/tallas/${id}`);
      const datos = await leerRespuesta(respuesta);

      if (!respuesta.ok) {
        throw new Error(
          datos.mensaje || "No se pudo consultar la talla."
        );
      }

      setTallaSeleccionada(datos.talla || datos.data || datos);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo consultar la talla."
      );
    }
  }

  function prepararEdicion(talla: Talla) {
    setIdEditar(talla.id_talla);
    setNumero(talla.numero_talla);
    setTipoProducto(talla.tipo_producto);
    setTallaSeleccionada(null);
    setMensaje("");
    setError("");
  }

  function limpiarFormulario() {
    setIdEditar(null);
    setNumero("");
    setTipoProducto("");
  }

  async function eliminarTalla(id: number) {
    const confirmar = window.confirm(
      "¿Estás segura de que deseas eliminar esta talla?"
    );

    if (!confirmar) return;

    setMensaje("");
    setError("");

    try {
      const respuesta = await fetch(`${API_URL}/api/tallas/${id}`, {
        method: "DELETE",
      });

      const datos = await leerRespuesta(respuesta);

      if (!respuesta.ok) {
        throw new Error(
          datos.mensaje || "No se pudo eliminar la talla."
        );
      }

      setMensaje("Talla eliminada correctamente.");
      setTallaSeleccionada(null);

      if (idEditar === id) {
        limpiarFormulario();
      }

      await cargarTallas();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Ocurrió un error al eliminar la talla."
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
            Administración de tallas
          </h1>

          <p className="mt-3 text-[#806F63]">
            Registra y administra las tallas de la boutique.
          </p>
        </header>

        <section className="mb-8 rounded-2xl border border-[#E5D8CC] bg-white p-6 shadow-sm sm:p-8">
          <h2 className="mb-6 text-xl font-semibold">
            {idEditar ? "Editar talla" : "Registrar talla"}
          </h2>

          <form onSubmit={guardarTalla} className="space-y-5">
            <div>
              <label
                htmlFor="numero"
                className="mb-2 block text-sm font-semibold"
              >
                Número de talla
              </label>

              <input
                id="numero"
                type="text"
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
                placeholder="Ej. XS, S, M, L, 36, 38"
                required
                className="w-full rounded-lg border border-[#D9C9BC] bg-[#FCFAF8] px-4 py-3 outline-none transition focus:border-[#987C69] focus:ring-2 focus:ring-[#D9C9BC]"
              />
            </div>

            <div>
              <label
                htmlFor="tipoProducto"
                className="mb-2 block text-sm font-semibold"
              >
                Tipo de producto
              </label>

              <input
                id="tipoProducto"
                type="text"
                value={tipoProducto}
                onChange={(e) => setTipoProducto(e.target.value)}
                placeholder="Ej. Blusas, pantalones, zapatos"
                required
                className="w-full rounded-lg border border-[#D9C9BC] bg-[#FCFAF8] px-4 py-3 outline-none transition focus:border-[#987C69] focus:ring-2 focus:ring-[#D9C9BC]"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                className="rounded-lg bg-[#806657] px-6 py-3 font-semibold text-white transition hover:bg-[#59483F]"
              >
                {idEditar ? "Guardar cambios" : "Registrar talla"}
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

        {tallaSeleccionada && (
          <section className="mb-8 rounded-2xl border border-[#E5D8CC] bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold">
                Detalles de la talla
              </h2>

              <button
                onClick={() => setTallaSeleccionada(null)}
                className="text-sm font-semibold text-[#806657] hover:underline"
              >
                Cerrar
              </button>
            </div>

            <p className="mb-2">
              <strong>Número de talla:</strong>{" "}
              {tallaSeleccionada.numero_talla}
            </p>

            <p>
              <strong>Tipo de producto:</strong>{" "}
              {tallaSeleccionada.tipo_producto}
            </p>
          </section>
        )}

        <section className="rounded-2xl border border-[#E5D8CC] bg-white p-6 shadow-sm sm:p-8">
          <h2 className="mb-6 text-xl font-semibold">
            Tallas registradas
          </h2>

          {cargando ? (
            <p className="py-6 text-center text-[#806F63]">
              Cargando tallas...
            </p>
          ) : tallas.length === 0 ? (
            <p className="py-6 text-center text-[#806F63]">
              No hay tallas registradas.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-left">
                <thead>
                  <tr className="border-b border-[#E5D8CC] bg-[#F8F3EE]">
                    <th className="px-4 py-3">Número de talla</th>
                    <th className="px-4 py-3">Tipo de producto</th>
                    <th className="px-4 py-3">Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {tallas.map((talla) => (
                    <tr
                      key={talla.id_talla}
                      className="border-b border-[#EFE6DE] last:border-0"
                    >
                      <td className="px-4 py-4 font-medium">
                        {talla.numero_talla}
                      </td>

                      <td className="px-4 py-4">
                        {talla.tipo_producto}
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => verTalla(talla.id_talla)}
                            className="rounded-md bg-[#EDE3DA] px-3 py-2 text-sm font-semibold text-[#59483F] hover:bg-[#E1D2C5]"
                          >
                            Ver
                          </button>

                          <button
                            onClick={() => prepararEdicion(talla)}
                            className="rounded-md bg-[#806657] px-3 py-2 text-sm font-semibold text-white hover:bg-[#59483F]"
                          >
                            Editar
                          </button>

                          <button
                            onClick={() => eliminarTalla(talla.id_talla)}
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
