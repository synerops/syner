# Dogfooding: Cómo simplificar el CLI de GitHub me llevó a rediseñar toda la arquitectura de packages

Ayer empecé con una tarea simple: simplificar el CLI de `@syner/github`. Terminé creando 2 skills nuevos y rediseñando cómo syner descubre e integra servicios externos.

## El problema original

Tenía un CLI con dos comandos:

```bash
syner-agent-github token              # obtener token
syner-agent-github exec -- gh ...     # ejecutar con GH_TOKEN inyectado
```

El comando `exec` hacía spawn de un subproceso con `GH_TOKEN` en el environment. Funcionaba, pero era innecesariamente complejo. ¿Por qué no simplemente autenticar `gh` una vez y usarlo directamente?

## La simplificación

Reduje todo a un solo comando:

```bash
bunx @syner/github create-app-token | gh auth login --with-token
```

Eso es todo. Después de eso, `gh` funciona normal. Eliminé ~50 líneas de código de spawn y manejo de subprocesos.

## Pero entonces...

Mientras actualizaba la documentación del package, me di cuenta de algo: tenía instrucciones para GitHub dispersas en varios lugares:

- `packages/github/SKILL.md` - un skill suelto
- `agents/syner-worker.md` - instrucciones hardcodeadas
- `skills/syner/SKILL.md` - referencias al CLI viejo

Y peor: ¿qué pasa cuando agregue más integraciones? ¿Vercel? ¿Notion? ¿Linear? No iba a escalar.

## La arquitectura que emergió

Necesitaba que los packages pudieran "registrar" sus capacidades de forma que syner las descubriera automáticamente. Así nació la estructura:

```
packages/<name>/skills/
├── context/SKILL.md   # qué información puede proveer
└── actions/SKILL.md   # qué acciones puede ejecutar
```

La clave es el **descubrimiento dinámico**. En vez de hardcodear "si el usuario menciona GitHub, usa este skill", ahora:

1. `syner-context` hace `Glob packages/**/skills/context/SKILL.md`
2. Lee la descripción de cada skill encontrado
3. El LLM decide cuáles son relevantes para la tarea actual
4. Invoca solo los necesarios

Lo mismo para acciones con `syner-worker`.

## Dogfooding al cuadrado

Para validar que la arquitectura funcionaba, decidí crear el package de Vercel siguiendo el nuevo patrón. Y ahí me di cuenta: necesitaba documentar cómo crear packages.

Así nació `/create-syner-package` - un skill que explica la arquitectura y guía la creación de nuevos packages.

Pero no era suficiente. ¿Cómo sé si un package está bien estructurado? ¿Si sus skills son descubribles? ¿Si el frontmatter es correcto?

Así nació `/test-syner-package` - un skill que valida la estructura, corre typecheck si existe, y hace un test agentico invocando `syner-context` para verificar que el skill se descubre y funciona.

## Lo que aprendí

1. **Simplificar un componente expone problemas en el sistema**. El CLI era complejo porque la arquitectura alrededor era ad-hoc.

2. **Dogfooding genera herramientas**. Al usar mi propio sistema para crear packages, descubrí qué faltaba: documentación (create) y validación (test).

3. **El descubrimiento dinámico escala mejor que el hardcoding**. Ahora puedo agregar un package de Linear y syner lo encontrará automáticamente, sin tocar código.

4. **Los skills son la unidad de composición**. No packages, no código - skills. Un package es solo un contenedor de skills relacionados.

## El resultado

**Antes:**
- CLI complejo con spawn de subprocesos
- Skills hardcodeados en varios lugares
- Agregar una integración requería modificar múltiples archivos

**Después:**
- CLI de un comando
- Skills auto-descubribles por convención
- Agregar una integración = crear un directorio con SKILL.md

Y de paso: 2 skills nuevos que hacen el sistema más fácil de extender.

---

*Lo que empezó como "simplificar un CLI" terminó siendo "rediseñar la arquitectura de plugins". A veces el mejor refactor es el que te lleva a cuestionar el sistema completo.*
