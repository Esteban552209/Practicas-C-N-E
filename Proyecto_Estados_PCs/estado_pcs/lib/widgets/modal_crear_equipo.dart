import 'package:flutter/material.dart';
import '../services/api_service.dart';

class ModalCrearEquipo extends StatefulWidget {
  final String salonId;
  final VoidCallback onGuardado;

  const ModalCrearEquipo({super.key, required this.salonId, required this.onGuardado});

  @override
  State<ModalCrearEquipo> createState() => _ModalCrearEquipoState();
}

class _ModalCrearEquipoState extends State<ModalCrearEquipo> {
  final TextEditingController _codigoController = TextEditingController();
  bool _isSubmitting = false;

  @override
  void dispose() {
    _codigoController.dispose();
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
          const Text('Añadir Nuevo Equipo', style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: Colors.white)),
          const SizedBox(height: 24),
          const Text('Código del equipo:', style: TextStyle(color: Colors.grey)),
          const SizedBox(height: 8),
          TextField(
            controller: _codigoController,
            style: const TextStyle(color: Colors.white),
            decoration: InputDecoration(
              hintText: 'Ej: PC-317-05',
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
                final codigo = _codigoController.text.trim();
                if (codigo.isEmpty) return;
                
                setState(() => _isSubmitting = true);
                try {
                  await ApiService.crearEquipo(codigo, widget.salonId);
                  widget.onGuardado();
                } catch (e) {
                  setState(() => _isSubmitting = false);
                  if (context.mounted) {
                    ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Error al guardar el equipo')));
                  }
                }
              },
              child: _isSubmitting 
                  ? const CircularProgressIndicator(color: Colors.black) 
                  : const Text('GUARDAR EQUIPO', style: TextStyle(fontWeight: FontWeight.bold)),
            ),
          ),
        ],
      ),
    );
  }
}