import 'package:flutter/material.dart';
import '../services/api_service.dart';

class ModalEditarSalon extends StatefulWidget {
  final Map<String, dynamic> salon;
  final VoidCallback onGuardado;

  const ModalEditarSalon({super.key, required this.salon, required this.onGuardado});

  @override
  State<ModalEditarSalon> createState() => _ModalEditarSalonState();
}

class _ModalEditarSalonState extends State<ModalEditarSalon> {
  late TextEditingController _nombreController;
  bool _isSubmitting = false;

  @override
  void initState() {
    super.initState();
    _nombreController = TextEditingController(text: widget.salon['nombre']);
  }

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
        bottom: MediaQuery.of(context).viewInsets.bottom + 24,
        left: 24, right: 24, top: 24,
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Editar Salón', style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: Colors.white)),
          const SizedBox(height: 24),
          TextField(
            controller: _nombreController,
            style: const TextStyle(color: Colors.white),
            decoration: InputDecoration(
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
                if (nombre.isEmpty) return;
                
                setState(() => _isSubmitting = true);
                try {
                  await ApiService.editarSalon(widget.salon['id'], nombre);
                  widget.onGuardado();
                } catch (e) {
                  setState(() => _isSubmitting = false);
                  if (context.mounted) {
                    ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Error al editar')));
                  }
                }
              },
              child: _isSubmitting 
                  ? const CircularProgressIndicator(color: Colors.black) 
                  : const Text('ACTUALIZAR SALÓN', style: TextStyle(fontWeight: FontWeight.bold)),
            ),
          ),
        ],
      ),
    );
  }
}