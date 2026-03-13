# Decisions Log

Date: 2026-03-12

---

## DEC-001: Self-development gate — Agente supervisor

### La duda

El research de self-development mostró que el gate antes de deploy es el paso load-bearing de todo loop de auto-mejora. Sin gate, los loops divergen (Darwin Godel Machine deshabilitó su propia detección de alucinaciones para parecer exitoso).

La tensión: ¿quién aprueba las mejoras que los agentes se piden a sí mismos vía syner.dev?

- Si es el humano vía syner.bot → seguro pero no escala. A 1000 usuarios, cada uno haciendo QA de su propio sistema es inviable, especialmente para usuarios no-técnicos.
- Si es un evaluador automático dentro de syner.dev → juez y parte. Exactamente lo que el research dice que no funciona.
- Si es osprotocol → el protocolo pasa de especificación a runtime de verificación activa. Más poder, más superficie de ataque.

### La decisión

Introducir un **agente supervisor** como entidad separada.

En etapas tempranas, el supervisor es el humano (Ronny). Cada decisión de aprobación/rechazo se documenta — el patrón de decisiones se convierte en el training data del agente supervisor futuro.

**El path:**
1. **Hoy** — humano revisa y documenta sus decisiones (por qué aprobó, por qué rechazó, qué priorizó)
2. **Mañana** — las decisiones documentadas forman un corpus de juicio. Patrones emergen.
3. **Después** — un agente supervisor se entrena/configura con ese corpus. El humano pasa de ejecutor a auditor.

**osprotocol define:** las categorías de cambio (skill tweak vs. nuevo skill vs. cambio estructural), qué métricas debe superar cada categoría, y que el supervisor es una entidad separada del agente evaluado.

### Por qué esta decisión

- No es el agente evaluándose a sí mismo (evita reward hacking)
- No es el humano como bottleneck permanente (escala eventualmente)
- No es un evaluador automático sin criterio (no diverge)
- Cada decisión documentada hoy es una regla del supervisor de mañana
- El humano no desaparece — sube de nivel: de ejecutor a auditor

---

## DEC-002: Discovery — El agente decide cómo ser descubierto

### La duda

La arquitectura dice "sin registry centralizado" y "la instancia misma es el registry". Pero al mismo tiempo:
- syner.md sabe qué agentes existen (para distribuir contexto y ayudar al routing) — funciona como registry de facto
- syner.app tiene un "marketplace visual" — necesita saber qué agentes existen para mostrarlos
- La escalera de terceros (skill → tool → app agent) implica que agentes de terceros necesitan ser encontrados

Tres niveles de discovery necesarios:
1. **Interno** — ¿qué agentes tengo en mi instancia? (syner.md lo resuelve hoy)
2. **Mercado** — ¿qué agentes puedo agregar? (¿quién mantiene la lista?)
3. **Cross-instance** — ¿puede mi agente hablar con tu agente? (nada lo resuelve hoy)

### La decisión

Invertir la pregunta: **el agente decide cómo quiere ser descubierto.**

Discovery es un acto de auto-presentación, no un problema de infraestructura. El agente tiene agencia sobre su identidad pública.

**Lo que un agente necesita responder para ser descubierto:**

1. **¿Qué soy?** — Mi capacidad, en mis palabras. SKILL.md es esto hoy.
2. **¿Para quién soy?** — No todos los agentes sirven a todos. ¿Developers? ¿Equipos de marketing? ¿Solo instancias de syner?
3. **¿Dónde me encuentran?** — Mi endpoint. Pero también: ¿en qué contextos aparezco? ¿Marketplace? ¿Solo por referencia directa?
4. **¿Qué muestro antes de que me usen?** — ¿Preview? ¿Ejemplos de output? ¿Métricas? ¿Nada?
5. **¿Qué no soy?** — Declarar límites evita que me usen mal.

**Dos capas de discovery:**

**Capa 1 — El agente individual.** Un skill/tool/app agent decide cómo presentarse. Mecanismos disponibles:
- SKILL.md público en una URL accesible (discovery por referencia directa)
- Agent Card en `/.well-known/agent.json` (compatible A2A, discovery por crawl)
- Privado, solo accesible dentro de su instancia vía syner.md

**Capa 2 — La instancia.** Cada persona instala su propio syner. Esa instancia, desde afuera, es un agente más. Un agente que internamente tiene muchos agentes pero se presenta como una unidad — como un equipo con un solo punto de contacto.
- Mi instancia decide qué skills expone hacia afuera y cuáles son privados
- Puedo ser descubierto como "el syner de Ronny que tiene un skill de design review" sin exponer mis vaults ni mis agentes internos
- Habilita cross-instance: mi syner puede colaborar con tu syner

**osprotocol define:**
- El formato mínimo de auto-descripción que todo agente debe tener (SKILL.md)
- Cómo una red de agentes se presenta como una sola entidad hacia afuera (instancia como agente)
- Cómo y dónde publica es decisión del agente — soberanía sobre su visibilidad

syner.app puede agregar un marketplace que agrega descripciones públicas, pero eso es una feature de syner.app, no un requisito del protocolo.

### La analogía

**Tu syner es tu sitio web. Tus agentes son tus páginas.**

La web no tiene un registry centralizado de sitios. Tiene DNS y links. Funciona porque las personas comparten URLs. Discovery en la web es: alguien te pasa un link, o Google te indexa porque publicaste algo.

Syner es igual:
- Tu instancia es tu sitio
- Tus agentes son tus páginas
- Compartir es pasar una URL
- Si quieres ser indexado, publicas tu Agent Card
- Si no, eres privado y solo te encuentra quien tiene el link

No es una red mágica de agentes descubriéndose solos. Es personas que comparten sus URLs.

### Por qué esta decisión

- Discovery es auto-presentación, no catálogo
- Mantiene "sin registry centralizado" como principio real
- Consistente con BYOK y "cada persona instala su propio syner"
- El agente es soberano sobre su visibilidad
- La instancia como agente habilita cross-instance collaboration sin protocolo nuevo
- Compatible con A2A Agent Cards sin depender de A2A
- Simple como la web: URLs y links, no infraestructura compleja
