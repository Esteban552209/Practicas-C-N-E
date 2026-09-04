import 'package:flutter/material.dart';
import '../services/api_service.dart';

class ModalCrearSalon extends StatefulWidget {
  final VoidCallback onGuardado; 

  const ModalCrearSalon({super.key, required this.onGuardado});

  @override
  State<ModalCrearSalon> createState() => _ModalCrearSalonState();
}

class _ModalCrearSalonState extends State<ModalCrearSalon> {
  final TextEditingController _nombreController = TextEditingController();
  bool _isSubmitting = false;

  @override
  void dispose() {
    _nombreController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: Color(0xFF1E1E1E),
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      padding: EdgeInsets.only(
        bottom: MediaQuery.of(context).viewInsets.bottom + 24, // Sube con el teclado
        left: 24,
        right: 24,
        top: 24,
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Añadir Nuevo Salón', style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: Colors.white)),
          const SizedBox(height: 24),
          TextField(
            controller: _nombreController,
            style: const TextStyle(color: Colors.white),
            decoration: InputDecoration(
              hintText: 'Ej: Salón 318',
              hintStyle: const TextStyle(color: Colors.grey),
              filled: true,
              fillColor: const Color(0xFF2A2A2A),
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
              focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Colors.cyan)),
            ),
          ),
          const SizedBox(height: 24),
          SizedBox(
            width: double.infinity, height: 52,
            child: ElevatedButton(
              style: ElevatedButton.styleFrom(backgroundColor: Colors.cyan, foregroundColor: Colors.black),
              onPressed: _isSubmitting ? null : () async {
                final nombre = _nombreController.text.trim();
                if (nombre.isEmpty) return; // Validación simple
                
                setState(() => _isSubmitting = true);
                
                try {
                  await ApiService.crearSalon(nombre);
                  widget.onGuardado(); // Llamamos a la función "prop" que nos pasaron
                } catch (e) {
                  setState(() => _isSubmitting = false);
                  if (context.mounted) {
                    ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Error al crear el salón')));
                  }
                }
              },
              child: _isSubmitting 
                  ? const CircularProgressIndicator(color: Colors.black) 
                  : const Text('GUARDAR SALÓN', style: TextStyle(fontWeight: FontWeight.bold)),
            ),
          ),
        ],
      ),
    );
  }
}