import 'package:flutter/material.dart';

class EquiposView extends StatelessWidget {
  const EquiposView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Gestión de Equipos')),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: 5, // Cambiar por datos de la API
        itemBuilder: (context, index) {
          return Card(
            elevation: 0,
            color: Colors.white,
            margin: const EdgeInsets.only(bottom: 12),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
              side: BorderSide(color: Colors.grey.shade200),
            ),
            child: ListTile(
              leading: const CircleAvatar(backgroundColor: Colors.green, radius: 8), // Semáforo
              title: Text('PC-317-0${index + 1}', style: const TextStyle(fontWeight: FontWeight.w600)),
              subtitle: const Text('Core i7 - 16GB'),
              trailing: const Icon(Icons.chevron_right),
              onTap: () {
                // Navegar a detalles del equipo
              },
            ),
          );
        },
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
        },
        icon: const Icon(Icons.add),
        label: const Text('Nuevo Equipo'),
      ),
    );
  }
}