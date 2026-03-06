# syner-tools

Tools disponibles para agentes syner via Vercel Sandbox.

## Bash

Ejecuta comandos en un sandbox aislado (Vercel Sandbox).

**Cuándo usar:**
- Correr tests: `bun test`
- Correr builds: `bun run build`
- Ejecutar scripts: `node script.js`

**Ejemplo:**
```
Bash({ command: "bun test" })
```

## Fetch

Obtiene contenido de una URL como markdown (via sandbox).

**Cuándo usar:**
- Leer documentación
- Obtener contenido de páginas web

**Ejemplo:**
```
Fetch({ url: "https://ai-sdk.dev/docs/intro" })
```

## Seguridad

Ambos tools corren en Vercel Sandbox:
- **Bash**: Aísla ejecución de código arbitrario
- **Fetch**: Aísla el fetch, prompt injection queda contenido en sandbox
