import 'package:flutter/material.dart';
import '../services/api_service.dart';

class SalonesView extends StatefulWidget {
  const SalonesView({super.key});

  @override
  State<SalonesView> createState() => _SalonesViewState();
}

class _SalonesViewState extends State<SalonesView> {
  late Future<List<dynamic>> _futureSalones;

  @override
  void initState() {
    super.initState();
    _futureSalones = ApiService.getSalones();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Salones', style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: FutureBuilder<List<dynamic>>(
        future: _futureSalones,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator(color: Colors.cyan));
          } else if (snapshot.hasError) {
            return Center(child: Text('Error: ${snapshot.error}', style: const TextStyle(color: Colors.redAccent)));
          } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
            return const Center(child: Text('No hay salones creados', style: TextStyle(color: Colors.grey)));
          }

          final salones = snapshot.data!;
          return ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: salones.length,
            itemBuilder: (context, index) {
              final salon = salones[index];
              return Card(
                color: const Color(0xFF1E1E1E),
                elevation: 0,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                  side: BorderSide(color: Colors.cyan.withOpacity(0.3), width: 1),
                ),
                margin: const EdgeInsets.only(bottom: 12),
                child: ListTile(
                  title: Text(salon['nombre'], style: const TextStyle(fontWeight: FontWeight.w600)),
                  trailing: const Icon(Icons.arrow_forward_ios, color: Colors.cyan, size: 16),
                  onTap: () {
                  },
                ),
              );
            },
          );
        },
      ),
      floatingActionButton: FloatingActionButton(
        backgroundColor: Colors.cyan,
        onPressed: () {
        },
        child: const Icon(Icons.add, color: Colors.black),
      ),
    );
  }
}