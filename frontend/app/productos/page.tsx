
"use client";

import { useEffect, useState } from "react";

interface Producto {
  id_producto: number;
  nombre_producto: string;
  descripcion: string;
  precio: number;
  id_categoria: number;
  id_talla: number | null;
  id_color: number | null;
}

interface Categoria {
  id_categoria: number;
  nombre_categoria: string;
}

interface Talla {
  id_talla: number;
  numero_talla: string;
  tipo_producto: string;
}

interface Color {
  id_color: number;
  nombre_color: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function ProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [tallas, setTallas] = useState<Talla[]>([]);
  const [colores, setColores] = useState<Color[]>([]);

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [idCategoria, setIdCategoria] = useState("");
  const [idTalla, setIdTalla] = useState("");
  const [idColor, setIdColor] = useState("");

  const [idEditar, setIdEditar] = useState<number | null>(null);
  const [productoSeleccionado, setProductoSeleccionado] =
    useState<Producto | null>(null);

  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  async function leerRespuesta(respuesta: Response) {
    const texto = await respuesta.text();
    return texto ? JSON.parse(texto) : {};
  }

  function obtenerLista(datos: any, propiedad: string) {
    if (Array.isArray(datos)) return datos;
    return datos[propiedad] || datos.data || [];
  }

  async function cargarDatos() {
    setCargando(true);
    setError("");

    try {
      const [resProductos, resCategorias, resTallas, resColores] =
        await Promise.all([
          fetch(`${API_URL}/api/productos`),
          fetch(`${API_URL}/api/categorias`),
          fetch(`${API_URL}/api/tallas`),
          fetch(`${API_URL}/api/colores`),
        ]);

      const [datosProductos, datosCategorias, datosTallas, datosColores] =
        await Promise.all([
          leerRespuesta(resProductos),
          leerRespuesta(resCategorias),
          leerRespuesta(resTallas),
          leerRespuesta(resColores),
        ]);

      if (
        !resProductos.ok ||
        !resCategorias.ok ||
        !resTallas.ok ||
        !resColores.ok
      ) {
        throw new Error("No fue posible consultar toda la información.");
      }

      setProductos(obtenerLista(datosProductos, "productos"));
      setCategorias(obtenerLista(datosCategorias, "categorias"));
      setTallas(obtenerLista(datosTallas, "tallas"));
      setColores(obtenerLista(datosColores, "colores"));
    } catch {
      setError(
        "No fue posible cargar los datos. Verifica que el backend esté funcionando."
      );
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarDatos();
  }, []);

  function limpiarFormulario() {
    setIdEditar(null);
    setNombre("");
    setDescripcion("");
    setPrecio("");
    setIdCategoria("");
    setIdTalla("");
    setIdColor("");
  }

