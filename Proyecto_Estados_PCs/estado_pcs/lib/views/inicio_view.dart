import 'package:flutter/material.dart';

class InicioView extends StatelessWidget {
  const InicioView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Resumen', style: TextStyle(fontWeight: FontWeight.bold))),
      body: const Center(child: Text('Gráficos y estadísticas rápidas aquí')),
    );
  }
}