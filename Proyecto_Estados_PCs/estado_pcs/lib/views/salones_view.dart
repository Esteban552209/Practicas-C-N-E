import 'package:flutter/material.dart';

class SalonesView extends StatelessWidget {
  const SalonesView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Salones')),
      body: const Center(child: Text('Lista de salones aquí')),
      floatingActionButton: FloatingActionButton(
        onPressed: () {}, // Crear nuevo salón
        child: const Icon(Icons.add),
      ),
    );
  }
}