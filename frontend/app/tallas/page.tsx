"use client";

import { useEffect, useState } from "react";

interface Talla {
  id_talla: number;
  numero_talla: string;
  tipo_producto: string;
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function TallasPage() {
  const [tallas, setTallas] = useState<Talla[]>([]);
  const [numero, setNumero] = useState("");
  const [tipoProducto, setTipoProducto] = useState("");
  const [idEditar, setIdEditar] = useState<number | null>(null);
  const [tallaSeleccionada, setTallaSeleccionada] = useState<Talla | null>(null);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  async function leerRespuesta(respuesta: Response) {
    const texto = await respuesta.text();
    return texto ? JSON.parse(texto) : {};
  }

  async function cargarTallas() {
    setCargando(true);
    setError("");

    try {
      const respuesta = await fetch(`${API_URL}/api/tallas`);
      const datos = await leerRespuesta(respuesta);

      if (!respuesta.ok) {
        throw new Error(datos.mensaje || "No se pudieron consultar las tallas.");
      }

      const lista = Array.isArray(datos)
        ? datos
        : datos.tallas || datos.data || [];

      setTallas(lista);
    } catch {
      setError("No fue posible cargar las tallas. Verifica la conexión con el servidor.");
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
        throw new Error(datos.mensaje || "No se pudo guardar la talla.");
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
        err instanceof Error ? err.message : "Ocurrió un error al guardar."
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
        throw new Error(datos.mensaje || "No se pudo consultar la talla.");
      }

      setTallaSeleccionada(datos.talla || datos.data || datos);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Ocurrió un error al consultar."
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
    if (!window.confirm("¿Estás segura de eliminar esta talla?")) {
      return;
    }

    setMensaje("");
    setError("");

    try {
      const respuesta = await fetch(`${API_URL}/api/tallas/${id}`, {
        method: "DELETE",
      });

      const datos = await leerRespuesta(respuesta);

      if (!respuesta.ok) {
        throw new Error(datos.mensaje || "No se pudo eliminar la talla.");
      }

      setMensaje("Talla eliminada correctamente.");
      await cargarTallas();
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
          Administración de tallas
        </h1>

        <p className="mb-8 text-gray-600">
          Registra y administra las tallas de la boutique.
        </p>

        <section className="mb-8 rounded-xl bg-white p-6 shadow">
          <h2 className="mb-5 text-xl font-semibold">
            {idEditar ? "Editar talla" : "Registrar talla"}
          </h2>

          <form onSubmit={guardarTalla} className="space-y-4">
            <div>
              <label className="mb-1 block font-medium">
                Número de talla
              </label>
              <input
                type="text"
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
                placeholder="Ej. S, M, L o 36"
                required
                className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-pink-500"
              />
            </div>

            <div>
              <label className="mb-1 block font-medium">
                Tipo de producto
              </label>
              <input
                type="text"
                value={tipoProducto}
                onChange={(e) => setTipoProducto(e.target.value)}
                placeholder="Ej. Camisa, pantalón o vestido"
                required
                className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-pink-500"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                className="rounded-lg bg-pink-600 px-5 py-3 font-medium text-white hover:bg-pink-700"
              >
                {idEditar ? "Guardar cambios" : "Registrar talla"}
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

        {tallaSeleccionada && (
          <section className="mb-6 rounded-xl bg-white p-6 shadow">
            <h2 className="mb-3 text-xl font-semibold">Detalle de la talla</h2>
            <p><strong>ID:</strong> {tallaSeleccionada.id_talla}</p>
            <p><strong>Número:</strong> {tallaSeleccionada.numero_talla}</p>
            <p><strong>Tipo de producto:</strong> {tallaSeleccionada.tipo_producto}</p>
            <button
              onClick={() => setTallaSeleccionada(null)}
              className="mt-3 rounded-lg border border-gray-300 px-4 py-2"
            >
              Cerrar
            </button>
          </section>
        )}

        <section className="rounded-xl bg-white p-6 shadow">
          <h2 className="mb-5 text-xl font-semibold">Tallas registradas</h2>

          {cargando ? (
            <p>Cargando tallas...</p>
          ) : tallas.length === 0 ? (
            <p className="text-gray-500">No hay tallas registradas.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="p-3">ID</th>
                    <th className="p-3">Número</th>
                    <th className="p-3">Tipo de producto</th>
                    <th className="p-3">Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {tallas.map((talla) => (
                    <tr key={talla.id_talla} className="border-b">
                      <td className="p-3">{talla.id_talla}</td>
                      <td className="p-3">{talla.numero_talla}</td>
                      <td className="p-3">{talla.tipo_producto}</td>
                      <td className="p-3">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => verTalla(talla.id_talla)}
                            className="rounded bg-gray-600 px-3 py-2 text-white hover:bg-gray-700"
                          >
                            Ver
                          </button>

                          <button
                            onClick={() => prepararEdicion(talla)}
                            className="rounded bg-blue-600 px-3 py-2 text-white hover:bg-blue-700"
                          >
                            Editar
                          </button>

                          <button
                            onClick={() => eliminarTalla(talla.id_talla)}
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