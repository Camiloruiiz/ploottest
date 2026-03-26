# language: es
Característica: Boilerplate del stack

  Como equipo de desarrollo
  Quiero una base funcional del stack
  Para construir la primera version sobre una aplicacion operativa

  Escenario: Inicializar la aplicacion con el stack definido
    Dado que se ha definido el stack tecnologico del proyecto
    Cuando se crea el boilerplate base
    Entonces la aplicacion debe usar Next.js App Router, React, TypeScript, Supabase, shadcn/ui, React Query y Zod

  Escenario: Preparar estructura inicial del proyecto
    Dado que el proyecto parte de una base minima
    Cuando se organiza la estructura inicial
    Entonces deben existir las bases para app, componentes, acceso a datos, validacion y modulos funcionales