  async function guardarProducto(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMensaje("");
    setError("");

    const producto = {
      nombre_producto: nombre.trim(),
      descripcion: descripcion.trim(),
      precio: Number(precio),
      id_categoria: Number(idCategoria),
      id_talla: idTalla ? Number(idTalla) : null,
      id_color: idColor ? Number(idColor) : null,
    };

    try {
      const respuesta = await fetch(
        idEditar
          ? `${API_URL}/api/productos/${idEditar}`
          : `${API_URL}/api/productos`,
        {
          method: idEditar ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(producto),
        }
      );

      const datos = await leerRespuesta(respuesta);

      if (!respuesta.ok) {
        throw new Error(datos.mensaje || "No se pudo guardar el producto.");
      }

      setMensaje(
        idEditar
          ? "Producto actualizado correctamente."
          : "Producto registrado correctamente."
      );

      limpiarFormulario();
      await cargarDatos();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Ocurrió un error al guardar."
      );
    }
  }

  async function verProducto(id: number) {
    setMensaje("");
    setError("");

    try {
      const respuesta = await fetch(`${API_URL}/api/productos/${id}`);
      const datos = await leerRespuesta(respuesta);

      if (!respuesta.ok) {
        throw new Error(datos.mensaje || "No se pudo consultar el producto.");
      }

      setProductoSeleccionado(datos.producto || datos.data || datos);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Ocurrió un error al consultar."
      );
    }
  }

  function prepararEdicion(producto: Producto) {
    setIdEditar(producto.id_producto);
    setNombre(producto.nombre_producto);
    setDescripcion(producto.descripcion || "");
    setPrecio(String(producto.precio));
    setIdCategoria(String(producto.id_categoria));
    setIdTalla(producto.id_talla ? String(producto.id_talla) : "");
    setIdColor(producto.id_color ? String(producto.id_color) : "");
    setProductoSeleccionado(null);
    setMensaje("");
    setError("");
  }

  async function eliminarProducto(id: number) {
    if (!window.confirm("¿Estás segura de eliminar este producto?")) {
      return;
    }

    setMensaje("");
    setError("");

    try {
      const respuesta = await fetch(`${API_URL}/api/productos/${id}`, {
        method: "DELETE",
      });

      const datos = await leerRespuesta(respuesta);

      if (!respuesta.ok) {
        throw new Error(datos.mensaje || "No se pudo eliminar el producto.");
      }

      setMensaje("Producto eliminado correctamente.");
      setProductoSeleccionado(null);
      await cargarDatos();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Ocurrió un error al eliminar."
      );
    }
  }

  function nombreCategoria(id: number) {
    return categorias.find((c) => c.id_categoria === id)?.nombre_categoria || "Sin categoría";
  }

  function nombreTalla(id: number | null) {
    if (!id) return "No aplica";
    const talla = tallas.find((t) => t.id_talla === id);
    return talla ? talla.numero_talla : "No disponible";
  }

  function nombreColor(id: number | null) {
    if (!id) return "No aplica";
    return colores.find((c) => c.id_color === id)?.nombre_color || "No disponible";
  }

  return (
    <main className="min-h-screen bg-[#F8F3EE] p-6 text-[#59483F] md:p-10">
      <div className="mx-auto max-w-6xl">

        <header className="mb-8">
          <p className="text-sm font-semibold tracking-widest text-[#A18A7B]">
            YEYLA · ADMINISTRACIÓN
          </p>
          <h1 className="mt-2 text-3xl font-bold">
            Gestión de productos
          </h1>
          <p className="mt-2 text-[#806D60]">
            Registra y administra los productos de tu tienda.
          </p>
        </header>

        <section className="mb-8 rounded-3xl bg-[#D6C0AE] p-7">
          <h2 className="text-2xl font-bold">Nuestros productos</h2>
          <p className="mt-2 text-[#59483F]">
            Mantén organizado tu inventario y la información de cada producto.
          </p>
        </section>

        <section className="mb-8 rounded-2xl border border-[#E8D8CC] bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-bold">
            {idEditar ? "Editar producto" : "Registrar producto"}
          </h2>

          <form onSubmit={guardarProducto} className="grid gap-5 md:grid-cols-2">

            <div>
              <label className="mb-2 block font-medium">Nombre del producto</label>
              <input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej. Pijama floreada"
                required
                className="w-full rounded-xl border border-[#E8D8CC] p-3 outline-none focus:border-[#B89B88]"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium">Precio</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                placeholder="Ej. 58000"
                required
                className="w-full rounded-xl border border-[#E8D8CC] p-3 outline-none focus:border-[#B89B88]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block font-medium">Descripción</label>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Describe las características del producto"
                rows={3}
                className="w-full rounded-xl border border-[#E8D8CC] p-3 outline-none focus:border-[#B89B88]"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium">Categoría</label>
              <select
                value={idCategoria}
                onChange={(e) => setIdCategoria(e.target.value)}
                required
                className="w-full rounded-xl border border-[#E8D8CC] bg-white p-3 outline-none focus:border-[#B89B88]"
              >
                <option value="">Selecciona una categoría</option>
                {categorias.map((categoria) => (
                  <option key={categoria.id_categoria} value={categoria.id_categoria}>
                    {categoria.nombre_categoria}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block font-medium">Talla</label>
              <select
                value={idTalla}
                onChange={(e) => setIdTalla(e.target.value)}
                className="w-full rounded-xl border border-[#E8D8CC] bg-white p-3 outline-none focus:border-[#B89B88]"
              >
                <option value="">No aplica</option>
                {tallas.map((talla) => (
                  <option key={talla.id_talla} value={talla.id_talla}>
                    {talla.numero_talla} - {talla.tipo_producto}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block font-medium">Color</label>
              <select
                value={idColor}
                onChange={(e) => setIdColor(e.target.value)}
                className="w-full rounded-xl border border-[#E8D8CC] bg-white p-3 outline-none focus:border-[#B89B88]"
              >
                <option value="">No aplica</option>
                {colores.map((color) => (
                  <option key={color.id_color} value={color.id_color}>
                    {color.nombre_color}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-wrap items-end gap-3 md:col-span-2">
              <button
                type="submit"
                className="rounded-xl bg-[#A17D68] px-6 py-3 font-semibold text-white transition hover:bg-[#80614F]"
              >
                {idEditar ? "Guardar cambios" : "Registrar producto"}
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

        {productoSeleccionado && (
          <section className="mb-8 rounded-2xl border border-[#E8D8CC] bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold">Detalle del producto</h2>
            <p><strong>ID:</strong> {productoSeleccionado.id_producto}</p>
            <p><strong>Nombre:</strong> {productoSeleccionado.nombre_producto}</p>
            <p><strong>Descripción:</strong> {productoSeleccionado.descripcion}</p>
            <p><strong>Precio:</strong> ${Number(productoSeleccionado.precio).toLocaleString("es-CO")}</p>
            <p><strong>Categoría:</strong> {nombreCategoria(productoSeleccionado.id_categoria)}</p>
            <p><strong>Talla:</strong> {nombreTalla(productoSeleccionado.id_talla)}</p>
            <p><strong>Color:</strong> {nombreColor(productoSeleccionado.id_color)}</p>
            <button
              onClick={() => setProductoSeleccionado(null)}
              className="mt-4 rounded-xl border border-[#D6C0AE] px-5 py-2 hover:bg-[#F8F3EE]"
            >
              Cerrar
            </button>
          </section>
        )}

        <section className="rounded-2xl border border-[#E8D8CC] bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-bold">Productos registrados</h2>

          {cargando ? (
            <p className="text-[#806D60]">Cargando productos...</p>
          ) : productos.length === 0 ? (
            <p className="text-[#927D6F]">No hay productos registrados.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[#E8D8CC] bg-[#F8F3EE]">
                    <th className="p-3">ID</th>
                    <th className="p-3">Producto</th>
                    <th className="p-3">Precio</th>
                    <th className="p-3">Categoría</th>
                    <th className="p-3">Talla</th>
                    <th className="p-3">Color</th>
                    <th className="p-3">Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {productos.map((producto) => (
                    <tr key={producto.id_producto} className="border-b border-[#F2E8DF]">
                      <td className="p-3">{producto.id_producto}</td>
                      <td className="p-3 font-medium">{producto.nombre_producto}</td>
                      <td className="p-3">
                        ${Number(producto.precio).toLocaleString("es-CO")}
                      </td>
                      <td className="p-3">{nombreCategoria(producto.id_categoria)}</td>
                      <td className="p-3">{nombreTalla(producto.id_talla)}</td>
                      <td className="p-3">{nombreColor(producto.id_color)}</td>
                      <td className="p-3">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => verProducto(producto.id_producto)}
                            className="rounded-lg bg-[#D6C0AE] px-3 py-2 text-[#59483F] hover:bg-[#C6AB97]"
                          >
                            Ver
                          </button>
                          <button
                            onClick={() => prepararEdicion(producto)}
                            className="rounded-lg bg-[#A17D68] px-3 py-2 text-white hover:bg-[#80614F]"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => eliminarProducto(producto.id_producto)}
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
          YEYLA © 2026 · Gestión de productos
        </footer>
      </div>
    </main>
  );
}
