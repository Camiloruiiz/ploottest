# language: es
Característica: Automatizacion CI/CD

  Como equipo de desarrollo
  Quiero automatizar validaciones y despliegues
  Para reducir errores manuales y ganar confianza operativa

  Escenario: Validar cambios de forma automatica
    Dado que el sistema evoluciona con nuevas entregas
    Cuando se integra una estrategia de CI
    Entonces los cambios deben poder validarse automaticamente antes de su integracion

  Escenario: Ejecutar pruebas de forma automatica
    Dado que el proyecto cuenta con pruebas unitarias y E2E
    Cuando se automatiza el pipeline
    Entonces las pruebas deben poder ejecutarse como parte del flujo de integracion

  Escenario: Controlar despliegues entre entornos
    Dado que el sistema se publica en un entorno operativo
    Cuando se evoluciona hacia CD
    Entonces los despliegues deben poder gestionarse de forma mas controlada y repetible
