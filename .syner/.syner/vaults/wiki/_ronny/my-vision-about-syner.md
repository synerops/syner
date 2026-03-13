# Esto debe tratarse como un prompt

> Este artículo define cómo construir un sistema de agentes orquestados usando markdown, vaults, y skills. Sin bash scripts, sin crons, sin hardware caro. La versión democratizada.

## The raise of supervision

Los humanos analiza, concluye, piensa (algunos de nosotros re-pensamos de más), y toma decisiones, somos la inteligencia real. Pero tenemos una limitante: no somos lo más rápidos, requerimos de algo que ejecute más rápido que nosotros, esa es la inteligencia artificial.

La IA nos ha demostrado que puede hacer en menor tiempo nuestro trabajo, y eso a muchos les ha levantado un red flag: y qué voy a hacer yo? Pues supervisar.

## You need an orchestrator that understands your context

Ahora que sabemos que somos supervisores, qué necesitamos en nuestro equipo? Para mí dos cosas son importantes:

1. Contexto personalizado
2. Delegar responsabilidades

### Context Engineer

No lo busques afuera, el mejor context engineer que puedes tener eres vos mismo. Que nadie te imponga cómo organizarte, cómo estructurar tus ideas, eres vos y tu forma de ver el mundo cómo debería de funcionar la IA.

Pero si la IA es generalista cómo puedo personalizarlo?
La respuesta siempre ha estado ahí: markdown.
Con markdown puedes crear notas, ideas, pensamientos, circunstancias, cada una de ellas pueden evolucionar a proyectos, feedback, proyecciones.

Un coding agent necesita entender tu código, pero un **Context Agent** necesita entenderte a vos y a tu proyecto.

### Orchestrator

Si entendemos bien la necesidad de un buen contexto, entenderemos también la importancia de un orquestador. Alguien a quién delegar, alguien que pueda tener el contexto suficiente para tomar decisiones del día a día.

Si te gusta escribir, el orquestador debe saber cuál es tu postura, tu tono, tu personalidad, ejemplos reales, cosas que evitar, lo sabe porque vos lo tienes anotado en tus vaults.

Si te gusta programar, el orquestador saber cuál es tu estilo, tus best practices, tu arquitectura mental. Y de nuevo, lo sabe porque lo tienes en tus vaults.

Un orquestador se deja guiar por tu estructura, no tienes que hablar con la IA, no tienes que hablar con un coding agent, solo tienes que enfocarte que el orquestador te entienda y sepa donde buscar dependiendo de la intención.

Yo tengo el mío, Syner, un orquestador basado en archivos y notas en Markdown. Le llamo The Markdown Agent, porque toda su capacidad se basa en comprender los markdown de mis vaults.

## Reportes de forma que yo entienda

No se han puesto a pensar cómo han evolucionado las herramientas de trabajo? Todas tienen un objetivo: reportar.

Slack tiene sus channels, WhatsApp sus grupos, CI/CD pipelines checks. Mi punto es, un orquestador debería ser integrable.

Integrar un agente con herramientas es tarea que cada día se simplifica. Existían los MCPs (ahora elevados al mundo corporativo y al mismo tiempo siendo reemplazados por mejores approaches), Skills, APIs, CLIs.

## Loop

Un orquestador debe vivir bajo un feedback loop específico, aquí hay mucha variedad de opiniones, a mí personalmente me gusta la forma tan práctica que [Claude Code trabaja](https://claude.com/blog/building-agents-with-the-claude-agent-sdk), primero construyes Contexto, que forma un plan de Acción, y luego te presenta los resultados para su debida Verificación.

Si lo pensamos, es el ejercicio más básico de validación, y si no nos gusta, se repite el proceso. Y la repetición trae sistemas, y los sistemas se automatizan.

## Syner

Syner es un agente que combina todos esos aspectos. Muta entre diferentes ambientes.

Para Coding Agents, Syner es un Context Engineer Agéntico (syner.md).
Para Multi-Agent Systems, Syner es un Orquestador (syner.dev).
Para Agent Protocols, Syner es el puente de Integración (syner.bot).
  
Para mi Syner es Synergy, Agentic Synergy.
