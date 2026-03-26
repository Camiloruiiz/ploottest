# language: es
Característica: Despliegue base en Vercel

  Como equipo de desarrollo
  Quiero desplegar el boilerplate en Vercel
  Para validar que la plataforma objetivo queda operativa desde el inicio

  Escenario: Desplegar una aplicacion minima
    Dado que existe un boilerplate funcional del proyecto
    Cuando se despliega en Vercel
    Entonces la aplicacion debe quedar accesible en un entorno publico

  Escenario: Configurar variables de entorno
    Dado que la aplicacion depende de Supabase
    Cuando se configura el despliegue
    Entonces las variables de entorno necesarias deben quedar definidas en Vercel

  Escenario: Verificar entorno base operativo
    Dado que la aplicacion ya esta desplegada
    Cuando se accede al entorno publicado
    Entonces la aplicacion debe responder correctamente como base para el desarrollo posterior

